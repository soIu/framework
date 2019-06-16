import React, { Component } from 'react';
import Field from './Field';
import api from 'api';

export default class extends Component {
  async afterGuiAttached() {
    await api.wait_exist(() => this.refs.loaded);
    if (this.refs.selectivity && this.refs.selectivity.selectivity) this.refs.selectivity.selectivity.open();
  }

  getValue() {
    if (this.refs.selectivity && this.refs.selectivity.selectivity) {
      const value = this.refs.selectivity.selectivity.getData();
      if (!value) return value;
      const colDef = window.tools.copy(this.props.column.colDef);
      delete colDef.cellEditorFramework;
      let temp_ids = this.refs.selectivity.selectivity.getValue();
      if (!Array.isArray(temp_ids)) temp_ids = [temp_ids];
      const records = window.models.env[window.models.env[this.props.model]._fields[this.props.name].relation];
      for (let temp_id of temp_ids) {
        if (temp_id.slice(0, 5) === 'etemp') {
          records.add(api.globals.temp_records[temp_id]);
        }
        else {
          const record = records.browse();
          record.update({id: temp_id});
          records.add(record);
        }
      }
      console.log(records);
      this.props.tree.onChange({colDef, data: this.props.tree.state.records[this.props.rowIndex], oldValue: null, newValue: records});
      if (!Array.isArray(value)) {
        return value.text;
      }
      return value.map((data) => data.text).join(', '); 
    }
  }

  async onSelect() {
    await api.wait(10);
    this.props.api.stopEditing();
  }

  render(props) {
    //const field = props.field_object;
    //delete props.field_object;
    this.refs = {};
    const onSelect = this.onSelect.bind(this);
    const component = (<Field {...props} ref_object={this.refs} cellEdit={true} onSelect={onSelect}/>);
    return component;
  }
}
