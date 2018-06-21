// Initialize your app
if (typeof myApp === 'undefined') {
    myApp = new Framework7({
        modalTitle: 'App',
        cache: false,
        domCache: false,
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

myApp.onPageInit('login', function(page) {
    function click_login(event) {
       event.preventDefault();
       if (event.keyCode === 13) {
           document.querySelector('button.button-login').click();
       }
    }
    document.querySelector('#login').addEventListener('keyup', click_login);
    document.querySelector('#password').addEventListener('keyup', click_login);
});

myApp.onPageInit('login_settings', function(page) {
    document.getElementById('url').value = getLocal('rapyd_server_url');
});

function loadIndex(page) {
    if (indexLoaded === true || page === undefined || typeof tools === 'undefined') {
        return
    }
    if (page.name === 'index' || page.name === 'login' || page.name === tools.configuration.home_view) {
        loadApp();
        models.env.context = Object.assign(models.env.context, {
            active_id: null,
            active_ids: [],
            active_index: 0,
            active_limit: 80,
            active_model: false,
            force_upload: false
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
                    loadPage(mainView, (menu.view_id || menu.model + '.list'))
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
                    onclick = "loadPage(mainView, " + "'" + (child_menu.view_id || child_menu.model + ".list") + "'" + ")";
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
                var tree = models.env[model].__view__(new DOMParser().parseFromString(views.tree, 'text/xml').children[0], 'tree');
                var template = document.getElementById('template_list');
                var list = document.createElement('template');
                list.id = model + '.list';
                list.innerHTML = template.innerHTML.replace('template_list', model + '.list').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
                document.getElementsByTagName('body')[0].append(list);
                myApp.onPageInit(model + '.list', function() {
                    if (currentPage === tools.configuration.home_view) {
                        var back_button = document.querySelector('a.back');
                        if (back_button !== null) {
                            back_button.setAttribute('class', 'open-panel link icon-only');
                            back_button.setAttribute('data-panel', 'left');
                            back_button.setAttribute('href', '#');
                            //back_button.children[0].remove();
                            back_button.innerHTML = '<i class="icon icon-bars"></i>';
                        }
                    }
                    models.env.context = Object.assign(models.env.context, {
                        active_id: null,
                        active_ids: [],
                        active_index: 0,
                        active_limit: 80,
                        active_model: false,
                        force_upload: false
                    });
                    models.env.context.active_id = null;
                    models.env.context.active_model = model;
                    var page = document.querySelector("div[data-page='" + model + ".list']");
                    //templatePages[model + '.list'] = page;
                    var headers = page.getElementsByClassName('table-headers')[0];
                    var values = page.getElementsByClassName('table-values')[0];
                    var tbody = page.getElementsByTagName('tbody')[0];
                    for (var field in Array.from(tree.children)) {
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
                        //records = Array.from(records.__iter__());
                        records.queue(function(record, next) {
                            //record = records[record];
                            var tr = values.cloneNode(true);
                            var onclick = function() {
                                models.env.context.active_id = record;
                                models.env.context.active_ids = [record.id];
                                loadPage(mainView, model + '.form')
                            };
                            for (var field in Array.from(tree.children)) {
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
                    models.env[model].search(['id', 'not in', unsaved_ids]).then(render);
                    if (tools.exist(unsaved_ids) === true) {
                        models.env[model].browse(unsaved_ids, false).then(render);
                    }
                });
            }
            if (tools.exist(views.form) === true) {
                var form = models.env[model].__view__(new DOMParser().parseFromString(views.form, 'text/xml').children[0], 'form');
                var template = document.getElementById('template_form');
                var view = document.createElement('template');
                view.id = model + '.form';
                view.innerHTML = template.innerHTML.replace('template_form', model + '.form').replace('template_model', model).replace('Template', views.string).replace('Template', views.string);
                document.getElementsByTagName('body')[0].append(view);
                myApp.onPageInit(model + '.form', function() {
                    if (currentPage === tools.configuration.home_view) {
                        var back_button = document.querySelector('a.back');
                        if (back_button !== null) {
                            back_button.setAttribute('class', 'open-panel link icon-only');
                            back_button.setAttribute('data-panel', 'left');
                            back_button.setAttribute('href', '#');
                            //back_button.children[0].remove();
                            back_button.innerHTML = '<i class="icon icon-bars"></i>';
                        }
                    }
                    models.env.context.force_upload = !!JSON.parse((form.getAttribute('force_upload') || false).toString().toLowerCase());
                    models.env.context.active_model = model;
                    var page = document.querySelector("div[data-page='" + model + ".form']");
                    //templatePages[model + '.form'] = page;
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
                                                    return models.env[field_object.relation].search(['name', 'ilike', query.term]).then(function(records) {
                                                        var result = [];
                                                        records = Array.from(records.__iter__());
                                                        for (var record in records) {
                                                            result.push({
                                                                id: records[record].id,
                                                                text: records[record].name
                                                            });
                                                        }
                                                        models.env.context.active_index = 0;
                                                        return {
                                                            results: result,
                                                            more: false
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
                                                    return models.env[field_object.relation].search(['name', 'ilike', query.term]).then(function(records) {
                                                        var result = [];
                                                        records = Array.from(records.__iter__());
                                                        for (var record in records) {
                                                            result.push({
                                                                id: records[record].id,
                                                                text: records[record].name
                                                            });
                                                        }
                                                        models.env.context.active_index = 0;
                                                        return {
                                                            results: result,
                                                            more: false
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
                        for (var index in Array.from(children)) {
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
            for (var mode in tools.view[keys[key]]) {
                if (mode !== 'tree' && mode !== 'form' && mode !== 'string' && mode !== 'custom_init') {
                    var view = tools.view[keys[key]][mode];
                    var extra_view = document.createElement('template');
                    extra_view.id = keys[key] + '.' + mode;
                    extra_view.innerHTML = view;
                    document.getElementsByTagName('body')[0].append(extra_view);
                    var page = document.querySelector("div[data-page='" + keys[key] + "." + mode + "']");
                    if (hasKey(tools.view[keys[key]].custom_init, keys[key] + '.' + mode)) {
                        myApp.onPageInit(keys[key] + '.' + mode, tools.view[keys[key]].custom_init[keys[key] + '.' + mode]);
                    }
                    //templatePages[keys[key] + '.' + mode] = page;
                }
            }
            loadedViews.push(keys[key]);
        };
        for (key in keys) {
            render_views(key);
        }
        doneApp();
        document.querySelector('#index').innerHTML = document.getElementById(tools.configuration.home_view).innerHTML;
        document.querySelector('.navbar-fixed').children[0].innerHTML = document.getElementById(tools.configuration.home_view).content.children[0].innerHTML;
        document.querySelector('.page.page-on-center').setAttribute('data-page', tools.configuration.home_view);
        document.querySelector('.view.view-main').setAttribute('data-page', tools.configuration.home_view);
        indexLoaded = true;
        var color_element = document.createElement('meta');
        color_element.name = 'theme-color';
        color_element.content = '#' + getComputedStyle(document.querySelector('.navbar'), null).backgroundColor.replace('rgb(', '').replace(')', '').split(', ').map(function(c) {return parseInt(c).toString(16)}).map(function(hex) {return hex.length == 1 ? "0" + hex : hex}).join('');
        document.querySelector('head').appendChild(color_element);
    }
}

myApp.onPageInit('index', loadIndex);

loginCount = 0;
exceptionCount = 0;
warningCount = 0;
indexLoaded = false;
loadedMenus = [];
loadedViews = [];
currentPage = 'index';
//templatePages = {};
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
        reloadPage(view, 'index');
        checkLoginValid(view);
    }).catch(function(error) {
        if (getLocal('rapyd_server_url') === null) {
            setLocal('rapyd_server_url', window.location.protocol + '//' + window.location.hostname + ':8069');
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
        try {
            xhr.send(data);
        } catch(error) {
            reject(error);
        }
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
    /*if (window.tools !== undefined && page === 'index') {
        page = tools.configuration.home_view;
    }*/
    currentPage = page;
    myApp.closePanel();
    page = document.getElementById(page);
    /*if (indexLoaded === false) {
        loadIndex(view.activePage || {name: 'index'});
    } else if (page === null) {
        return
    }*/
    view.router.loadContent(page.innerHTML);
}

function reloadPage(view, page) {
    /*if (window.tools !== undefined && page === 'index') {
        page = tools.configuration.home_view;
    }*/
    currentPage = page;
    page = document.getElementById(page);
    /*if (indexLoaded === false) {
        loadIndex(view.activePage || {name: 'index'});
    } else if (page === null) {
        return
    }*/
    view.router.reloadContent(page.innerHTML)
}

function reloadPreviousPage(view) {
    var page = document.querySelector('div.pages').children[0].attributes['data-page'].value;
    /*if (window.tools !== undefined && page === 'index') {
        page = tools.configuration.home_view;
    }*/
    currentPage = page;
    page = document.getElementById(page);
    /*if (indexLoaded === false) {
        loadIndex(view.activePage || {name: 'index'});
    } else if (page === null) {
        return
    }*/
    var left_page = document.querySelector('.page-on-left');
    if (left_page !== null) {
        left_page.remove();
    }
    view.router.reloadContent(page.innerHTML);
}

//mainView.router.back = function back() {reloadPreviousPage(mainView)};

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
                records = Array.from(result.__iter__());
                for (var record in records) {
                    values.push({
                        id: records[record].id,
                        text: records[record].name
                    });
                }
                selectivityFields[models.env.context.active_model + '.' + id].setData(values);
            });
        } else {
            if (tools.exist(models.env.context.active_model) === true && models.env[models.env.context.active_model]._fields[id] && models.env[models.env.context.active_model]._fields[id].type === 'date' && tools.exist(value) === true) {
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
    if (object === undefined || object === null || object === false) {
        return false;
    }
    return Object.keys(object).indexOf(key) > -1;
}

function hasValue(object, key) {
    if (object === undefined || object === null || object === false) {
        return false;
    }
    object = object.toString();
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
    if (tools.exist(tools.configuration.custom_navbar) === true) {
        var style = document.createElement('style');
        style.innerHTML = '.navbar {background-color: ' + tools.configuration.custom_navbar + '!important}';
        document.querySelector('head').append(style);
    }
    document.querySelector('body').className = tools.configuration.material_theme + ' framework7-root';
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
        console.log(offline);
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
    (function connectSocket() {
        try {
            if (typeof socket === 'undefined') {
                /*if (typeof io === 'undefined') {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = getLocal('rapyd_server_url') + '/socket.io/socket.io.js';
                    document.body.appendChild(script);
                }*/
                window.socket = io(getLocal('rapyd_server_url'));
            }
            socket.removeAllListeners()
            socket.on('message', tools.show_message);
        } catch (error) {
            console.log(error);
            //connectSocket();
        }
    })();
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
            encrypted: true,
            client_js_time: record.client_js_time
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
                        client_js: response.client_js || doc.client_js,
                        client_js_time: response.client_js_time || doc.client_js_time,
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
                        client_js_time: response.client_js_time,
                        unsaved: {}
                    });
                    myApp.alert('Login success!');
                });
                if (response.client_js) {
                    loadORM(response.client_js);
                }
                tools.configuration.url = getLocal('rapyd_server_url');
                models.env.user = models.env['res.users'].browse();
                models.env.user.id = response.id;
                models.env.user.login = response.login;
                models.env.user.password = response.password;
                //models.env.user.values = response.values;
                loginCount = 0;
                loadIndex(view.activePage);
                reloadPage(view, tools.configuration.home_view);
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
            if (hasValue(error, 'innerHTML') === false) {
                myApp.alert("Can't connect to server");
            }
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
    local_db.destroy();
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
    loadApp();
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
    doneApp();
}

function saveRecord(button) {
    loadApp();
    function hideButton() {
        document.querySelector('.form-label').innerHTML = '/ ' + models.env.context.active_id.name;
        if (button !== undefined) {
            button.style.display = 'none';
            document.querySelector('.button-upload').style.display = 'inline-block';
            document.querySelector('.button-edit').style.display = 'inline-block';
        }
        doneApp();
        if (models.env.context.force_upload === true) {
            uploadRecord(document.querySelector('.button-upload'));
        }
    }
    var values = {};
    var inputs = document.querySelectorAll('.input-field');
    for (var index in Array.from(inputs)) {
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
            hideButton();
        });
    } else {
        models.env.context.active_id.write(values, false).then(function(result) {
            if (hasKey(models.env.context.unsaved, models.env.context.active_model) === false) {
                models.env.context.unsaved[models.env.context.active_model] = {};
            }
            models.env.context.unsaved[models.env.context.active_model][result.id] = 'write';
            updateUnsave();
            setValues(result.values);
            hideButton();
        });
    }
}

function uploadRecord(button) {
    loadApp();
    function hideButton() {
        if (button !== undefined) {
            button.style.display = 'none';
            document.querySelector('.button-edit').style.display = 'inline-block';
        }
        console.log(button);
        doneApp();
    }
    if (hasKey(models.env.context.unsaved, models.env.context.active_model) === true) {
        if (models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id] === 'create') {
            var todelete = models.env.context.active_id;
            models.env.context.active_id.create().then(function(result) {
                models.env.context.active_id = result;
                todelete.unlink(false);
                setValues(result.values);
                hideButton();
            });
            delete models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id];
            updateUnsave();
        } else if (models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id] === 'write') {
            models.env.context.active_id.write().then(function(result) {
                setValues(result.values);
                hideButton();
            });
            delete models.env.context.unsaved[models.env.context.active_model][models.env.context.active_id.id];
            updateUnsave();
        }
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
    for (var index in Array.from(tree.children)) {
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

if (!Array.from) {
 Array.from = (function() {
  var isCallable = function(fn) {
    return typeof fn === 'function';
  };
  var toInteger = function (value) {
    var number = Number(value);
    if (isNaN(number)) { return 0; }
    if (number === 0 || !isFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function (value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var iteratorProp = function(value) {
    if(value != null) {
      if(['string','number','boolean','symbol'].indexOf(typeof value) > -1){
        return Symbol.iterator;
      } else if (
        (typeof Symbol !== 'undefined') &&
        ('iterator' in Symbol) &&
        (Symbol.iterator in value)
      ) {
        return Symbol.iterator;
      }
      // Support "@@iterator" placeholder, Gecko 27 to Gecko 35
      else if ('@@iterator' in value) {
        return '@@iterator';
      }
    }
  };
  var getMethod = function(O, P) {
    // Assert: IsPropertyKey(P) is true.
    if (O != null && P != null) {
      // Let func be GetV(O, P).
      var func = O[P];
      // ReturnIfAbrupt(func).
      // If func is either undefined or null, return undefined.
      if(func == null) {
        return void 0;
      }
      // If IsCallable(func) is false, throw a TypeError exception.
      if (!isCallable(func)) {
        throw new TypeError(func + ' is not a function');
      }
      return func;
    }
  };
  var iteratorStep = function(iterator) {
    // Let result be IteratorNext(iterator).
    // ReturnIfAbrupt(result).
    var result = iterator.next();
    // Let done be IteratorComplete(result).
    // ReturnIfAbrupt(done).
    var done = Boolean(result.done);
    // If done is true, return false.
    if(done) {
      return false;
    }
    // Return result.
    return result;
  };

  // The length property of the from method is 1.
  return function from(items /*, mapFn, thisArg */ ) {
    'use strict';

    // 1. Let C be the this value.
    var C = this;

    // 2. If mapfn is undefined, let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;

    var T;
    if (typeof mapFn !== 'undefined') {
      // 3. else
      //   a. If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError(
          'Array.from: when provided, the second argument must be a function'
        );
      }

      //   b. If thisArg was supplied, let T be thisArg; else let T
      //      be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
      //   c. Let mapping be true (implied by mapFn)
    }

    var A, k;

    // 4. Let usingIterator be GetMethod(items, @@iterator).
    // 5. ReturnIfAbrupt(usingIterator).
    var usingIterator = getMethod(items, iteratorProp(items));

    // 6. If usingIterator is not undefined, then
    if (usingIterator !== void 0) {
      // a. If IsConstructor(C) is true, then
      //   i. Let A be the result of calling the [[Construct]]
      //      internal method of C with an empty argument list.
      // b. Else,
      //   i. Let A be the result of the abstract operation ArrayCreate
      //      with argument 0.
      // c. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C()) : [];

      // d. Let iterator be GetIterator(items, usingIterator).
      var iterator = usingIterator.call(items);

      // e. ReturnIfAbrupt(iterator).
      if (iterator == null) {
        throw new TypeError(
          'Array.from requires an array-like or iterable object'
        );
      }

      // f. Let k be 0.
      k = 0;

      // g. Repeat
      var next, nextValue;
      while (true) {
        // i. Let Pk be ToString(k).
        // ii. Let next be IteratorStep(iterator).
        // iii. ReturnIfAbrupt(next).
        next = iteratorStep(iterator);

        // iv. If next is false, then
        if (!next) {

          // 1. Let setStatus be Set(A, "length", k, true).
          // 2. ReturnIfAbrupt(setStatus).
          A.length = k;

          // 3. Return A.
          return A;
        }
        // v. Let nextValue be IteratorValue(next).
        // vi. ReturnIfAbrupt(nextValue)
        nextValue = next.value;

        // vii. If mapping is true, then
        //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
        //   2. If mappedValue is an abrupt completion, return
        //      IteratorClose(iterator, mappedValue).
        //   3. Let mappedValue be mappedValue.[[value]].
        // viii. Else, let mappedValue be nextValue.
        // ix.  Let defineStatus be the result of
        //      CreateDataPropertyOrThrow(A, Pk, mappedValue).
        // x. [TODO] If defineStatus is an abrupt completion, return
        //    IteratorClose(iterator, defineStatus).
        if (mapFn) {
          A[k] = mapFn.call(T, nextValue, k);
        }
        else {
          A[k] = nextValue;
        }
        // xi. Increase k by 1.
        k++;
      }
      // 7. Assert: items is not an Iterable so assume it is
      //    an array-like object.
    } else {

      // 8. Let arrayLike be ToObject(items).
      var arrayLike = Object(items);

      // 9. ReturnIfAbrupt(items).
      if (items == null) {
        throw new TypeError(
          'Array.from requires an array-like object - not null or undefined'
        );
      }

      // 10. Let len be ToLength(Get(arrayLike, "length")).
      // 11. ReturnIfAbrupt(len).
      var len = toLength(arrayLike.length);

      // 12. If IsConstructor(C) is true, then
      //     a. Let A be Construct(C, «len»).
      // 13. Else
      //     a. Let A be ArrayCreate(len).
      // 14. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 15. Let k be 0.
      k = 0;
      // 16. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = arrayLike[k];
        if (mapFn) {
          A[k] = mapFn.call(T, kValue, k);
        }
        else {
          A[k] = kValue;
        }
        k++;
      }
      // 17. Let setStatus be Set(A, "length", len, true).
      // 18. ReturnIfAbrupt(setStatus).
      A.length = len;
      // 19. Return A.
    }
    return A;
  };
})();
}
