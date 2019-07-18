import React from 'react';
import Page from './Page';
import Grid from './Grid';
import GridEditor from './GridEditor';
import {Button, Popup} from 'framework7-react';
import api from 'api';

function autoSizeAll(gridOptions, listener) {
  if (this) {
    this.gridOptions = gridOptions;
    for (let column of gridOptions.api.gridCore.gridOptions.columnDefs) {
      gridOptions.api.getFilterInstance(column.field).eClearButton.addEventListener('click', () => gridOptions.api.onFilterChanged());
    }
  }
  /*if (listener && !gridOptions.api.gridCore.eGridDiv.parentElement) {
    window.removeEventListener('resize', listener);
    return;
  }*/
  //let grid = gridOptions.api
  gridOptions.api.sizeColumnsToFit();
}

export default class Tree extends React.Component {
  constructor(props) {
    super(props);

    const model = props.model || window.models.env.context.active_model;
    function isEditable() {
      if (props.isTreeView && !props.editable) {
        return false;
      }
      if (window.models.env.context.editing) {
        return true;
      }
      return false;
    }
    this.isEditable = isEditable;
    this.pendingTask = {create: false, write: false, tasked: false};
    this.pendingCreate = false;
    this.pendingWrite = false;
    function taskJob() {
      if (this.pendingTask.tasked) return;
      this.pendingTask.tasked = true;
      window.models.env.context.active_task.push((async () => {
        if (this.pendingTask.create) await this.state.new_records.create();
        if (this.pendingTask.write) await window.models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field].write();
        if (this.props.parent_model) window.models.env.context.active_id.write({[this.state.tree_field]: window.models.env.context.active_lines[this.state.model]['many2many_' + this.state.tree_field].ids});
      }).bind(this));
    }
    this.taskJob = taskJob.bind(this);
    function onChange(params) {
      if (!params.colDef.cellEditorFramework && params.newValue != params.oldValue) {
        const value = params.newValue;
        const records = window.models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field];
        const record = params.data.id ? records.find(params.data.id) : records.find(params.data._original_object_for_id);
        if (!this.pendingTask.write && record.id) {
          this.pendingTask.write = true;
        }
        else if (!this.pendingTask.create && !record.id) {
          this.pendingTask.create = true;
        }
        if (!this.pendingTask.tasked && (this.pendingTask.create || this.pendingTask.write)) {
          this.taskJob();
        }
        record[params.colDef.field] = value;
        if (!params.selectedOnchange && this.state.selected) {
          for (let row of this.state.selected) {
            if (row === params.data) continue;
            this.onChange({colDef: params.colDef, selectedOnchange: true, data: row, specialValue: params.specialValue, oldValue: null, newValue: value});
            row[params.colDef.field] = params.specialValue || value;
          }
          //api.wait(100).then(() => this.gridOptions.api.deselectAll()).then(() => this.setState({records: this.state.records})).then(() => this.gridOptions.api.refreshCells());
          api.wait(100).then(() => this.gridOptions.api.deselectAll()).then(() => this.setState({records: this.state.records})).then(() => !params.colDef.cellEditorParams && this.gridOptions.api.refreshCells());
        }
      }
    }
    this.onChange = onChange.bind(this);
    function onSelectionChanged(event) {
      const selected = event.api.getSelectedRows();
      const ids = [];
      for (let data of selected) {
        if (data.id) ids.push(data.id);
      }
      this.pagingCalled = true;
      api.wait(1000).then(() => this.pagingCalled = false);
      return this.setState({active_ids: ids, selected});
    }
    this.onSelectionChanged = onSelectionChanged.bind(this);
    function handleOutside(event) {
      if (this.refs.grid && !this.refs.grid.base.querySelector('div.ag-body').contains(event.target) && this.gridOptions) this.gridOptions.api.stopEditing();
    }
    this.handleOutside = handleOutside.bind(this);
    const children = props.children.constructor === Array ? props.children : [props.children];
    const fields = children.map((child, index) => ({headerName: (() => child.attributes.string || window.models.env[model]._fields[child.attributes.name].string)(), field: child.attributes.name, suppressMovable: true, filterParams: {applyButton: true, clearButton: true}, editable: isEditable, invisible: child.props.invisible, onCellValueChanged: this.onChange, ...(child.props.sort ? (this.default_sort = child.props.name + ' ' + child.props.sort) && {sort: child.props.sort} : {}), ...((['date', 'datetime', 'selection'].indexOf(window.models.env[model]._fields[child.attributes.name].type) !== -1 || window.models.env[model]._fields[child.attributes.name].relation) ? {cellEditorFramework: GridEditor, cellEditorParams: {...child.props, model, tree: this}, cellClass: 'editable-special-cell'} : {})}));
    fields[0].checkboxSelection = true;
    fields[0].headerCheckboxSelection = true;
    //fields[0].suppressSizeToFit = true;
    const limit = parseInt(props.limit) || (props.isTreeView ? 50 : 500);
    const records = [];
    this.state = {fields: fields, records: records, new_records: window.models.env[model], limit: limit, model: model, frameworkComponents: {specialEditor: GridEditor}, selected: []};//, popupOpened: false};
    if (props.field) {
      this.state.tree_field = props.field;
    }
  }

  componentDidUpdate() {
    if (this.gridOptions) autoSizeAll(this.gridOptions);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutside);
    //return autoSizeAll.bind(this)(this.gridOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutside);
    window.removeEventListener('resize', this.resizeListener);
  }

  paginate(rows, index=0) {
    if (rows.length < 1) {
      return rows;
    }
    //rows = rows.concat(this.state.new_records)
    const count = rows[0]._search_count;
    if (index > 0) {
      let pushed = 0;
      while (pushed < this.state.limit * index) {
        rows.unshift({});
        pushed += 1;
      }
    }
    while (rows.length < count) {
      rows.push({});
    }
    return rows;
  }

  sort(fields, params) {
    console.log(this);
    const models = window.models;
    if (fields.length > 0) {
      models.env.context.active_sort = fields[0].colId + ' ' + fields[0].sort;
    }
    else {
      delete models.env.context.active_sort;
    }
    /*const load = api.preload();
    try {
      const args = [];
      if (this.state.tree_field) {
        args.push([this.state.tree_field, 'in', window.models.env.context.active_ids]);
      }
      const records = await models.env[this.state.model || models.env.context.active_model].search(...args);
      let result = [];
      if (records.length > 0) {
        result = records.values.constructor === Array ? records.values : [records.values];
      }
      this.setState({records: result});
    }
    catch(error) {
      console.log(error);
    }
    load.done();*/
    if (params.api.paginationGetCurrentPage() !== 0) {
      params.api.paginationGoToFirstPage();
    }
    else {
      params.newData = false;
      params.forcePopup = true;
      params.forceUpdate = true;
      this.paging.bind(this)(0, params);
    }
  }

  async filter(fields, params) {
    const models = window.models;
    //const load = api.preload();
    if (this.state.tree_field) await api.wait_exist(() => models.env.context.active_id);
    const args = [];//this.state.tree_field ? [!this.props.parent_model && [this.state.tree_field, 'in', window.models.env.context.active_ids] || ['id', 'in', window.models.env.context.active_id[this.state.tree_field] || []]] : [];
    const values = [];
    for (let field in fields) {
      let conditions = [fields[field]];
      let operator = 'AND';
      if (fields[field].operator !== undefined) {
        conditions = [fields[field].condition1, fields[field].condition2];
        operator = fields[field].operator;
      }
      const types = {startsWith: 'ilike', endsWith: 'ilike', contains: 'ilike', notContains: 'not ilike', equals: '=', notEqual: '!='};
      if (operator === 'OR') {
        args.push('|');
      }
      for (let condition of conditions) {
        /*if (operator === 'OR') {
          args.push('|');
        }*/
        values.push(condition.filter);
        if (models.env[this.state.model]._fields[field].relation) {
          const relation = models.env[models.env[this.state.model]._fields[field].relation];
          const result_ids = await relation.search([relation._rec_name || 'name', types[condition.type], condition.filter]);
          args.push([field, 'in', result_ids.ids]);
          continue;
        }
        args.push([field, types[condition.type], condition.filter]);
      }
    }
    this.args = args;
    /*try {
      const records = await models.env[this.state.model || models.env.context.active_model].search(...args);
      let result = [];
      if (records.length > 0) {
        result = records.values.constructor === Array ? records.values : [records.values];
      }
      this.setState({records: result});
    }
    catch(error) {
      console.log(error);
    }*/
    let index = 0;
    for (let input of window.document.getElementsByClassName('ag-filter-filter')) {
      if (values[index] !== undefined) {
        let value = values[index];
        setTimeout(() => input.value = value, 1000);
      }
      index += 1;
    }
    //load.done();
    if (params.api.paginationGetCurrentPage() !== 0) {
      params.api.paginationGoToFirstPage();
    }
    else {
      params.newData = false;
      params.forcePopup = true;
      params.forceUpdate = true;
      this.paging.bind(this)(0, params);
    }
  }

  async paging(index, params) {
    if (this.pagingStarted && !document.getElementsByClassName('preloader-modal').length) this.pagingStarted = false;
    if (params.newData !== false || (!params.forceUpdate && !this.props.isTreeView) || this.pagingStarted) {
      return;
    }
    if (index === 0 && this.props.isPopup && !params.forcePopup) return;
    //const load = api.preload();
    try {
      const models = window.models;
      if (this.state.tree_field) await api.wait_exist(() => models.env.context.active_id);
      if (this.state.tree_field  && (!models.env.context.active_id || this.props.view_model !== models.env.context.active_id._name)) return;
      if (params.deleting) {
        if (!this.args) this.args = [];
        this.args.push(['id', 'not in', this.state.active_ids]);
      }
      const args = (this.props.field_name ? [['id', 'in', window.models.env.context.active_id[this.props.field_name] || []]] : []);
      if (this.args) args.push(...this.args);
      models.env.context.active_limit = this.state.limit;
      models.env.context.active_index = index;
      if (!models.env.context.active_sort && this.default_sort) (models.env.context.active_sort = this.default_sort) && delete this.default_sort;
      this.pagingStarted = true;
      let records = await models.env[this.state.model].search(...args, ...((this.props.domain instanceof Function ? this.props.domain({}) : this.props.domain) || []));
      if (!this.props.isTreeView) {
        if (!models.env.context.active_lines) models.env.context.active_lines = {};
        if (!models.env.context.active_lines[this.state.model]) models.env.context.active_lines[this.state.model] = {};
        if (!models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field]) {
          models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field] = records;
        }
        else {
          records = models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field].add(records);
        }
      }
      else {
        records.add(this.state.new_records);
      }
      if (records.length > 0) {
        if (this.args) {
          records = records.filter((record) => {
            const domain = window.tools.copy(this.args);
            for (let args of domain) if (Array.isArray(args)) args[0] = record[args[0]];
            return window.tools.apply_domain(...domain);
          });
        }
        await this.setState({records: this.paginate(await records.sort_by(...(!models.env.context.active_sort ? [records._rec_name || 'name', false] : models.env.context.active_sort.split(' ').map((value) => value == 'asc' ? false : value))).read(true, this.state.fields.map((field) => field.field)), index)})
      }
      else if (records.length === 0) await this.setState({records: []});
    }
    catch(error) {
      console.error(error);
    }
    //load.done();
  }

  async addItem() {
    if (!this.isEditable()) return;
    const record = window.models.env[this.state.model].browse();
    if (window.models.env.context.active_id.id && !this.props.parent_model) record[this.state.tree_field] = window.models.env.context.active_id.id;
    if (record._pending_promises.length > 0) {
      await record._wait_promise();
      if (!this.pendingTask.tasked) {
        this.pendingTask.create = true;
        this.taskJob();
      }
    }
    const values = await record.read(true, this.state.fields.map((field) => field.field));
    this.state.new_records.add(record);
    this.state.records.push(values[0]);
    if (!this.props.treeView) window.models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field].add(record);
    await this.setState({records: this.state.records, new_records: this.state.new_records});
    this.gridOptions.api.updateRowData({add: values});
  }

  async chooseItem() {
    //await this.setState({popupOpened: true});
    await this.refs.popup.paging(0, {newData: false, forcePopup: true});
    const node = this.refs.popup_modal.getDOMNode();
    node.className = 'popup modal-in';
    node.children[0].className = node.children[0].className.replace('page-next', '').replace('page-previous', '');
    autoSizeAll(this.refs.popup.gridOptions);
    return;
  }

  async selectItem() {
    if (this.state.active_ids.length > 0) {
      const selected_ids = await window.models.env[this.props.model].browse(this.state.active_ids);
      const records = window.models.env.context.active_lines[this.props.model][(this.props.many2many ? 'many2many_' : '') + this.props.active_field].add(selected_ids);
      window.models.env.context.active_id[this.props.active_field_name] = records;
      await window.models.env.context.active_id._wait_promise();
      await this.props.parent_tree.paging(0, {newData: false, forceUpdate: true});
      this.gridOptions.api.deselectAll();
      this.props.parent_tree.refs.popup_modal.getDOMNode().className = this.props.parent_tree.refs.popup_modal.getDOMNode().className.replace('modal-in', 'modal-out');
      //return await this.parent_tree.setState({popupOpened: false});
    }
  }

  async removeItem() {
    if (this.props.isTreeView) {
      const records = await window.models.env[this.state.model].browse(this.state.active_ids);
      await records.unlink();
      await this.paging.bind(this)(0, {newData: false});
      //this.gridOptions.api.updateRowData({remove: this.state.selected});
      return this.gridOptions.api.deselectAll();//this.setState({selected: []});
    }
    const field = window.models.env[this.props.parent_model || this.state.model]._fields[this.state.tree_field];
    const type = field.type;
    for (let data of this.state.selected) {
      let index = this.state.records.length;
      while (index--) {
        if (data === this.state.records[index]) this.state.records.splice(index);
      }
      if (!window.models.env.context.active_id.id || type != 'many2one') {
        console.log(type)
        const records = window.models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field];
        const values = records.values;
        if (!Array.isArray(values)) {
          if (type != 'many2one') {
            if (data._original_object_for_id && data._original_object_for_id === values) records._values[0] = {};
            else if (data.id === values.id) (records._values[0] = {}) && delete records._values[data.id];
            continue;
          }
          if (data._original_object_for_id ? data._original_object_for_id === values : data.id === values.id) window.models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field] = window.models.env[this.state.model];
          continue;
        }
        let index = values.length
        while (index--) {
          if (data._original_object_for_id && data._original_object_for_id === values[index]) values.splice(index);
          else if (!data._original_object_for_id && data.id === values[index].id) values.splice(index) || delete records._values[data.id];
        }
        continue;
      }
      if (type != 'many2one') continue;
      const params = {data};
      params.oldValue = "";
      params.newValue = null;
      params.colDef = {field: this.state.tree_field};
      this.onChange(params);
    }
    const selected = this.state.selected;
    //await this.setState({records: this.state.records, selected: []});
    if (type != 'many2one') window.models.env.context.active_id[this.state.tree_field] = window.models.env.context.active_lines[this.state.model][(this.props.parent_model ? 'many2many_' : '') + this.state.tree_field];
    //this.gridOptions.api.updateRowData({remove: selected});
    await this.paging.bind(this)(0, {newData: false, deleting: true, forceUpdate: true});
    return this.gridOptions.api.deselectAll();
  }

  render(props) {
    const model = props.model || window.models.env.context.active_model;
    const models = window.models;
    const editableHeight = () => this.isEditable() ? (30) : 0
    const choose = (props.choose !== undefined ? (props.choose instanceof Function ? props.choose(models.env.context.active_id) : props.choose) : props.parent_model);
    const grid = (
      <div className="card-body" style={{height: Math.min(this.state.records.length, this.state.limit) * 48 + 112 + editableHeight()/* <= 440 ? this.state.records.length * 48 + 112 + editableHeight() + 'px' : '67vh'*/ + 'px', ...((props.invisible instanceof Function ? props.invisible(window.models.env.context.active_id) : props.invisible) ? {position: 'absolute', left: '-9999px', top: '-9999px'} : {})}}>
        <Grid ref="grid" onGridReady={((params) => autoSizeAll.bind(this)(params) || window.addEventListener('resize', this.resizeListener = () => autoSizeAll(params, this.resizeListener))).bind(this)} onRowClicked={(params) => models.env[this.state.model].browse(null).then((record) => delete models.env.context.active_id).then(() => api.globals.app.views.main.router.navigate('/form/' + model + '?id=' + params.data.id))} onPaginationChanged={(params) => this.paging.bind(this)(params.api.paginationGetCurrentPage(), params)} onSortChanged={(params) => this.sort.bind(this)(params.api.getSortModel(), params)} onFilterChanged={(params) => this.filter.bind(this)(params.api.getFilterModel(), params)} onSelectionChanged={this.onSelectionChanged} paginationPageSize={this.state.limit} columnDefs={this.state.fields.filter((field) => !props.isTreeView && models.env.context.active_id && field.invisible instanceof Function ? !field.invisible({}, models.env.context.active_id) : !field.invisible)} rowData={this.state.records} frameworkComponents={this.state.frameworkComponents}/>
        <Button onClick={this.addItem.bind(this)} style={{display: this.isEditable() && (props.create instanceof Function ? props.create(models.env.context.active_id) : props.create) !== false ? 'inline-block' : 'none', top: '-45px', backgroundColor: '#fff'}}>Add</Button>
        <Button onClick={this.chooseItem.bind(this)} style={{display: choose && this.isEditable() ? 'inline-block' : 'none', top: '-45px', backgroundColor: '#fff'}}>Choose</Button>
        <Button onClick={this.selectItem.bind(this)} style={{display: props.isPopup && this.state.selected.length > 0 ? 'inline-block' : 'none', top: '-45px', backgroundColor: '#fff'}}>Select</Button>
        <Button onClick={this.removeItem.bind(this)} style={{display: (props.isTreeView || this.isEditable()) && !props.isPopup && this.state.selected.length > 0 ? 'inline-block' : 'none', top: '-45px', backgroundColor: '#fff'}}>Delete</Button>
        {!props.isPopup && window.tools.view[this.state.model].actions.tree && Object.entries(window.tools.view[this.state.model].actions.tree).map(([function_name, string]) => (
          <Button onClick={(() => models.env[this.state.model].browse(this.state.active_ids).then((records) => records[function_name]()).then(() => this.gridOptions.api.deselectAll())).bind(this)} style={{display: (props.isTreeView || !models.env.context.editing) && this.state.selected.length > 0 ? 'inline-block' : 'none', top: '-45px', backgroundColor: '#fff'}}>{string}</Button>
        ))}
        {!props.isTreeView && (props.parent_model || choose) &&
        <Popup ref="popup_modal" backdrop={false} animate={true}>{/* opened={this.state.popupOpened} onPopupClosed={() => this.setState({popupOpened : false})}>*/}
          <Page popup title={window.tools.view[this.state.model] ? window.tools.view[this.state.model].string : 'Choose'}>
            <div className="card">
              <Tree ref="popup" isTreeView isPopup many2many={!!props.parent_model} parent_tree={this} active_field={this.state.tree_field} active_field_name={props.field_name} model={this.state.model} domain={(this.state.records.length > 0 ? [['id', 'not in', window.models.env.context.active_lines[props.model][(this.props.many2many ? 'many2many_' : '') + props.field].ids]] : []).concat(props.domain ? props.domain(models.env.context.active_id) : [])}>
                {Array.prototype.slice.call(new DOMParser().parseFromString(window.tools.view[this.state.model].tree || props.tree_arch || '<tree><field name="' + (window.models.env[this.state.model]._rec_name || 'name') + '"/></tree>', 'text/xml').children[0].children).map((element) => {
                  const props = {model};
                  for (let attribute of element.attributes) {
                    props[attribute.name] = attribute.value;
                  }
                  return React.createElement(null, props);
                })}
              </Tree>
            </div>
          </Page>
        </Popup>
        }
      </div>
    );
    if (!props.isTreeView) api.wait(0).then(() => !this.pagingCalled ? (this.pagingCalled = true) && this.paging(0, {newData: false, forceUpdate: true}) : api.wait(1000).then(() => this.pagingCalled = false));
    if (!props.isTreeView || props.isPopup) {
      if (window.models.env.context.editing) delete grid.props.children[0].props.onRowClicked;
      return grid;
    }
    return (
      <Page title={props.title || window.tools.view[this.state.model].string}>
        <div className="card">
          <div className="card-header">
            <div className="data-table-title">
              {props.title || window.tools.view[this.state.model].string}
              <br/>
              <Button onClick={() => api.globals.app.views.main.router.navigate('/form/' + model)} style={{display: 'inline-block'}} fill>Create</Button>
            </div>
          </div>
          {grid}
        </div>
      </Page>
    );
  }
}
