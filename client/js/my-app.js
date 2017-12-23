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
    Object.assign(models.env.context, {active_id: null, active_ids: [], active_index: 0, active_limit: 80, active_model: false});
    var keys = tools.keys(tools.menu, 'sequence').as_array();
    var render_menu = function (key) {
      if (loadedMenus.indexOf(keys[key]) > -1) {return}
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
        var onclick = '';
        if (tools.exist(child_menu.model) === true) {
          onclick = "loadPage(mainView, "+"'"+child_menu.model+".list"+"'"+")";
          //div.children[child].onclick = function () {loadPage(mainView, child_menu.model + '.list')};
        }
        div.innerHTML +=
                  '<a class="item-content" onclick="'+onclick+'">'+
                    '<div class="item-inner">'+
                      '<div class="item-title">'+child_menu.string+'</div>'+
                    '</div>'+
                  '</a>';
      }
      document.getElementById('menu').append(ul);
      loadedMenus.push(keys[key]);
    };
    for (var key in keys) {
      render_menu(key);
    }
    keys = Object.keys(tools.view);
    var render_views = function (key) {
      if (loadedViews.indexOf(keys[key]) > -1) {return}
      var views = tools.view[keys[key]];
      var model = keys[key];
      if (tools.exist(views.tree) === true) {
        var tree = new DOMParser().parseFromString(views.tree, 'text/xml').children[0];
        var template = document.getElementById('template_list');
        var list = document.createElement('template');
        list.id = model + '.list';
        list.innerHTML = template.innerHTML.replace('template_list', model+'.list').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
        document.getElementsByTagName('body')[0].append(list);
        myApp.onPageInit(model+'.list', function() {
          models.env.context.active_id = null;
          models.env.context.active_model = model;
          var page = document.querySelector("div[data-page='"+model+".list']");
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
          function render(records) {
            loadApp();
            records = records.__iter__();
            for (var record in records.as_array()) {
              record = records[record];
              var tr = values.cloneNode(true);
              var onclick = function () {models.env.context.active_id = record;loadPage(mainView, model+'.form')};
              for (var field in Array.prototype.slice.call(tree.children)) {
                field = tree.children[field];
                var td = document.createElement('td');
                td.className = 'label-cell';
                td.innerHTML = record[field.attributes.name.value];
                td.onclick = onclick;
                tr.append(td);
              }
              tbody.append(tr);
            }
            values.remove();//.parentElement.removeChild(values);
            doneApp();
          }
          var unsaved_ids = [];
          if (hasKey(models.env.context.unsaved, model) === true) {
            unsaved_ids = Object.keys(models.env.context.unsaved[model]);
          }
          models.env[model].search(['id', 'not in', unsaved_ids]).then(render);
          if (tools.exist(unsaved_ids) === true) {
            models.env[model].browse(unsaved_ids, false).then(render);
          }
        });
      }
      if (tools.exist(views.form) === true) {
        var form = new DOMParser().parseFromString(views.form, 'text/xml').children[0];
        var template = document.getElementById('template_form');
        var view = document.createElement('template');
        view.id = model + '.form';
        view.innerHTML = template.innerHTML.replace('template_form', model+'.form').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
        document.getElementsByTagName('body')[0].append(view);
        myApp.onPageInit(model+'.form', function() {
          models.env.context.active_model = model;
          var page = document.querySelector("div[data-page='"+model+".form']");
          var content = page.querySelector('.form-content');
          var header = page.querySelector('header').cloneNode(true);
          page.querySelector('header').remove();
          var footer = page.querySelector('footer').cloneNode(true);
          page.querySelector('footer').remove();
          var field = page.querySelector('.form-field').cloneNode(true);
          var group = document.createElement('div');
          group.style.float = 'left';
          group.style['margin-bottom'] = '50px';
          var sheet = page.querySelector('.form-sheet').cloneNode(false);
          sheet.append(page.querySelector('.list-block').cloneNode(false));
          var sheet_inner = sheet.children[0];
          page.querySelector('.form-sheet').remove();
          var fields = [];
          var definedTags = {'header': header, 'sheet': sheet, 'sheet_inner': sheet_inner, 'footer': footer, 'field': field, 'group': group};//Don't forget to add your custom tag here if you want to make customizations
          function render(parent, children, group_left) {
            if (hasClass(parent, 'form-sheet') === true) {
              parent = parent.children[0];
            }
            for (var index in Array.prototype.slice.call(children)) {
              var tag = children[index].tagName;
              var element = children[index];
              if (Object.keys(definedTags).indexOf(tag) > -1) {
                var element = definedTags[tag].cloneNode(true);
                if (tag === 'group') {
                  if (group_left === true) {
                    element.className = 'left-group';
                    group_left = false;
                  } else {
                    group_left = true;
                  }
                }
                else if (tag === 'field') {
                  var input = element.querySelector('input');
                  input.id = children[index].attributes.name.value;
                  var label = element.querySelector('.label');
                  label.innerHTML = models.env[model]._fields[input.id].string;
                  fields.push(input.id);
                }
              }
              parent.append(element);
              if (typeof children[index].children === 'object' && children[index].children.length > 0) {
                render(element, children[index].children, group_left);
              }
            }
          }
          render(content, form.children, true);
          if (tools.exist(models.env.context.active_id) === true) {
            page.querySelector('.form-label').innerHTML = "/ " + models.env.context.active_id.name;
            if (hasKey(models.env.context.unsaved, model) === true && hasKey(models.env.context.unsaved[model], models.env.context.active_id.id) === true) {
              page.querySelector('.button-upload').style.display = 'inline-block';
            }
          }
          for (var index in fields) {
            if (tools.exist(models.env.context.active_id) === true) {
              setValue(fields[index], models.env.context.active_id[fields[index]]);
            }
            document.getElementById(fields[index]).disabled = true;
            document.getElementById(fields[index]).className = 'input-field';
          }
        });
      }
      loadedViews.push(keys[key]);
    };
    for (key in keys) {
      render_views(key);
    }
    doneApp();
  }
});

