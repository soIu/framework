import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';
//import PouchSearch from 'pouchdb-quick-search';
import RelationalPouch from 'relational-pouch';

PouchDB.plugin(PouchFind);
//PouchDB.plugin(PouchSearch);
PouchDB.plugin(RelationalPouch);
PouchDB.plugin(require('pouchdb-debug').default);
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
    window.localStorage.rapyd_server_url = ((href) => href.substring(0, href.lastIndexOf('/')) + '/')(window.location.origin + window.location.pathname);
  }
}

const globals = {};

function preload() {
  const root = document.getElementById('app');
  if (root) {
    const object = {done: (value) => {
      globals.preload_count -= 1;
      if (globals.preload_count != 0) return value;
      else delete globals.preload_count;
      globals.preload_loader.remove();
      globals.preload_backdrop.remove();
      return value;
    }};
    if (!globals.preload_count) {
      globals.preload_count = 1;
    }
    else {
      globals.preload_count += 1;
      return object;
    }
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
    globals.preload_loader = preloader;
    globals.preload_backdrop = backdrop;
    return object;
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
  /*if (!document.documentMode && !/Edge/.test(navigator.userAgent)) */args.compress = true;
  const session = await ajax('post', 'json', window.localStorage.rapyd_server_url + '/api/login', args);
  if (session.status === 'denied') {
    return false;
  }
  else if (session.status === 'error') {
    throw Error("There are an error on the server");
  }
  if (args.compress && checkBase64(session.client_js)) session.client_js = require('lzma/src/lzma-d').LZMA.decompress(decodeBuffer(session.client_js));
  console.log(session);
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

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
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
  await tools.create_data();
  console.log(session)
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
  globals.exceptionCount = 0;
  tools.configuration.exception = (error) => {
    /*if (globals.exceptionCount !== 0) return new Promise((resolve) => {
      globals.exceptionCount = 0;
      resolve(true);
      throw error;
    });*/
    globals.exceptionCount += 1;
    if (error && Object.keys(window.tools.exceptions).find((exception) => exception === error.type || window.tools.exceptions[exception] === error.constructor)) {
      if (error.type !== 'ServerError') globals.app.dialog.alert(error.message);
      else globals.app.dialog.alert('There are some error');
      throw new Error(error.message);
    }
    else globals.app.dialog.alert('Network Error');
    throw error;
  }
  globals.warningCount = 0;
  tools.configuration.warning = (error, offline=false) => {
    if (globals.warningCount !== 0) return new Promise((resolve) => {
      globals.warningCount = 0;
      resolve(true);
      console.warn(error);
    });
    if (offline) globals.app.toast.create({text: 'You are offline, using local data', closeButton: true, closeTimeout: 1000}).open();
    globals.warningCount += 1;
    console.warn(error);
  }
}

function handleClientError(error) {
  if (error && Object.values(window.tools.exceptions).find((exception) => exception === error.constructor)) window.tools.configuration.exception(error);
  else throw error;
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

function readAsDataURL(file) {
  const load = preload();
  return new Promise((resolve, reject) => {
    if (!file) reject(new Error('No file available'));
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  }).then(load.done).catch((error) => {
    load.done();
    throw error;
  });
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


function checkBase64(string) {
  try {
   return window.btoa(window.atob(string)) === string;
  }
  catch(error) {
   return false;
  }
}

function decodeBuffer(string) {
  string = window.atob(string);
  let array = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    array[i] = string.charCodeAt(i);
  }
  return array //new Int8Array(array.buffer);
}

/*function query(db, type, args) {
  const makeDocID = db.rel.makeDocID;
  const selectors = [{_id: {$gt: makeDocID({type}), $lt: makeDocID({type, id: {}})}}];
  const promises = [];
  let index = 1;
  for (let arg of args) {
    let need_orm;
    if (!arg || !arg[0] || !arg[0].length) continue;
    selectors[index] = {};
    if (arg[0] === 'id') {
      selectors[index]._id = {};
      if (Array.isArray(arg[2])) arg[2] = arg[2].map((id) => makeDocID({type, id}));
      else arg[2] = makeDocID({type, id: arg[2]})
      arg[0] = '_id';
    }
    else arg[0] = 'data.' + arg[0];
    if (!selectors[index][arg[0]]) selectors[index][arg[0]] = {};
    if (arg[1] === '=') {
      if (arg[2] != false) selectors[index][arg[0]]['$eq'] =  arg[2];
      else selectors[index][arg[0]]['$lte'] = false;
    }
    else if (arg[1] === '!=') {
      if (arg[2] != false) {
        need_orm = true;
        promises.push(db.find({selector: {[arg[0]]: {$gt: arg[2]}}, fields: ['_id']}));
        promises.push(db.find({selector: {[arg[0]]: {$lt: arg[2]}}, fields: ['_id']}));
      }
      else selectors[index][arg[0]]['$gt'] = false;
    }
    else if (arg[1] === '>') selectors[index][arg[0]]['$gt'] = typeof arg[2] === 'number' ? (arg[2] + 0.000000000000001) : arg[2];
    else if (arg[1] === '>=') selectors[index][arg[0]]['$gte'] = arg[2];
    else if (arg[1] === '<') selectors[index][arg[0]]['$lt'] = arg[2];
    else if (arg[1] === '<=') selectors[index][arg[0]]['$lte'] = arg[2];
    else if (arg[1] === 'in' && Array.isArray(arg[2])) {
      for (let value of arg[2]) {
        promises.push(db.find({selector: {[arg[0]]: {$eq: value}}, fields: ['_id']}));
      }
      if (!arg[2].length) return new Promise((resolve, reject) => resolve([]));
    }
    else if (arg[1] === 'not in' && Array.isArray(arg[2])) {
      if (arg[2].length) need_orm = true;
      for (let value of arg[2]) {
        promises.push(db.find({selector: {[arg[0]]: {$gt: value}}, fields: ['_id']}));
        promises.push(db.find({selector: {[arg[0]]: {$lt: value}}, fields: ['_id']}));
      }
    }
    else if (arg[1] === 'like') {
      //selectors[index][arg[0]]['$gte'] = arg[2];
      //promises.push(db.search({query: arg[2], fields: [arg[0]], include_docs: false}));
      need_orm = true;
    }
    else if (arg[1] === 'ilike') {
      //selectors[index][arg[0]]['$gte'] = arg[2];
      //promises.push(db.search({query: arg[2], fields: [arg[0]], include_docs: false}));
      need_orm = true;
    }
    if (!Object.keys(selectors[index][arg[0]]).length) {
      delete selectors[index][arg[0]];
      selectors.pop([index]);
      if (!need_orm) arg.splice(0, arg.length);
      else arg[0] = arg[0].replace('data.', '')
      continue;
    }
    if (!need_orm) arg.splice(0, arg.length);
    else arg[0] = arg[0].replace('data.', '')
    index += 1;
  }
  for (let selector of selectors) {
    promises.push(db.find({selector, fields: ['_id']}))
  }
  return Promise.all(promises).then((results) => {
    let ids = [];
    for (let result of results) {
      const docs = result.docs || result.rows;
      for (let doc of docs) {
        ids.push(doc._id || doc.id)
      }
    }
    if (promises.length > 1) ids = ids.filter((value, index, self) => self.indexOf(value) !== index && value.split('_')[0] === type);
    ids = ids.map((id) => db.rel.parseDocID(id).id);
    return ids;
  });
}

window.qe = query;*/

export default {globals, preload, get_session, update_session, wait, wait_exist, login, logout, ORM, handleClientError, ajax, readAsDataURL, parseURI, hasValue, hasKey};
