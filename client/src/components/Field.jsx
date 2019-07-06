import React from 'react';
import {
    List,
    ListInput,
    F7Button as Button,
} from 'framework7-react';
import {React as Selectivity, Templates} from 'selectivity/react';
import 'selectivity/styles/selectivity-react.css';
import Flatpickr from './Flatpickr';
import api from 'api';


const singleSelectInput = Templates.singleSelectInput;
Templates.singleSelectInput = (options) => singleSelectInput(options).replace('<i class="fa fa-sort-desc selectivity-caret"></i>', '<i class="selectivity-caret material-icons">expand_more</i>');
const singleSelectedItem = Templates.singleSelectedItem;
Templates.singleSelectedItem = (options) => singleSelectedItem(options).replace('<i class="fa fa-remove"></i>', '<i class="selectivity-remove material-icons">close</i>');
const multipleSelectedItem = Templates.multipleSelectedItem;
Templates.multipleSelectedItem = (options) => multipleSelectedItem(options).replace('<i class="fa fa-remove"></i>', '<i class="selectivity-remove selectivity-multi-remove material-icons">close</i>');

export default class extends React.Component {
  /*constructor(props) {
    super(props);

    this.props = props;
  }*/

  async setValue(value, altvalue) {
    const props = this.props;
    api.globals.onchange_running = true;
    await api.wait(0);
    api.globals.onchange_running = false;
    window.models.env.context.active_error && (window.models.env.context.active_error.field_map[this.props.name] = false);
    if (this.input_type && this.input_type === 'file' && value) {
      value = await api.readAsDataURL(value);
      value = value.split('base64,')[1];
    }
    if (!this.props.cellEdit) window.models.env.context.active_id[this.props.name] = value;
    else return window.models.env.context.refresh();
    await window.models.env.context.active_id._wait_promise();
    const model = props.model;// || window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const type = field.type;
    if (this.refs.input) {
      await this.setInputValue(value);
    }
    else if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type) && !props.children) {
      await this.setSelectivityValue(altvalue);
    }
    else if (type === 'selection') {
      if (this.props.widget === 'statusbar') return this.setState({value});
      await this.setSelectivityValue(altvalue);
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      await this.setState({value, input: this.refs.date_input.base.querySelector('input')});
    }
    else {
      await this.setState({value: altvalue || value});
    }
    return window.models.env.context.refresh();
  }

  async setSelectivityValue(value) {
    value = await value;
    if (!window.tools.exist(value)) return;
    await api.wait_exist(() => this.refs.selectivity);
    if (value && value === this.lastSelectivity) return;
    this.lastSelectivity = value;
    const props = this.props;
    const models = window.models;
    const model = props.model;// || window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const type = field.type;
    if (!model) {
      return;// this.setState({value: null});
    }
    else if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type) && !props.children) {
      //const model = props.model || window.models.env.context.active_model;
      //const field = window.models.env[model]._fields[props.name];
      if (value && typeof value === 'object' && !Array.isArray(value) && value.id) value = value.id;
      const records = await models.env[field.relation].browse(value);
      if (!records.length) return;
      if (value.constructor === String) {
        return this.setState({value: {id: records.id, text: records[records._rec_name || 'name']}});
      }
      else if (value.constructor === Array) {
        return this.setState({value: Array.from(records.__iter__()).map((record) => ({id: record.id, text: record[record._rec_name || 'name']}))});
      }
    }
    else if (type === 'selection') {
      const selections = typeof field.selection === 'function' ? field.selection.apply(models.env.context.active_id, [models.env.context.active_id]) : field.selection;
      return window.tools.dict(selections)[value] && this.setState({value: value && {id: value, text: window.tools.dict(selections)[value]}});
    }
  }

  setInputValue(value) {
    const props = this.props;
    const model = props.model || window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const type = field.type;
    if (type === 'binary') return;
    if (type === 'float' || type === 'integer') value = value || null;
    if (this.refs.input) {
      if (!api.hasValue(['text', 'data', 'boolean'], type)) {
        this.refs.input.base.querySelector('input').value = value;
      }
      else if (type === 'boolean') {
        this.refs.input.base.querySelector('input').checked = value;
      }
      else {
        this.refs.input.base.querySelector('textarea').value = type !== 'data' ? value : JSON.stringify(value);
      }
    }
  }

  async componentDidMount() {
    //if (!window.models.env.context.active_id) window.models.env.context.active_id = window.models.env[window.models.env.context.active_model].browse();
    await api.wait_exist(() => window.models.env.context.active_id);
    const props = this.props;
    const models = window.models;
    const model = props.model || window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const type = field.type;
    const context = window.models.env.context;
    if (context.active_id._pending_promises.length > 0) await context.active_id._wait_promise();
    const value = props.cellEdit ? null : context.active_id && await context.active_id[this.props.name];
    if (this.props.ref_object) Object.assign(this.props.ref_object, this.refs, {loaded: true});
    if (this.refs.input) {
      return this.setInputValue(value);
    }
    else if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type) && !props.children) {
      return this.setSelectivityValue(value);
    }
    else if (type === 'selection') {
      if (this.props.widget === 'statusbar') return this.setState({value});
      return this.setSelectivityValue(value);
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      return this.setState({value, input: this.refs.date_input.base.querySelector('input')});
    }
    else {
      return this.setState({value});
    }
  }

  componentWillUnmount() {
    if (this.refs.selectivity && this.refs.selectivity.selectivity) this.refs.selectivity.selectivity.destroy();
  }

  render(props) {
    const models = window.models;
    const model = props.model || window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    if (!field) return;
    const string = props.string || field.string;
    const type = field.type;
    const types = {char: 'text', text: 'textarea', float: 'number', integer: 'number', data: 'textarea', 'boolean': 'checkbox', 'binary': 'file'};
    const context = window.models.env.context;
    const refs = this.refs;
    const active_id = props.cellEdit ? this.props.tree.state.records[this.props.rowIndex].id && context.active_lines[this.props.tree.state.model][(field.type !== 'one2many' ? 'many2many_' : '') + this.props.tree.state.tree_field].find(this.props.tree.state.records[this.props.rowIndex].id) || this.props.tree.state.records[this.props.rowIndex]._original_object_for_id : context.active_id;
    const invisible = props.invisible instanceof Function && active_id ? props.invisible(active_id, models.env.context.active_id) : props.invisible;
    props.readonly = field.readonly || props.readonly;
    const readonly = props.readonly instanceof Function && active_id ? props.readonly(active_id) : props.readonly;
    const value = props.cellEdit ? null : context.active_id && context.active_id[this.props.name];

    async function fetch(url, init, query) {
      try {
        const limit = 10
        models.env.context.active_limit = limit;
        models.env.context.active_index = query.offset / limit;
        const domain = (active_id && props.domain) ? props.domain(...(!props.cellEdit ? [active_id] : [active_id, models.env.context.active_id])) : [];
        const records = await models.env[field.relation].with_context({no_preload: true}).search([(models.env[field.relation]._rec_name || 'name'), 'ilike', query.term], ...domain);
        if (models.env.context.active_lines[field.relation]) {
          for (var inverse_field in models.env.context.active_lines[field.relation]) {
            records.add(models.env.context.active_lines[field.relation][inverse_field].filter((record) => record[record._rec_name || 'name'] && record[record._rec_name || 'name'].toLowerCase().indexOf(query.term.toLowerCase()) !== -1));
          }
        }
        const results = [];
        if (type === 'selection') return {results, more: false};
        for (let record of records) {
          if (!record.id) {
            const id = 'etemp' + Math.random().toString(36).substr(2, 9);
            if (!api.globals.temp_records) api.globals.temp_records = {};
            api.globals.temp_records[id] = record;
            results.push({id, text: record[record._rec_name || 'name']});
            continue;
          }
          results.push({id: record.id, text: record[record._rec_name || 'name']});
        }
        models.env.context.active_index = 0;
        console.log((query.offset / limit + 1) * limit < records._search_count);
        console.log(results);
        return {results: results, more: (query.offset / limit + 1) * limit < records._search_count};
      }
      catch(error) {
        console.error(error);
        throw error;
      }
    }

    if (api.hasValue(['many2many', 'one2many'], type) && props.children) {
      return props.children;
    }

    let component;

    if (type === 'selection' && props.widget === 'statusbar') {
      let first = true;
      const selection = typeof field.selection === 'function' ? field.selection.apply(context.active_id, [context.active_id]) : field.selection;
      const selections = window.tools.copy(selection).reverse();
      component = (
        <div style={invisible ? {display: 'none'} : {}}>
          {selections.map((selection) =>
          first ? <Button raised={models.env.context.active_id && models.env.context.active_id[props.name] === selection[0]} className="rapyd-statusbars">{(first = false) || selection[1]}</Button> : [<span className="rapyd-statusbars rapyd-statusbar-arrow">{'>'}</span>, <Button raised={models.env.context.active_id && models.env.context.active_id[props.name] === selection[0]} className="rapyd-statusbars">{selection[1]}</Button>]
          )}
        </div>
      );
      return component;
    }

    if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one', 'selection'], type)) {
      let ajax;
      let items = null;
      if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type)) {
        ajax = {url: window.tools.configuration.url, minimumInputLength: 0, params: () => ({}), placeholder: '', fetch: fetch};
      }
      else if (type === 'selection') {
        const selections = typeof field.selection === 'function' ? field.selection.apply(context.active_id, [context.active_id]) : field.selection;
        items = selections.map((selection) => ({id: selection[0], text: selection[1]}));
      }
      component = (
        <ListInput label={string} input={false} disabled={readonly || !context.editing} errorMessageForce={window.models.env.context.active_error ? window.models.env.context.active_error.field_map[props.name] : false} errorMessage="Field required">
          <Selectivity ref="selectivity" slot="input" data={window.tools.exist(this.state.value) && this.state.value.constructor !== Promise ? this.state.value : null} ajax={ajax} items={items} placeholder={props.placeholder || ''} readOnly={readonly || !context.editing} multiple={api.hasValue(['many2many', 'one2many'], type)} onChange={(event) => this.setValue(event.value, event.data)} onDropdownOpen={() => this.setState({'selectivityOpened': true})} onDropdownClose={() => (props.onSelect ? props.onSelect() : true) && this.setState({'selectivityOpened': false})} allowClear closeOnSelect/>
        </ListInput>
      );
      if (props.cellEdit) return component.children[0];
      api.wait(500).then(() => api.wait_exist(() => context.active_id)).then(async () => await context.active_id[props.name] && this.setSelectivityValue(await context.active_id[props.name]));
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      const input = (
        <ul>
          <ListInput ref="date_input" label={string} placeholder={props.placeholder || ''} disabled={readonly || !context.editing} errorMessageForce={window.models.env.context.active_error ? window.models.env.context.active_error.field_map[props.name] : false} errorMessage="Field required"/>
        </ul>
      );
      component = (
        <Flatpickr customComponent={input} customInput={this.state.input} enableTime={type === 'datetime' && true} enableSeconds={type === 'datetime' && true} defaultDate={value || this.state.value} onChange={(value) => this.setValue(value)}/>
      );
      if (props.cellEdit) return component.children.children;
    }
    else {
      this.input_type = types[type];
      component = (
        <ListInput ref="input" label={string} type={types[type]} placeholder={props.placeholder || ''} disabled={readonly || !context.editing} onChange={(event) => this.setValue(event.target.type === 'checkbox' ? event.target.checked : event.target.type === 'file' ? event.target.files[0] : event.target.value)} errorMessageForce={window.models.env.context.active_error ? window.models.env.context.active_error.field_map[props.name] : false} errorMessage="Field required"/>
      );
      api.wait_exist(() => this.refs.input).then(async () => this.setInputValue(await value || await this.state.value || 0.0));
    }

    return (
      <List style={{...(invisible ? {display: 'none'} : {}), ...(!this.state.selectivityOpened ? {'zIndex': '0'} : {})}}>
        {component}
      </List>
    );
  }
}