loginCount = 0;
loadedMenus = [];
loadedViews = [];

function startApp(view) {
  db = PouchDB('main');
  db.get('session').then(function (record) {
    setLocal('rapyd_server_url', record.url);
    eval(record.client_js);
    tools.configuration.url = record.url;
    models.env.context.unsaved = record.unsaved;
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
  console.log(page);
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

function hasKey(object, key) {
  if (object === undefined | null | false) {
    return false;
  }
  return Object.keys(object).indexOf(key) > -1;
}

function hasValue(object, key) {
  if (object === undefined | null | false) {
    return false;
  }
  return object.indexOf(key) > -1;
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
    }).catch(function (error) {
      checkLogin(view);
    });
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
          db.put({_id: doc._id, _rev: doc._rev, url: getLocal('rapyd_server_url'), login: response.login, password: response.password, id: response.id, client_js: response.client_js, unsaved: doc.unsaved});
        }).catch(function (error) {
          db.put({_id: 'session', url: getLocal('rapyd_server_url'), login: response.login, password: response.password, id: response.id, client_js: response.client_js, unsaved: {}});
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

function editRecord() {
  if (tools.exist(models.env.context.active_id) === false) {
    models.env.context.active_id = models.env[models.env.context.active_model].browse();
  }
  var inputs = document.querySelectorAll('input[disabled]');
  for (var index in inputs) {
    inputs[index].disabled = false;
  }
}

function saveRecord() {
  var values = {};
  var inputs = document.querySelectorAll('.input-field');
  for (var index in Array.prototype.slice.call(inputs)) {
    inputs[index].disabled = true;
    values[inputs[index].id] = getValue(inputs[index].id);
  }
  if (tools.exist(models.env.context.unsaved) === false) {
    models.env.context.unsaved = {};
  }
  if (tools.exist(models.env.context.active_id.id) === false) {
    models.env.context.active_id.create(values, false).then(function (result) {
      if (hasKey(models.env.context.unsaved, models.env.context.active_model) === false) {
        models.env.context.unsaved[models.env.context.active_model] = {};
      }
      models.env.context.unsaved[models.env.context.active_model][result.id] = 'create';
      updateUnsave();
    });
  } else {
    models.env.context.active_id.write(values, false).then(function (result) {
      if (hasKey(models.env.context.unsaved, models.env.context.active_model) === false) {
        models.env.context.unsaved[models.env.context.active_model] = {};
      }
      models.env.context.unsaved[models.env.context.active_model][result.id] = 'write';
      updateUnsave();
    });
  }
}

function uploadRecord() {
  if (hasKey(models.env.context.unsaved, models.env.context.active_model) === true) {
    if (models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id] === 'create') {
      var todelete = models.env.context.active_id;
      models.env.context.active_id.create().then(function (result) {
        models.env.context.active_id = result;
        todelete.unlink(false);
      });
      delete models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id];
      updateUnsave();
    }
    else if (models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id] === 'write') {
      models.env.context.active_id.write();
      delete models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id];
      updateUnsave();
    }
  }
}

function updateUnsave() {
  db.get('session').then(function (doc) {
    db.put(Object.assign(doc, {unsaved: models.env.context.unsaved}));
  });
}

//Polyfills
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null)
          this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);