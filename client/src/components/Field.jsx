import React from 'react';
import {
    List,
    ListInput,
} from 'framework7-react';
import {React as Selectivity} from 'selectivity/react';
import Flatpickr from './Flatpickr';
import api from 'api';

export default class extends React.Component {
  /*constructor(props) {
    super(props);

    this.props = props;
  }*/

  async setValue(values) {
    for (let key in values) {
      window.models.env.context.active_id[key] = values[key];
    }
    return await this.setState(values);
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
        return this.setState({value: records.values.map((record) => ({id: record.id, text: record[record._rec_name || 'name']}))});
      }
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      return this.setState({value, input: this.refs.date_input.$listEl[0].querySelector('input')});
    }
  }

  render(props) {
    const models = window.models;
    const model = window.models.env.context.active_model;
    const field = window.models.env[model]._fields[props.name];
    const string = props.string || field.string;
    const type = field.type;
    const types = {char: 'text', text: 'textarea', float: 'number', integer: 'number', data: 'textarea'};
    const context = window.models.env.context;

    async function fetch(url, init, query) {
      const limit = 10
      models.env.context.active_limit = limit;
      models.env.context.active_index = query.offset / limit;
      const records = await models.env[field.relation].search([(models.env[field.relation]._rec_name || 'name'), 'ilike', query.term]);
      const results = [];
      for (let record of records) {
        results.push({id: record.id, text: record[record._rec_name || 'name']});
      }
      models.env.context.active_index = 0;
      return {results: results, more: (query.offset / limit + 1) * limit < records._search_count};
    }

    if (api.hasValue(['many2many', 'one2many'], type) && props.children) {
      return props.children;
    }

    let component;

    if (api.hasValue(['many2many', 'one2many', 'many2one', 'one2one'], type)) {
      component = (
        <Selectivity ajax={{url: window.tools.configuration.url, minimumInputLength: 0, params: () => ({}), placeholder: '', fetch: fetch}} placeholder={props.placeholder || ''} readOnly={!context.editing} multiple={api.hasValue(['many2many', 'one2many'], type)} defaultValue={this.state.value} allowClear/>
      );
    }
    else if (api.hasValue(['date', 'datetime'], type)) {
      const input = (
        <ul>
          <ListInput ref="date_input" label={string} placeholder={props.placeholder || ''} disabled={!context.editing}/>
        </ul>
      );
      component = (
        <Flatpickr customComponent={input} customInput={this.state.input} enableTime={type === 'datetime' && true} enableSeconds={type === 'datetime' && true} defaultDate={this.state.value} onChange={(value) => this.setValue({[props.name]: value, value})}/>
      );
    }
    else {
      component = (
        <ListInput ref="input" label={string} type={types[type]} placeholder={props.placeholder || ''} disabled={!context.editing} onChange={(event) => this.setValue({[props.name]: event.target.value})}/>
      );
    }

    return (
      <List>
        {component}
      </List>
    );
  }
}
