// Initialize your app
if (typeof myApp === 'undefined') {
    myApp = new Framework7({
        modalTitle: 'App',
        domCache: true,
        pushState: true,
        material: true,

        onAjaxStart: function(xhr) {
            myApp.showIndicator();
        },

        onAjaxComplete: function(xhr) {
            myApp.hideIndicator();
        },
    });
}

// Export selectors engine
var $$ = Dom7;
jQuery = $$;
$ = $$; //Fake Jquery

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: false
});

myApp.onPageInit('login_settings', function(page) {
    document.getElementById('url').value = getLocal('rapyd_server_url');
});

myApp.onPageInit('index', function(page) {
    if (page.name === 'index') {
        if (typeof tools === 'undefined') {
            return
        }
        loadApp();
        models.env['res.message'].search().then(function (message_ids) {
            message_ids.queue(function (message_id) {
                showMessage({user: 'Administrator', message: message_id.text});
            });
        });
        models.env.context = Object.assign(models.env.context, {
            active_id: null,
            active_ids: [],
            active_index: 0,
            active_limit: 80,
            active_model: false
        });
        var keys = tools.keys(tools.menu, 'sequence').as_array();
        var render_menu = function(key) {
            if (loadedMenus.indexOf(keys[key]) > -1) {
                return
            }
            var menu = tools.menu[keys[key]];
            var ul = document.createElement('ul');
            var li = document.createElement('li');
            li.className = "accordion-item";
            ul.append(li);
            li.innerHTML =
                '<a class="item-link item-content">' +
                '<div class="item-inner">' +
                '<div class="item-title">' + menu.string + '</div>' +
                '</div>' +
                '</a>';
            if (tools.exist(menu.model) === true) {
                li.children[0].onclick = function() {
                    loadPage(mainView, menu.model + '.list')
                };
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
                    onclick = "loadPage(mainView, " + "'" + child_menu.model + ".list" + "'" + ")";
                    //div.children[child].onclick = function () {loadPage(mainView, child_menu.model + '.list')};
                }
                div.innerHTML +=
                    '<a class="item-content" onclick="' + onclick + '">' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + child_menu.string + '</div>' +
                    '</div>' +
                    '</a>';
            }
            document.getElementById('menu').append(ul);
            loadedMenus.push(keys[key]);
        };
        for (var key in keys) {
            render_menu(key);
        }
        keys = Object.keys(tools.view);
        var render_views = function(key) {
            if (loadedViews.indexOf(keys[key]) > -1) {
                return
            }
            var views = tools.view[keys[key]];
            var model = keys[key];
            if (tools.exist(views.tree) === true) {
                var tree = new DOMParser().parseFromString(views.tree, 'text/xml').children[0];
                var template = document.getElementById('template_list');
                var list = document.createElement('template');
                list.id = model + '.list';
                list.innerHTML = template.innerHTML.replace('template_list', model + '.list').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
                document.getElementsByTagName('body')[0].append(list);
                myApp.onPageInit(model + '.list', function() {
                    models.env.context.active_id = null;
                    models.env.context.active_model = model;
                    var page = document.querySelector("div[data-page='" + model + ".list']");
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
                    var unsaved_ids = [];
                    if (hasKey(models.env.context.unsaved, model) === true) {
                        unsaved_ids = Object.keys(models.env.context.unsaved[model]);
                    }

                    function render(records) {
                        loadApp();
                        //records = records.__iter__();
                        records.queue(function(record, next) {
                            //record = records[record];
                            var tr = values.cloneNode(true);
                            var onclick = function() {
                                models.env.context.active_id = record;
                                models.env.context.active_ids = [record.id];
                                loadPage(mainView, model + '.form')
                            };
                            for (var field in Array.prototype.slice.call(tree.children)) {
                                field = tree.children[field];
                                var td = document.createElement('td');
                                td.className = 'label-cell';
                                td.innerHTML = record[field.attributes.name.value];
                                td.onclick = onclick;
                                tr.append(td);
                            }
                            tbody.append(tr);
                            next();
                        });
                        values.remove(); //.parentElement.removeChild(values);
                        doneApp();
                    }
                    models.env[model].search('id', 'not in', unsaved_ids).then(render);
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
                view.innerHTML = template.innerHTML.replace('template_form', model + '.form').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
                document.getElementsByTagName('body')[0].append(view);
                myApp.onPageInit(model + '.form', function() {
                    models.env.context.active_model = model;
                    var page = document.querySelector("div[data-page='" + model + ".form']");
                    var content = page.querySelector('.form-content');
                    var header = page.querySelector('header').cloneNode(true);
                    page.querySelector('header').remove();
                    var footer = page.querySelector('footer').cloneNode(true);
                    page.querySelector('footer').remove();
                    var button = document.createElement('div');
                    button.className = 'button button-fill button-raised';
                    var field = page.querySelector('.form-field').cloneNode(true);
                    var group = document.createElement('div');
                    group.style.float = 'left';
                    group.style['margin-bottom'] = '50px';
                    var sheet = page.querySelector('.form-sheet').cloneNode(false);
                    sheet.append(page.querySelector('.list-block').cloneNode(false));
                    var sheet_inner = sheet.children[0];
                    page.querySelector('.form-sheet').remove();
                    var fields = [];
                    var definedTags = {
                        'header': header,
                        'sheet': sheet,
                        'sheet_inner': sheet_inner,
                        'footer': footer,
                        'field': field,
                        'group': group,
                        'button': button
                    }; //Don't forget to add your custom tag here if you want to make customizations
                    function render(parent, children, group_left, element_left) {
                        if (hasClass(parent, 'form-sheet') === true) {
                            parent = parent.children[0];
                        }

                        function render_child(index) {
                            var tag = children[index].tagName;
                            var element = children[index];
                            var input = element;
                            if (Object.keys(definedTags).indexOf(tag) > -1) {
                                element = definedTags[tag].cloneNode(true);
                                if (tag === 'group') {
                                    if (group_left === true) {
                                        element.className = 'left-group';
                                        group_left = false;
                                        element_left = element;
                                    } else {
                                        group_left = true;
                                        element.style.height = (element_left.clientHeight + 4) + 'px';
                                    }
                                } else if (tag === 'button') {
                                    var button = children[index];
                                    element.innerHTML = button.attributes.string.value;
                                    element.style.marginRight = '5px';
                                    element.onclick = function() {
                                        models.env.context.active_id[button.attributes.name.value]()
                                    };
                                } else if (tag === 'field') {
                                    input = element.querySelector('input');
                                    var field_name = children[index].attributes.name.value;
                                    var field_object = models.env[model]._fields[field_name];
                                    input.id = field_name;
                                    input.onchange = function() {
                                        onchangeField(field_name, model)
                                    };
                                    if (field_object.type === 'integer') {
                                        input.type = 'number';
                                    } else if (field_object.type === 'date') {
                                        input.type = 'date';
                                    } else if (field_object.type === 'datetime') {
                                        input.type = 'datetime-local';
                                    } else if (field_object.type === 'boolean') {
                                        input.type = 'checkbox';
                                    } else if (field_object.type === 'one2one' || field_object.type === 'many2one') {
                                        var new_input = document.createElement('div');
                                        input.parentElement.replaceChild(new_input, input);
                                        input = new_input;
                                        selectivityFields[model + '.' + field_name] = new Selectivity.Inputs.Single({
                                            element: input,
                                            allowClear: true,
                                            readOnly: true,
                                            ajax: {
                                                url: tools.configuration.url,
                                                minimumInputLength: 0,
                                                params: function(term, offset) {
                                                    return {}
                                                },
                                                placeholder: '',
                                                fetch: function(url, init, query) {
                                                    models.env.context.active_index = query.offset;
                                                    return models.env[field_object.relation].search('name', 'ilike', query.term).then(function(records) {
                                                        var result = [];
                                                        records = records.__iter__();
                                                        for (var record in records.as_array()) {
                                                            result.push({
                                                                id: records[record].id,
                                                                text: records[record].name
                                                            });
                                                        }
                                                        models.env.context.active_index = 0;
                                                        return {
                                                            results: result,
                                                            more: true
                                                        };
                                                    });
                                                },
                                            }
                                        });
                                        /*input.removeAttribute('id');
                                        input.removeAttribute('class');*/
                                        input.removeAttribute('tabindex');
                                        input.children[0].children[0].id = field_name;
                                        input.children[0].children[0].className += ' selectivity-single-input';
                                        input.children[0].children[0].style.display = 'none';
                                    } else if (field_object.type === 'one2many' || field_object.type === 'many2many') {
                                        var new_input = document.createElement('div');
                                        input.parentElement.replaceChild(new_input, input);
                                        input = new_input;
                                        selectivityFields[model + '.' + field_name] = new Selectivity.Inputs.Multiple({
                                            element: input,
                                            allowClear: true,
                                            readOnly: true,
                                            ajax: {
                                                url: tools.configuration.url,
                                                minimumInputLength: 0,
                                                params: function(term, offset) {
                                                    return {}
                                                },
                                                placeholder: '',
                                                fetch: function(url, init, query) {
                                                    models.env.context.active_index = query.offset;
                                                    return models.env[field_object.relation].search('name', 'ilike', query.term).then(function(records) {
                                                        var result = [];
                                                        records = records.__iter__();
                                                        for (var record in records.as_array()) {
                                                            result.push({
                                                                id: records[record].id,
                                                                text: records[record].name
                                                            });
                                                        }
                                                        models.env.context.active_index = 0;
                                                        return {
                                                            results: result,
                                                            more: true
                                                        };
                                                    });
                                                },
                                            }
                                        });
                                        /*input.removeAttribute('id');
                                        input.removeAttribute('class');*/
                                        input.removeAttribute('tabindex');
                                        input.children[0].children[0].id = field_name;
                                        input.children[0].children[0].className += ' selectivity-multi-input';
                                        input.children[0].children[0].style.display = 'none';
                                        var open_close = document.createElement('i');
                                        open_close.className = 'fa fa-sort-desc selectivity-caret';
                                        open_close.onclick = function() {
                                            if (hasClass(open_close.parentElement.parentElement, 'open')) {
                                                selectivityFields[model + '.' + field_name].close();
                                            } else {
                                                selectivityFields[model + '.' + field_name].open();
                                            }
                                        }
                                        input.children[0].children[0].insertAdjacentElement('beforebegin', open_close);
                                    } else if (field_object.type === 'selection') {
                                        var new_input = document.createElement('div');
                                        input.parentElement.replaceChild(new_input, input);
                                        input = new_input;
                                        var items = [];
                                        for (var selection in field_object.selection) {
                                            items.push({
                                                id: field_object.selection[selection][0],
                                                text: field_object.selection[selection][1]
                                            });
                                        }
                                        selectivityFields[model + '.' + field_name] = new Selectivity.Inputs.Single({
                                            element: input,
                                            allowClear: true,
                                            items: items,
                                            placeholder: '',
                                            readOnly: true,
                                        });
                                        /*input.removeAttribute('id');
                                        input.removeAttribute('class');*/
                                        input.removeAttribute('tabindex');
                                        input.children[0].children[0].id = field_name;
                                        input.children[0].children[0].className += ' selectivity-single-input';
                                        input.children[0].children[0].style.display = 'none';
                                    }
                                    //TO-DO Binary
                                    var label = element.querySelector('.label');
                                    label.innerHTML = models.env[model]._fields[field_name].string;
                                    fields.push(field_name);
                                }
                            }
                            parent.append(element);
                            if (typeof children[index].children === 'object' && children[index].children.length > 0) {
                                if (children[index].children[0].tagName === 'tree') {
                                    //showTable(input, children[index].children[0], models.env[model]._fields[children[index].attributes.name.value].relation);
                                    //To-DO fields.push();
                                    return;
                                }
                                render(element, children[index].children, group_left, element_left);
                            }
                        }
                        for (var index in Array.prototype.slice.call(children)) {
                            render_child(index);
                        }
                    }
                    render(content, form.children, true, 0);
                    for (var index in fields) {
                        if (tools.exist(models.env.context.active_id) === true) {
                            setValue(fields[index], models.env.context.active_id[fields[index]]);
                        }
                        document.getElementById(fields[index]).disabled = true;
                        document.getElementById(fields[index]).className += ' input-field';
                        /*if (hasKey(selectivityFields, models.env.context.active_model+'.'+fields[index]) === true) {
                          selectivityFields[models.env.context.active_model+'.'+fields[index]].setOptions({readOnly: true});
                        }*/
                    }
                    if (tools.exist(models.env.context.active_id) === true) {
                        page.querySelector('.form-label').innerHTML = "/ " + models.env.context.active_id.name;
                        if (hasKey(models.env.context.unsaved, model) === true && hasKey(models.env.context.unsaved[model], models.env.context.active_id.id) === true) {
                            page.querySelector('.button-upload').style.display = 'inline-block';
                        }
                    } else {
                        editRecord(page.querySelector('.button-edit'));
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
exceptionCount = 0;
warningCount = 0;
loadedMenus = [];
loadedViews = [];
currentPage = 'index';
selectivityFields = {};

function startApp(view) {
    db = PouchDB('local');
    db.get('session').then(function(record) {
        setLocal('rapyd_server_url', record.url);
        loadORM(record.client_js);
        tools.configuration.url = record.url;
        models.env.context.unsaved = record.unsaved;
        models.env.user = models.env['res.users'].browse();
        models.env.user.id = record.id;
        models.env.user.login = record.login;
        models.env.user.password = record.password;
        //models.env.user.client_js = record.client_js;
        //reloadPage(view, 'index');
        checkLoginValid(view);
    }).catch(function(error) {
        if (getLocal('rapyd_server_url') === null) {
            setLocal('rapyd_server_url', window.location.origin + ':8069');
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
        } else if (value === '') {
            value = null;
        }
        array.push(encodeURIComponent(keys[key]) + '=' + encodeURIComponent(value));
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
        xhr.onload = function() {
            resolve(this.response);
            doneApp();
        };
        xhr.onerror = function() {
            reject(this.statusText);
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
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function loadPage(view, page) {
    currentPage = page;
    myApp.closePanel();
    view.router.loadContent(document.getElementById(page).innerHTML);
}

function reloadPage(view, page) {
    currentPage = page;
    view.router.reloadContent(document.getElementById(page).innerHTML)
}

function reloadPreviousPage(view, page) {
    currentPage = page;
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
        } else {
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
    } else {
        if (selectivityFields[models.env.context.active_model + '.' + id] !== undefined) {
            return selectivityFields[models.env.context.active_model + '.' + id].getValue()
        }
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
    } else {
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
        } else if (hasValue(element.className, 'selectivity-single')) {
            if (tools.exist(value) === false) {
                selectivityFields[models.env.context.active_model + '.' + id].clear();
                return;
            } else if (models.env[models.env.context.active_model]._fields[id].type === 'selection') {
                selectivityFields[models.env.context.active_model + '.' + id].setValue(value);
                return;
            }
            return models.env[models.env[models.env.context.active_model]._fields[id].relation].browse(value).then(function(result) {
                selectivityFields[models.env.context.active_model + '.' + id].setData({
                    id: value,
                    text: result.name
                });
            });
        } else if (hasValue(element.className, 'selectivity-multi')) {
            if (tools.exist(value) === false) {
                selectivityFields[models.env.context.active_model + '.' + id].clear();
                return;
            }
            return models.env[models.env[models.env.context.active_model]._fields[id].relation].browse(value).then(function(result) {
                var values = [];
                records = result.__iter__();
                for (var record in records.as_array()) {
                    values.push({
                        id: records[record].id,
                        text: records[record].name
                    });
                }
                selectivityFields[models.env.context.active_model + '.' + id].setData(values);
            });
        } else {
            if (tools.exist(models.env.context.active_model) === true && models.env[models.env.context.active_model]._fields[id].type === 'date' && tools.exist(value) === true) {
                value = value.split('T')[0];
            }
            element.value = value;
        }
    }
}

function setValues(values) {
    var keys = Object.keys(values);
    for (var key in keys) {
        setValue(keys[key], values[keys[key]]);
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
                '<img src="' + result + '" style="max-width: 100%;" valign="bottom" class="card-header color-white no-border"/>' +
                '</div>';
            document.getElementById(id).insertAdjacentHTML('beforebegin', show);
        });
    } else {
        console.log("No image found");
    }
}

function loadORM(client_js) {
    function forceReplace(codes) {
        for (var code in codes) {
            code = codes[code];
            client_js = client_js.split(code).join('window.tools.' + code);
        }
    }
    forceReplace(['exception(error', 'warning(error', 'ajax_load(data)', 'ajax_resolve(resolve, this', 'ajax_reject(reject, this']);
    eval(client_js);
    tools.exception = function(error) {
        console.log(error);
        if (exceptionCount !== 0) {
            return new Promise(function(resolve, reject) {
                exceptionCount = 0;
                resolve(true);
            });
        }
        myApp.alert('There are some error');
        exceptionCount = 1;
    };
    tools.warning = function(error, offline) {
        if (offline === undefined) {
            offline = false;
        }
        console.log(error);
        if (warningCount !== 0) {
            return new Promise(function(resolve, reject) {
                warningCount = 0;
                resolve(true);
            });
        }
        if (offline === true) {
            myApp.addNotification({
                message: 'You are offline, using local data',
                hold: 1000
            });
        }
        warningCount = 1;
    };
    tools.ajax_load = function() {
        loadApp();
    };
    tools.ajax_resolve = function(resolve, xhr) {
        doneApp();
        resolve(xhr.response);
    };
    tools.ajax_reject = function(reject, xhr) {
        doneApp();
        reject(xhr.statusText);
    };
    try {
        if (typeof socket === 'undefined') {
            socket = io(getLocal('rapyd_server_url'));
        }
        socket.removeAllListeners()
        socket.on('message', showMessage);
    } catch (error) {
        console.log(error);
    }
}

function checkLogin(view) {
    loginCount = 0;
    db.get('session')
        .catch(function(error) {
            reloadPage(view, 'login');
        });
}

function checkLoginValid(view) {
    db.get('session').then(function(record) {
        var args = {
            login: record.login,
            password: record.password,
            encrypted: true
        };
        doLogin(view, args).then(function(response) {
            if (response.status !== 'success') {
                checkLogin(view);
            }
        }).catch(function(error) {
            checkLogin(view);
        });
    }).catch(function(error) {
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
        return doAjax('post', 'json', getLocal('rapyd_server_url') + '/api/login', args).then(function(response) {
            if (response.status === 'success') {
                db.get('session').then(function(doc) {
                    db.put({
                        _id: doc._id,
                        _rev: doc._rev,
                        url: getLocal('rapyd_server_url'),
                        login: response.login,
                        password: response.password,
                        id: response.id,
                        client_js: response.client_js,
                        unsaved: doc.unsaved
                    });
                }).catch(function(error) {
                    db.put({
                        _id: 'session',
                        url: getLocal('rapyd_server_url'),
                        login: response.login,
                        password: response.password,
                        id: response.id,
                        client_js: response.client_js,
                        unsaved: {}
                    });
                    myApp.alert('Login success!');
                });
                loadORM(response.client_js);
                tools.configuration.url = getLocal('rapyd_server_url');
                models.env.user = models.env['res.users'].browse();
                models.env.user.id = response.id;
                models.env.user.login = response.login;
                models.env.user.password = response.password;
                //models.env.user.values = response.values;
                loginCount = 0;
                reloadPage(view, 'index');
            } else {
                console.log(response);
                var alert = 'Username/Password wrong, relogin';
                if (response.status !== 'denied') {
                    alert = 'Either you encrypted data is invalid or there have been an error';
                }
                myApp.alert(alert);
                loginCount = 0;
            }
            return response;
        }).catch(function(error) {
            loginCount = 0;
            console.log(error);
            myApp.alert("Can't connect to server");
            reloadPage(view, currentPage);
        });
    }
}

function doLogout(view) {
    db.get('session').then(function(doc) {
        db.remove(doc);
        checkLogin(view);
        myApp.alert('You logged out.');
    }).catch(function(error) {
        console.log(error);
    });
}

function onchangeField(field, model) {
    if (models.env.context.active_model === model) {
        if (tools.exist(models.env.context.active_onchanges) === false) {
            models.env.context.active_onchanges = tools.get_onchanges(models.env.context.active_id);
        }
        for (var onchange in models.env.context.active_onchanges[field]) {
            onchange = models.env.context.active_onchanges[field][onchange];
            models.env.context.active_id[onchange]();
        }
    }
}

function editRecord(button) {
    if (tools.exist(models.env.context.active_id) === false) {
        models.env.context.active_id = models.env[models.env.context.active_model].browse();
    }
    var inputs = document.querySelectorAll('.input-field');
    for (var index in inputs) {
        inputs[index].disabled = false;
        if (hasKey(selectivityFields, models.env.context.active_model + '.' + inputs[index].id) === true) {
            var id = inputs[index].id;
            var field = selectivityFields[models.env.context.active_model + '.' + inputs[index].id];
            field.setOptions({
                readOnly: false
            });
            var input = field.el.querySelector('input');
            input.id = id; //.children[0].children[0].id = id;
            input.className += ' input-field';
        }
    }
    if (button !== undefined) {
        button.style.display = 'none';
        document.querySelector('.button-save').style.display = 'inline-block';
    }
}

function saveRecord(button) {
    var values = {};
    var inputs = document.querySelectorAll('.input-field');
    for (var index in Array.prototype.slice.call(inputs)) {
        inputs[index].disabled = true;
        if (hasKey(selectivityFields, models.env.context.active_model + '.' + inputs[index].id) === true) {
            var id = inputs[index].id;
            var field = selectivityFields[models.env.context.active_model + '.' + inputs[index].id];
            field.setOptions({
                readOnly: true
            });
            var input = inputs[index]; //field.el.querySelector('input');
            input.id = id; //.children[0].children[0].id = id;
            input.className += ' input-field';
        }
        values[inputs[index].id] = getValue(inputs[index].id);
    }
    if (tools.exist(models.env.context.unsaved) === false) {
        models.env.context.unsaved = {};
    }
    if (tools.exist(models.env.context.active_id.id) === false) {
        models.env.context.active_id.create(values, false).then(function(result) {
            if (hasKey(models.env.context.unsaved, models.env.context.active_model) === false) {
                models.env.context.unsaved[models.env.context.active_model] = {};
            }
            models.env.context.unsaved[models.env.context.active_model][result.id] = 'create';
            updateUnsave();
            setValues(result.values);
        });
    } else {
        models.env.context.active_id.write(values, false).then(function(result) {
            if (hasKey(models.env.context.unsaved, models.env.context.active_model) === false) {
                models.env.context.unsaved[models.env.context.active_model] = {};
            }
            models.env.context.unsaved[models.env.context.active_model][result.id] = 'write';
            updateUnsave();
            setValues(result.values);
        });
    }
    if (button !== undefined) {
        button.style.display = 'none';
        document.querySelector('.button-upload').style.display = 'inline-block';
        document.querySelector('.button-edit').style.display = 'inline-block';
    }
}

function uploadRecord(button) {
    if (hasKey(models.env.context.unsaved, models.env.context.active_model) === true) {
        if (models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id] === 'create') {
            var todelete = models.env.context.active_id;
            models.env.context.active_id.create().then(function(result) {
                models.env.context.active_id = result;
                todelete.unlink(false);
                setValues(result.values);
            });
            delete models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id];
            updateUnsave();
        } else if (models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id] === 'write') {
            models.env.context.active_id.write().then(function(result) {
                setValues(result.values);
            });
            delete models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id];
            updateUnsave();
        }
    }
    if (button !== undefined) {
        button.style.display = 'none';
        document.querySelector('.button-edit').style.display = 'inline-block';
    }
}

function updateUnsave() {
    db.get('session').then(function(doc) {
        db.put(Object.assign(doc, {
            unsaved: models.env.context.unsaved
        }));
    });
}

function showTable(input, tree, model) {
    var id = input.id;
    var table =
        '<div class="mdl-cell item-content">' +
        '	<table class="mdl-data-table">' +
        '		<thead>' +
        '			<tr class="columns">' +
        '				<th class="hide column-default"></th>' +
        '				<th>' +
        '					<i style="vertical-align: bottom;" class="table-add material-icons md-24" onclick="addTable(this)">&#xe03b;</i>' +
        '				</th>' +
        '			</tr>' +
        '		</thead>' +
        '		<tbody>' +
        '			<tr class="hide line-default">' +
        '				<td class="hide column-row-default">' +
        '					<div contenteditable style="width: 100%; height: 100%; outline: 0px solid transparent;"></div>' +
        //'					<input type="text">'+
        '				</td>' +
        '				<td>' +
        '					<i style="vertical-align: bottom;" class="table-remove material-icons md-24" onclick="removeTable(this)">&#xe15d;</i>' +
        '				</td>' +
        '			</tr>' +
        '		</tbody>' +
        '	</table>' +
        '</div>';
    input.parentElement.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML('afterend', table);
    table = input.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('table');
    var column_default = table.querySelector('th.column-default');
    var column_row_default = table.querySelector('td.column-row-default');
    for (var index in Array.prototype.slice.call(tree.children)) {
        var field = tree.children[index];
        var column = column_default.cloneNode(true);
        var column_row = column_row_default.cloneNode(true);
        column.removeAttribute('class');
        column.innerHTML = models.env[model]._fields[field.attributes.name.value].string;
        column_row.removeAttribute('class');
        column_row.children[0].className = field.attributes.name.value + ' tree-input';
        column_default.parentElement.lastChild.insertAdjacentElement('beforebegin', column);
        column_row_default.parentElement.lastChild.insertAdjacentElement('beforebegin', column_row);
    }
}

function addTable(element) {
    clone = element.parentElement.parentElement.parentElement.parentElement.querySelector('.line-default').cloneNode(true);
    append = element.parentElement.parentElement.parentElement.parentElement.querySelector('tbody').appendChild(clone);
    append.removeAttribute('class');
    append.setAttribute('class', 'line');
}

function removeTable(table) {
    table.parentElement.parentElement.remove();
}

function showMessage(msg) {

    //Calculate time
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    if (s < 10) {
        s = '0' + s;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (h < 10) {
        h = '0' + h;
    }

    //Create new message
    var listItem = $('<li class="mdl-list__item mdl-list__item--three-line"></li>');
    var mainSpan = $('<span class="mdl-list__item-primary-content"></span>');
    var icon = $('<i class="material-icons mdl-list__item-avatar">person</i>');
    var user = $('<span></span>').text(msg.user);
    var message = $('<span class="mdl-list__item-text-body"></span>').text(msg.message + ' - ' + h + ':' + m + ':' + s);

    //Build the message html and append it to the correct room div
    mainSpan.append(icon);
    mainSpan.append(user);
    mainSpan.append(message);
    listItem.append(mainSpan);
    $('.messages').append(listItem);

    //Scroll down
    //$('.page-content').animate({scrollTop: $('.chat-list-div').prop("scrollHeight")}, 500);
    document.querySelector('.page-content').scrollBy(0, $('.chat-list-div').prop('scrollHeight'))
}

//Polyfills
(function(arr) {
    arr.forEach(function(item) {
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

if (typeof Element.prototype.append === 'undefined') {
    Element.prototype.append = Element.prototype.appendChild;
}