// Initialize your app
var myApp = new Framework7({
    modalTitle: 'App',
    domCache: true,
    pushState: true,
    material: true,
    
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    },
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: false
});

myApp.onPageInit('login_settings', function (page) {
  document.getElementById('url').value = getLocal('rapyd_server_url');
});

myApp.onPageInit('index', function (page) {
  if (page.name === 'index') {
    if (typeof tools === 'undefined') {return}
    loadApp();
    Object.assign(models.env.context, {active_id: null, active_ids: [], active_index: 0, active_limit: 80});
    var keys = Object.keys(tools.menu);
    for (var key in keys) {
      var menu = tools.menu[keys[key]];
      var ul = document.createElement('ul');
      var li = document.createElement('li');
      li.className = "accordion-item";
      ul.append(li);
      li.innerHTML =
                  '<a class="item-link item-content">'+
                    '<div class="item-inner">'+
                      '<div class="item-title">'+menu.string+'</div>'+
                    '</div>'+
                  '</a>';
      if (tools.exist(menu.model) === true) {
        li.children[0].onclick = function () {loadPage(mainView, menu.model + '.list')};
      }
      var div = false;
      for (var child in menu.childs.as_array()) {
        if (div === false) {
          div = document.createElement('div');
          div.className = "accordion-item-content";
          li.append(div);
        }
        var child_menu = menu.childs[child];
        div.innerHTML +=
                  '<a class="item-content">'+
                    '<div class="item-inner">'+
                      '<div class="item-title">'+child_menu.string+'</div>'+
                    '</div>'+
                  '</a>';
        if (tools.exist(child_menu.model) === true) {
          div.children[0].onclick = function () {loadPage(mainView, child_menu.model + '.list')};
        }
      }
      document.getElementById('menu').append(ul);
      delete tools.menu[keys[key]];
    }
    keys = Object.keys(tools.view);
    for (key in keys) {
      var views = tools.view[keys[key]];
      if (tools.exist(views.tree) === true) {
        var tree = new DOMParser().parseFromString(views.tree, 'text/xml').children[0];
        var template = document.getElementById('template_list');
        var list = document.createElement('template');
        var model = keys[key];
        list.id = model + '.list';
        list.innerHTML = template.innerHTML.replace('template_list', model+'.list').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
        document.getElementsByTagName('body')[0].append(list);
        myApp.onPageInit(model+'.list', function() {
          models.env.context.active_id = null;
          var page = document.querySelector("div[data-page='res.users.list']");
          var headers = page.getElementsByClassName('table-headers')[0];
          var values = page.getElementsByClassName('table-values')[0];
          var tbody = page.getElementsByTagName('tbody')[0];
          for (var field in Array.prototype.slice.call(tree.children)) {
            field = tree.children[field];
            var th = document.createElement('th');
            th.className = 'label-cell';
            th.innerHTML = models.env[model]._fields[field.attributes.name.value].string;
            headers.append(th);
          }
          models.env[model].search([]).then(function (records) {
            records = records.__iter__();
            for (var record in records.as_array()) {
              record = records[record];
              var tr = values.cloneNode(true);
              tr.onclick = function () {models.env.context.active_id = record;loadPage(mainView, model+'.form')};
              for (var field in Array.prototype.slice.call(tree.children)) {
                field = tree.children[field];
                var td = document.createElement('td');
                td.className = 'label-cell';
                td.innerHTML = record[field.attributes.name.value];
                tr.append(td);
              }
              tbody.append(tr);
            }
            values.parentElement.removeChild(values);
          });
        });
      }
      delete tools.view[keys[key]];
    }
    doneApp();
  }
});

loginCount = 0;

function startApp(view) {
  db = PouchDB('main');
  db.get('session').then(function (record) {
    setLocal('rapyd_server_url', record.url);
    eval(record.client_js);
    tools.configuration.url = record.url;
    models.env.user = models.env['res.users'].browse();
    models.env.user.id = record.id;
    models.env.user.login = record.login;
    models.env.user.password = record.password;
    //models.env.user.client_js = record.client_js;
    //reloadPage(view, 'index');
    checkLoginValid(view);
  }).catch(function (error) {
    if (getLocal('rapyd_server_url') === null) {
      setLocal('rapyd_server_url', 'http://localhost');
    }
    reloadPage(view, 'index');
    checkLoginValid(view);
  });
}

function loadApp(callBack) {
  myApp.showIndicator();
}

function doneApp() {
  myApp.hideIndicator();
}

function parseURI(data) {
    var array = [];
    keys = Object.keys(data);
    for (var key in keys) {
        var value = data[keys[key]];
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        else if (value === '') {
          value = null;
        }
        array.push(encodeURIComponent(keys[key])+ '=' + encodeURIComponent(value));
    }
    return array.join('&');
}

