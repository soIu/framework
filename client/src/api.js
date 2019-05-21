import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';
import RelationalPouch from 'relational-pouch';

PouchDB.plugin(PouchFind);
PouchDB.plugin(RelationalPouch);
window.PouchDB = PouchDB;
window.session_db = new PouchDB('session');

if (!window.rapyd_config) window.rapyd_config = {};

if (!window.localStorage.rapyd_server_url) {
  if (window.rapyd_config.url) {
    window.localStorage.rapyd_server_url = window.rapyd_config.url;
  }
  else if (window.location.protocol === 'file:') {
    window.localStorage.rapyd_server_url = 'http://localhost:8069';
  }
  else {
    window.localStorage.rapyd_server_url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ':8069');
  }
}

const locals = {};

function preload() {
  const root = document.getElementById('app');
  if (root) {
    const preloader = document.createElement('div');
    preloader.className = 'preloader-modal';
    preloader.insertAdjacentHTML('beforeend',`
    <div class="preloader color-white">
      <span class="preloader-inner">
        <span class="preloader-inner-gap"></span>
        <span class="preloader-inner-left">
          <span class="preloader-inner-half-circle"></span>
        </span>
        <span class="preloader-inner-right">
          <span class="preloader-inner-half-circle"></span>
        </span>
      </span>
    </div>`);
    const backdrop = document.createElement('div');
    backdrop.className = 'preloader-backdrop';
    root.insertAdjacentElement('beforeend', backdrop);
    root.insertAdjacentElement('beforeend', preloader);
    return {done: () => {
      preloader.remove();
      backdrop.remove();
    }};
  }
}

async function get_session() {
  const session_db = window.session_db;
  if (window.models) {
    return {models: window.models, tools: window.tools, local_db: window.local_db};
  }
  try {
    let session_object = await session_db.get('session');
    try {
      const new_session = await login({login: session_object.login, password: session_object.password, encrypted: true, client_js_time: session_object.client_js_time});
      if (!new_session) {
        await logout();
        window.location.reload();
      }
      else if (!new_session.client_js) {
        new_session.client_js = session_object.client_js;
      }
      session_object = new_session;
    }
    catch(error) {
      console.log(error);
    }
    await ORM(session_object);
    return {models: window.models, tools: window.tools, local_db: window.local_db};
  }
  catch(error) {
    console.log(error);
    return {};
  }
}

async function update_session(new_session) {
  const session = await window.session_db.get('session');
  return await window.session_db.put({...session, ...new_session});
}

async function login(args) {
  args.encrypted = args.encrypted ? true: false;
  const session = await ajax('post', 'json', window.localStorage.rapyd_server_url + '/api/login', args);
  if (session.status === 'denied') {
    return false;
  }
  else if (session.status === 'error') {
    throw Error("There are an error on the server");
  }
  try {
    const session_object = await window.session_db.get('session');
    session._rev = session_object._rev;
    session.unsaved = session_object.unsaved;
    session.client_js = session.client_js || session_object.client_js
    session.client_js_time = session.client_js_time || session_object.client_js_time
  }
  catch(error) {
    session.unsaved = {};
  }
  session._id = 'session';
  await window.session_db.put(session);
  return session;
}

async function logout() {
  try {
    const session = await window.session_db.get('session');
    await window.session_db.remove(session);
  }
  catch(error) {
    console.log(error);
  }
  window.local_db.destroy();
  return window.location.reload();
}

function wait_exist(fn) {
  return new Promise((resolve, reject) => {
    const clear = (id) => {
      clearInterval(id);
      resolve();
    }
    const interval = setInterval(() => {if (fn()) clear(interval)}, 0);
  });
}

async function ORM(session) {
  //window.localStorage.rapyd_server_url = session.url;
  // eslint-disable-next-line
  //new Function(session.client_js)();
  const script = document.createElement('script');
  const URL = window.URL || window.webkitURL;
  let blob;
  try {
    blob = new Blob([session.client_js]);
  }
  catch(error) {
    const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = BlobBuilder();
    blob.append(session.client_js);
    blob = blob.getBlob();
  }
  script.type = 'text/javascript';
  script.src = URL.createObjectURL(blob);
  /*script.text = '//<![CDATA[\n';
  script.text += session.client_js;
  script.text += '\n//]]>';*/
  document.body.appendChild(script);
  await wait_exist(() => window.models);
  const tools = window.tools;
  tools.configuration = Object.assign(tools.configuration, window.rapyd_config);
  tools.configuration.url = window.localStorage.rapyd_server_url;
  const models = window.models;
  models.env.context.unsaved = session.unsaved || {};
  models.env.user = models.env['res.users'].browse();
  models.env.user.id = session.id;
  models.env.user.login = session.login;
  models.env.user.password = session.password;
  /*for (let model in tools.view) {
    const views = tools.view[model];
    for (let mode in views) {
      if (hasValue(['id', 'string', 'custom_init'], mode)) {
        continue;
      }
      views[mode] = views[mode].replace(/([a-z]*-[a-z]*[/>\s])|([a-z]*[/>\s])/g, (string) => string.split('-').map((word) => word.slice(0, 1).toUpperCase() + word.slice(1)).join('')).replace(/>\s+|\s+</g, (s) => s.trim());
    }
  }*/
  tools.configuration.ajax_load = (options) => {if (!options.no_preload) options.preload = preload()};
  tools.configuration.ajax_resolve = (resolve, xhr, options) => {
    if (!options.no_preload) options.preload.done();
    resolve(xhr.response);
  }
  tools.configuration.ajax_reject = (reject, xhr, options) => {
    if (!options.no_preload) options.preload.done();
    reject(xhr);
  }
  locals.exceptionCount = 0;
  tools.configuration.exception = (error) => {
    /*if (locals.exceptionCount !== 0) return new Promise((resolve) => {
      locals.exceptionCount = 0;
      resolve(true);
      throw error;
    });*/
    locals.app.dialog.alert('There are some error');
    locals.exceptionCount += 1;
    throw error;
  }
  locals.warningCount = 0;
  tools.configuration.warning = (error, offline=false) => {
    if (locals.warningCount !== 0) return new Promise((resolve) => {
      locals.warningCount = 0;
      resolve(true);
      console.warn(error);
    });
    console.log(locals);
    if (offline) locals.app.toast.create({text: 'You are offline, using local data', closeButton: true, closeTimeout: 1000}).open();
    locals.warningCount += 1;
    console.warn(error);
  }
}

function ajax(type, dataType, url, data) {
  if (data !== undefined || null || false) {
    data = parseURI(data);
  }
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.onload = function() {
      resolve(this.response);
    };
    xhr.onerror = function() {
      reject(this.statusText);
    };
    if (dataType === undefined) {
      dataType = 'json';
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = dataType;
    try {
      xhr.send(data);
    }
    catch(error) {
      reject(error);
    }
  });
}

function parseURI(data) {
  const array = [];
  for (let key in data) {
    let value = data[key];
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    else if (value === '') {
      value = null;
    }
    array.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }
  return array.join('&');
}

function hasKey(object, key) {
  if (object === undefined || object === null || object === false) {
    return false;
  }
  return Object.keys(object).indexOf(key) > -1;
}

function hasValue(object, value) {
  if (object === undefined || object === null || object === false) {
    return false;
  }
  if ([Array, String].indexOf(object.constructor) < 0) {
    object = object.toString();
  }
  return object.indexOf(value) > -1;
}

export default {locals, preload, get_session, update_session, wait_exist, login, logout, ORM, ajax, parseURI, hasValue, hasKey};
