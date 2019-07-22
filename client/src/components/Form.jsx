import React from 'react';
import Page from './Page';
import {Button} from 'framework7-react';
import api from 'api';

export default class extends React.Component {
  constructor(props) {
    super(props);

    //const model = window.models.env.context.active_model;
    const models = window.models;
    //const active_id = window.models.env.context.active_id || null;
    models.env.context.editing = false;
    //models.env.context.new_value = {};
    this.state = models.env.context;//{editing: false, active_id: active_id};
    this.state.edit_function = this.edit.bind(this);
  }

  async componentDidMount(props) {
    const model = window.models.env.context.active_model;
    const models = window.models;
    models.env.context.active_lines = {};
    models.env.context.active_task = [];
    const form = this;
    if (this.props.isCustomView || !models.env.context.active_ids || models.env.context.active_ids.length < 1 || !models.env.context.active_ids[0]) {
      models.env.context.active_id = models.env[model].browse();
      await window.models.env.context.active_id._wait_promise();
      models.env.context.editing = true;
      return this.setState(models.env.context);
    }
    //else if (!models.env.context.active_id) {
    models.env.context.active_id = await models.env[model].browse(models.env.context.active_ids);
    //}
    return models.env.context.refresh();
    //api.globals.app.views.main.router.refreshPage();
  }

  async edit() {
    await api.wait_exist(() => !api.globals.onchange_running);
    const models = window.models;
    const model = models.env.context.active_id._name;
    const offline = this.props.offline ? JSON.parse(this.props.offline) : false;
    if (!this.state.editing) {
      models.env.context.editing = true;
      return await this.setState({...models.env.context, offline});
    }
    const operation = models.env.context.active_id.id ? 'write' : 'create';
    try {
      await models.env.context.active_id[operation]({}, !offline);
    }
    catch(error) {
      if (error && error.constructor === window.tools.exceptions.RequiredError) {
        error.field_map = {};
        for (let field of error.fields) {
          error.field_map[field] = true;
        }
        models.env.context.active_error = error;
        await this.setState({active_id: models.env.context.active_id});
        api.globals.app.toast.create({text: 'Some fields are required', closeButton: false, closeTimeout: 2000, position: 'center'}).open();
        return;
      }
      else {
        throw error;
      }
    }
    for (let task of models.env.context.active_task) {
      const result = task();
      if (result && result.constructor === Promise) await result;
    }
    models.env.context.active_task = [];
    if (operation === 'create') {
      api.globals.app.views.main.router.navigate(window.location.hash.replace('#!', '') + '?id=' + models.env.context.active_id.id, {reloadCurrent: true});
      const promises = [];
      for (let model in models.env.context.active_lines) {
        for (let inverse_field in models.env.context.active_lines[model]) {
          if (inverse_field.slice(0, 10) === 'many2many_') continue;
          promises.push(models.env.context.active_lines[model][inverse_field].write({[inverse_field]: models.env.context.active_id.id}));
        }
      }
      await Promise.all(promises);
    }
    if (!this.props.isCustomView) models.env.context.editing = false;
    if (offline) models.env.context.unsaved = {...models.env.context.unsaved, [model]: {...(models.env.context.unsaved && models.env.context.unsaved[model]), [models.env.context.active_id.id]: models.env.context.active_id.id}};
    await api.update_session({unsaved: models.env.context.unsaved});
    await this.setState({...models.env.context, offline});
    //api.globals.app.views.main.router.refreshPage();
  }

  async upload() {
    await api.wait_exist(() => !api.globals.onchange_running);
    const models = window.models;
    const model = models.env.context.active_id._name;
    let record = await models.env[model].browse(models.env.context.active_id.id);
    if (record.length < 1) {
      let old_record = record;
      record = await record.create();
      await old_record.unlink(false);
      models.env.context.active_id = record;
    }
    else {
      record = await models.env.context.active_id.write();
      models.env.context.active_id = record;
    }
    if (models.env.context.unsaved && models.env.context.unsaved[model] && models.env.context.unsaved[model][record.id]) delete models.env.context.unsaved[model][record.id];
    await api.update_session({unsaved: models.env.context.unsaved});
    return await this.setState({...models.env.context, offline: false});
  }

  render(props) {
    const model = window.models.env.context.active_model;
    console.log(this.state);
    //const models = window.models;
    const buttonStyle = {width: 'auto', float: 'left', 'margin-right': '10px'};
    const uploadStyle = {};
    if (!this.state.offline) uploadStyle['display'] = 'none';
    if (props.isCustomView) return (<Page title={window.tools.view[model].string}>{props.children}</Page>);
    return (
      <Page title={window.tools.view[model].string}>
        <div className="card" style={{margin: 0, boxShadow: 'none'}}>
          <div className="card-header">
            <div className="data-table-title">
              {window.tools.view[model].string}
              <span style={{color: '#666666'}}>{' / ' + (this.state.active_id && this.state.active_id.id ? this.state.active_id.name : 'New')}</span>
              <div>
                <Button onClick={this.edit.bind(this)} style={buttonStyle} fill>{this.state.editing ? 'Save' : 'Edit'}</Button>
                <Button onClick={() => api.globals.app.views.main.router.back()} style={{...buttonStyle, ...(!this.state.editing ? {display: 'none'} : {})}}>{'Cancel'}</Button>
                <Button onClick={this.upload.bind(this)} style={{...buttonStyle, ...uploadStyle}} fill>{'Upload'}</Button>
              </div>
            </div>
          </div>
          {props.children}
        </div>
      </Page>
    );
  }
}