function doAjax(type, dataType, url, data) {
  loadApp();
  if (data !== undefined || null || false) {
    data = parseURI(data);
  }
  console.log(data);
  return new Promise(function(resolve, reject) {
    xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.onload = function () {
      console.log(this.response);
      resolve(this.response);
      doneApp();
    };
    xhr.onerror = function (error) {
      reject(error);
      doneApp();
    };
    if (dataType === undefined) {
      dataType = 'json';
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = dataType;
    xhr.send(data);
  });
}

function doSleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function loadPage(view, page) {
  myApp.closePanel();
  view.router.loadContent(document.getElementById(page).innerHTML);
}

function reloadPage(view, page) {
  view.router.reloadContent(document.getElementById(page).innerHTML)
}

function reloadPreviousPage(view, page) {
  document.getElementsByClassName('page-on-left')[0].remove();
  view.router.reloadPreviousContent(document.getElementById(page).innerHTML);
}

function getFile(file) {
  return new Promise(function(resolve, reject) {
    if (file === undefined) {
      resolve('');
      return;
    }
    var reader = new FileReader();
    reader.onload = function() {
      resolve(this.result);
    };
    reader.readAsDataURL(file);
  });
}

function getFiles(elements, array, index) {
  loadApp();
  if (array === undefined) {
    array = [];
  }
  if (index === undefined) {
    index = 0;
  }
  return getFile(document.getElementById(elements[index]).files[0]).then(function(result) {
    array.push(result);
    index += 1;
    if (index !== elements.length) {
      return getFiles(elements, array, index);
    }
    else {
      doneApp();
      return array;
    }
  });
}

function getValue(id) {
  var element = document.getElementById(id);
  if (element !== null) {
    if (element.type === 'checkbox') {
      return element.checked;
    }
    return element.value;
  }
  else {
    return '';
  }
}

function getValues(ids, files, object) {
  if (files !== undefined) {
    return getFiles(files).then(function(result) {
      var object = getValues(ids);
      for (var file in files) {
        if (result[file] !== '') {
          object[files[file]] = result[file].split(',')[1];
        }
      }
      return object;
    });
  }
  if (object === undefined) {
    object = {};
    for (var id in ids) {
      var key = ids[id];
      object[key] = getValue(key);
    }
    return object;
  }
}

function callValues(call, parameters, ids, images) {
  if (images === undefined) {
    var values = getValues(ids);
    parameters.push(values);
    console.log(parameters);
    call.apply(this, parameters);
  }
  else {
    getValues(ids, images).then(function(result) {
      parameters.push(result);
      call.apply(this, parameters);
    });
  }
}

function setValue(id, value) {
  var element = document.getElementById(id);
  if (element !== null) {
    if (element.type === 'checkbox') {
      element.checked = value;
    } else {
     element.value = value; 
    }
  }
}

function getLocal(key) {
  return localStorage.getItem(key);
}

function setLocal(key, value) {
  localStorage.setItem(key, value);
}

function removeLocal(key) {
  localStorage.removeItem(key);
}

/*function getDoc(id) {
  db.get(id).then(function (doc) {
    return doc;
  }).catch(function (error) {
    console.log(error);
  });
}

function removeDoc(id) {
  db.get(id).then(function(doc) {
    db.remove(doc);
  });
}*/

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function showImage(image, id) {
  if (image.value !== "") {
    getFile(image.files[0]).then(function(result) {
      var show =
'<div class="card image demo-card-header-pic">' +
  '<img src="'+result+'" style="max-width: 100%;" valign="bottom" class="card-header color-white no-border"/>' +
'</div>';
      document.getElementById(id).insertAdjacentHTML('beforebegin', show);
    });
  }
  else {
    console.log("No image found");
  }
}

function checkLogin(view) {
  loginCount = 0;
  db.get('session').catch(function (error) {
    reloadPage(view, 'login');
  });
}

function checkLoginValid(view) {
  db.get('session').then(function (record) {
    var args = {login: record.login, password: record.password, encrypted: true};
    doLogin(view, args).then(function (response) {
      if (response.status !== 'success') {
        checkLogin(view);
      }
    })/*.catch(function (error) {
      checkLogin(view);
    })*/;
  }).catch(function (error) {
    checkLogin(view);
  });
}

function doLogin(view, args) {
  if (loginCount === 0) {
    if (args.encrypted === undefined) {
      args.encrypted = false;
    }
    if (args.authentication === undefined) {
      args.authentication = true;
    }
    loginCount = 1;
    return doAjax('post', 'json', getLocal('rapyd_server_url') + '/api/login', args).then(function (response) {
      if (response.status === 'success') {
        db.get('session').then(function (doc) {
          db.put({_id: doc._id, _rev: doc._rev, url: getLocal('rapyd_server_url'), login: response.login, password: response.password, id: response.id, client_js: response.client_js});
        }).catch(function (error) {
          db.put({_id: 'session', url: getLocal('rapyd_server_url'), login: response.login, password: response.password, id: response.id, client_js: response.client_js});
          myApp.alert('Login success!');
        });
        eval(response.client_js);
        tools.configuration.url = getLocal('rapyd_server_url');
        models.env.user = models.env['res.users'].browse();
        models.env.user.id = response.id;
        models.env.user.login = response.login;
        models.env.user.password = response.password;
        //models.env.user.values = response.values;
        loginCount = 0;
        reloadPage(view, 'index');
      } else {
        var alert = 'Username/Password wrong, relogin';
        if (response.status !== 'denied') {
          alert = 'Either you encrypted data is invalid or there have been an error';
        }
        myApp.alert(alert);
        loginCount = 0;
      }
      return response;
    }).catch(function (error) {
      reloadPage(view, 'index');
    });
  }
}

function doLogout(view) {
  db.get('session').then(function (doc) {
    db.remove(doc);
    checkLogin(view);
    myApp.alert('You logged out.');
  }).catch(function (error) {
    console.log(error);
  });
}