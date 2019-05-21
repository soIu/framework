import React from 'react';
import Page from './Page';
import Grid from './Grid';
import {Button} from 'framework7-react';
import api from 'api';

function autoSizeAll(gridOptions) {
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
  if (usedWidth < availableWidth) {
    grid.sizeColumnsToFit();
  }
  //gridOptions.api.sizeColumnsToFit();
  //gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

export default class extends React.Component {
  constructor(props) {
    super(props);

    const model = props.model || window.models.env.context.active_model;
    const children = props.children.constructor === Array ? props.children : [props.children];
    function isEditable() {
      if (props.isTreeView && !props.editable) {
        return false;
      }
      if (window.models.env.context.editing) {
        return true;
      }
      return false;
    }
    const fields = children.map((child, index) => ({headerName: (() => child.attributes.string || window.models.env[model]._fields[child.attributes.name].string)(), field: child.attributes.name, filterParams: {applyButton: true, clearButton: true}, editable: isEditable}));
    fields[0].checkboxSelection = true;
    fields[0].headerCheckboxSelection = true;
    //fields[0].suppressSizeToFit = true;
    const records = [];
    this.state = {fields: fields, records: records, limit: 50, model: model};
    if (props.field) {
      this.state.tree_field = props.field;
    }
  }

  paginate(rows, index=0) {
    if (rows.length < 1) {
      return rows;
    }
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
      const records = await models.env[models.env.context.active_model].search(...args);
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
      const records = await models.env[models.env.context.active_model].search(...args);
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
      const args = models.env.context.active_args || (this.state.tree_field ? [[this.state.tree_field, 'in', window.models.env.context.active_ids]] : []);
      models.env.context.active_limit = this.state.limit;
      models.env.context.active_index = index;
      const records = await models.env[this.state.model].search(...args);
      if (records.length > 0) {
        this.setState({records: this.paginate(records.values.constructor === Array ? records.values : [records.values], index)})
      }
    }
    catch(error) {
      console.log(error);
    }
    load.done();
  }

  render(props) {
    const model = props.model || window.models.env.context.active_model;
    const models = window.models;
    const grid = (
      <div className="card-body" style={{height: this.state.records.length * 48 + 112 <= 440 ? this.state.records.length * 48 + 112 + 'px' : '67vh'}}>
        <Grid onGridReady={(params) => (window.onresize = () => autoSizeAll(params))()} onRowClicked={(params) => models.env[model].browse([]).then((record) => models.env.context.active_id = models.env[model].browse()).then(() => models.env.context.active_id.values = params.data).then(() => this.$f7.views.main.router.navigate('/form/' + model + '?id=' + params.data.id))} onPaginationChanged={(params) => this.paging.bind(this)(params.api.paginationGetCurrentPage(), params)} onSortChanged={(params) => this.sort.bind(this)(params.api.getSortModel(), params)} onFilterChanged={(params) => this.filter.bind(this)(params.api.getFilterModel(), params)} paginationPageSize={this.state.limit} columnDefs={this.state.fields} rowData={this.state.records}/>
      </div>
    );
    //delete grid.props.children[0].props.onRowClicked;
    if (!props.isTreeView) {
      delete grid.props.children[0].props.onRowClicked;
      return grid;
    }
    return (
      <Page pageCache={props.pageCache} title={window.tools.view[model].string}>
        <div className="card">
          <div className="card-header">
            <div className="data-table-title">
              {window.tools.view[model].string}
              <br/>
              <Button onClick={() => this.$f7.views.main.router.navigate('/form/' + model)} style={{display: 'inline-block'}} fill>Create</Button>
            </div>
          </div>
          {grid}
        </div>
      </Page>
    );
  }
}
