import React from 'react';
import Page from './Page';
import Grid from './Grid';
import GridEditor from './GridEditor';
import {Button, Icon} from 'framework7-react';
import api from 'api';

async function autoSizeAll(gridOptions) {
  console.log(this);
  if (this) {
    this.gridOptions = gridOptions;
    await api.wait_exist(() => this.props.invisible instanceof Function ? !this.props.invisible(window.models.env.context.active_id) : !this.props.invisible);
  }
  /*var allColumnIds = [];
  let first = true;
  gridOptions.columnApi.getAllColumns().forEach(function(column) {
    if (first) {
      first = false;
      return;
    }
    allColumnIds.push(column.colId);
  });*/
  let grid = gridOptions.api
  //let panel = grid['gridPanel'];
  let availableWidth = grid['gridPanel'].getWidthForSizeColsToFit();
  let columns = grid['gridPanel']['columnController'].getAllDisplayedColumns();
  let usedWidth = grid['gridPanel']['columnController'].getWidthOfColsInList(columns);
  //if (usedWidth < availableWidth) {
  grid.sizeColumnsToFit();
  //}
  //gridOptions.api.sizeColumnsToFit();
  //gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

export default class extends React.Component {
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
    function onChange(params) {
      if (!params.colDef.cellEditorFramework && params.newValue != params.oldValue) {
        const value = params.newValue;
        const record = params.data.id ? window.models.env.context.active_lines[this.state.model][this.state.tree_field].find(params.data.id) : this.state.new_records.values === params.data._original_object_for_id && this.state.new_records || Array.from(this.state.new_records.__iter__()).find((record) => record.values === params.data._original_object_for_id);
        if (!this.pendingTask.write && record.id) {
          this.pendingTask.write = true;
        }
        else if (!this.pendingTask.write && !record.id) {
          this.pendingTask.create = true;          
        }
        if (!this.pendingTask.tasked && (this.pendingTask.create || this.pendingTask.write)) {
          this.pendingTask.tasked = true;
          window.models.env.context.active_task.push((async () => {
            if (this.pendingTask.create) await this.state.new_records.create();
            if (this.pendingTask.write) await window.models.env.context.active_lines[this.state.model][this.state.tree_field].write();
          }).bind(this));
        }
        record[params.colDef.field] = value;
      }
    }
    this.onChange = onChange.bind(this);
    function onSelectionChanged(event) {
      const selected = event.api.getSelectedRows();
      const ids = [];
      for (let data of selected) {
        if (data.id) ids.push(data.id);
      }
      return this.setState({active_ids: ids, selected});
    }
    this.onSelectionChanged = onSelectionChanged.bind(this);
    function handleOutside(event) {
      if (this.refs.grid && !this.refs.grid.base.querySelector('div.ag-body').contains(event.target) && this.gridOptions) this.gridOptions.api.stopEditing();
    }
    this.handleOutside = handleOutside.bind(this);
    const children = props.children.constructor === Array ? props.children : [props.children];
    const fields = children.map((child, index) => ({headerName: (() => child.attributes.string || window.models.env[model]._fields[child.attributes.name].string)(), field: child.attributes.name, filterParams: {applyButton: true, clearButton: true}, editable: isEditable, onCellValueChanged: this.onChange, ...((['date', 'datetime'].indexOf(window.models.env[model]._fields[child.attributes.name].type) !== -1 || window.models.env[model]._fields[child.attributes.name].relation) ? {cellEditorFramework: GridEditor, cellEditorParams: {...child.props, model, tree: this}, cellClass: 'editable-special-cell'} : {})}));
    fields[0].checkboxSelection = true;
    fields[0].headerCheckboxSelection = true;
    //fields[0].suppressSizeToFit = true;
    const records = [];
    this.state = {fields: fields, records: records, new_records: window.models.env[model], updated_records: {}, limit: 50, model: model, frameworkComponents: {specialEditor: GridEditor}, selected: []};
    if (props.field) {
      this.state.tree_field = props.field;
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutside);
    //return autoSizeAll.bind(this)(this.gridOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutside);
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
      this.paging.bind(this)(0, params);
    }
  }

  filter(fields, params) {
    const models = window.models;
    //const load = api.preload();
    const args = this.state.tree_field ? [[this.state.tree_field, 'in', window.models.env.context.active_ids]] : [];
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
        args.push([field, types[condition.type], condition.filter]);
        values.push(condition.filter);
      }
    }
    models.env.context.active_args = args;
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
      this.paging.bind(this)(0, params);
    }
  }

  async paging(index, params) {
    if (params.newData !== false) {
      return;
    }
    const load = api.preload();
    try {
      const models = window.models;
      const args = models.env.context.active_args || (this.state.tree_field ? [[this.state.tree_field, 'in', window.models.env.context.active_ids || []]] : []);
      models.env.context.active_limit = this.state.limit;
      models.env.context.active_index = index;
      let records = await models.env[this.state.model].search(...args);
      if (!this.props.isTreeView) {
        if (!models.env.context.active_lines) models.env.context.active_lines = {};
        if (!models.env.context.active_lines[this.state.model]) models.env.context.active_lines[this.state.model] = {};
        if (!models.env.context.active_lines[this.state.model][this.state.tree_field]) {
          models.env.context.active_lines[this.state.model][this.state.tree_field] = records;
        }
        else {
          records = models.env.context.active_lines[this.state.model][this.state.tree_field].add(records);
        }
      }
      else {
        records.add(this.state.new_records);
      }
      if (records.length > 0) {
        window.c = this;
        await this.setState({records: this.paginate(await records.read(true), index)})
      }
      else if (records.length === 0) await this.setState({records: []});
    }
    catch(error) {
      console.log(error);
    }
    load.done();
  }

  async addItem() {
    if (!this.isEditable()) return;
    const record = window.models.env[this.state.model].browse();
    if (window.models.env.context.active_id.id) record[this.state.tree_field] = window.models.env.context.active_id.id;
    if (record._pending_promises.length > 0) {
      await record._wait_promise();
      if (!this.pendingTask.tasked) {
        this.pendingTask.create = true;
        this.pendingTask.tasked = true;
        window.models.env.context.active_task.push((async () => {
          if (this.pendingTask.create) await this.state.new_records.create();
          if (this.pendingTask.write) await window.models.env.context.active_lines[this.state.model][this.state.tree_field].write();
        }).bind(this));
      }
    }
    const values = await record.read(true);
    this.state.new_records.add(record);
    this.state.records.push(values[0]);
    if (!this.props.treeView) window.models.env.context.active_lines[this.state.model][this.state.tree_field].add(record);
    await this.setState({records: this.state.records, new_records: this.state.new_records});
    this.gridOptions.api.updateRowData({add: values});
  }

  async removeItem() {
    if (this.props.isTreeView) {
      const records = await window.models.env[this.state.model].browse(this.state.active_ids);
      await records.unlink();
      await this.paging.bind(this)(0, {newData: false});
      //this.gridOptions.api.updateRowData({remove: this.state.selected});
      return this.setState({selected: []});
    }
    for (let data of this.state.selected) {
      for (let index in this.state.records) {
        if (data === this.state.records[index]) this.state.records.pop(index);
      }
      if (!window.models.env.context.active_id.id) {
        const values = window.models.env.context.active_lines[this.state.model][this.state.tree_field].values;
        if (!Array.isArray(values)) {
          if (data._original_object_for_id === values) window.models.env.context.active_lines[this.state.model][this.state.tree_field] = window.models.env[this.state.model];
          continue;
        }
        for (let index in values.as_array()) {
          if (data._original_object_for_id === values[index]) values.pop(index);
        }
        continue;
      }
      const params = {data};
      params.oldValue = "";
      params.newValue = null;
      params.colDef = {field: this.state.tree_field};
      this.onChange(params);
    }
    await this.setState({records: this.state.records, selected: []});
    this.gridOptions.api.updateRowData({remove: this.state.selected});
  }

  render(props) {
    const model = props.model || window.models.env.context.active_model;
    const models = window.models;
    const grid = (
      <div className="card-body" style={{height: this.state.records.length * 48 + 112 + (this.isEditable() ? 30 : 0) <= 440 ? this.state.records.length * 48 + 112 + (this.isEditable() ? 30 : 0) + 'px' : '67vh', ...((props.invisible instanceof Function ? props.invisible(window.models.env.context.active_id) : props.invisible) ? {display: 'none'} : {})}}>
        <Grid ref="grid" onGridReady={((params) => autoSizeAll.bind(this)(params) && window.addEventListener('resize', () => autoSizeAll(params))).bind(this)} onRowClicked={(params) => models.env[model].browse(params.data.id || params.data._original_object_for_id.id).then((record) => models.env.context.active_id = record).then(() => api.globals.app.views.main.router.navigate('/form/' + model + '?id=' + params.data.id))} onPaginationChanged={(params) => this.paging.bind(this)(params.api.paginationGetCurrentPage(), params)} onSortChanged={(params) => this.sort.bind(this)(params.api.getSortModel(), params)} onFilterChanged={(params) => this.filter.bind(this)(params.api.getFilterModel(), params)} onSelectionChanged={this.onSelectionChanged} paginationPageSize={this.state.limit} columnDefs={this.state.fields} rowData={this.state.records} frameworkComponents={this.state.frameworkComponents}/>
        <Button onClick={this.addItem.bind(this)} style={{display: this.isEditable() ? 'inline-block' : 'none', top: '-45px'}}>Add</Button>
        <Button onClick={this.removeItem.bind(this)} style={{display: (props.isTreeView || this.isEditable()) && this.state.selected.length > 0 ? 'inline-block' : 'none', top: '-45px'}}>Delete</Button>
      </div>
    );
    if (!props.isTreeView) {
      if (window.models.env.context.editing) delete grid.props.children[0].props.onRowClicked;
      return grid;
    }
    return (
      <Page title={window.tools.view[model].string}>
        <div className="card">
          <div className="card-header">
            <div className="data-table-title">
              {window.tools.view[model].string}
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
