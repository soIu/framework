import React from 'react';
import {
    List,
    ListInput,
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
    window.models.env.context.active_id[this.props.name] = value;
    return await this.setState({value: altvalue || value});
  }

  async componentDidMount() {
    //if (!window.models.env.context.active_id) window.models.env.context.active_id = window.models.env[window.models.env.context.active_model].browse();
    await api.wait_exist(() => window.models.env.context.active_id);
    const props = this.props;
    const models = window.models;
    const model = window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const type = field.type;
    const context = window.models.env.context;
    const value = context.active_id && context.active_id[this.props.name];
    if (this.refs.input) {
      if (!api.hasValue(['text', 'data'], type)) {
        this.refs.input.$listEl[0].querySelector('input').value = value;
      }
      else {
        this.refs.input.$listEl[0].querySelector('textarea').value = type !== 'data' ? value : JSON.stringify(value);
      }
    }
    else if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type) && !props.children) {
      if (!value) {
        return this.setState({value: undefined});
      }
      const model = window.models.env.context.active_model;
      const field = window.models.env[model]._fields[props.name];
      const records = await models.env[field.relation].browse(value);
      if (value.constructor === String) {
        return this.setState({value: {id: records.id, text: records[records._rec_name || 'name']}});
      }
      else if (value.constructor === Array) {
        window.c = records;
        return this.setState({value: Array.from(records.__iter__()).map((record) => ({id: record.id, text: record[record._rec_name || 'name']}))});
      }
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      return this.setState({value, input: this.refs.date_input.$listEl[0].querySelector('input')});
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
    const model = window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const string = props.string || field.string;
    const type = field.type;
    const types = {char: 'text', text: 'textarea', float: 'number', integer: 'number', data: 'textarea'};
    const context = window.models.env.context;
    const refs = this.refs;

    async function fetch(url, init, query) {
      const limit = 10
      models.env.context.active_limit = limit;
      models.env.context.active_index = query.offset / limit;
      const records = await models.env[field.relation].with_context({no_preload: true}).search([(models.env[field.relation]._rec_name || 'name'), 'ilike', query.term]);
      const results = [];
      window.d = refs.selectivity;
      if (type === 'selection') return {results, more: false};
      for (let record of records) {
        results.push({id: record.id, text: record[record._rec_name || 'name']});
      }
      models.env.context.active_index = 0;
      console.log((query.offset / limit + 1) * limit < records._search_count);
      return {results: results, more: (query.offset / limit + 1) * limit < records._search_count};
    }

    if (api.hasValue(['many2many', 'one2many'], type) && props.children) {
      return props.children;
    }

    let component;

    if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one', 'selection'], type)) {
      let ajax;
      let items = null;
      if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type)) {
        ajax = {url: window.tools.configuration.url, minimumInputLength: 0, params: () => ({}), placeholder: '', fetch: fetch};
      }
      else if (type === 'selection') {
        items = field.selection.map((selection) => ({id: selection[0], text: selection[1]}));
      }
      component = (
        <ListInput label={string} input={false}>
          <Selectivity ref="selectivity" slot="input" ajax={ajax} items={items} placeholder={props.placeholder || ''} readOnly={!context.editing} multiple={api.hasValue(['many2many', 'one2many'], type)} data={this.state.value} onChange={(event) => this.setValue(event.value, event.data)} allowClear/>
        </ListInput>
      );
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      const input = (
        <ul>
          <ListInput ref="date_input" label={string} placeholder={props.placeholder || ''} disabled={!context.editing}/>
        </ul>
      );
      component = (
        <Flatpickr customComponent={input} customInput={this.state.input} enableTime={type === 'datetime' && true} enableSeconds={type === 'datetime' && true} defaultDate={this.state.value} onChange={(value) => this.setValue(value)}/>
      );
    }
    else {
      component = (
        <ListInput ref="input" label={string} type={types[type]} placeholder={props.placeholder || ''} disabled={!context.editing} onChange={(event) => this.setValue(event.target.value)}/>
      );
    }

    return (
      <List>
        {component}
      </List>
    );
  }
}
