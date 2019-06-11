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
  }

  async componentDidMount(props) {
    const model = window.models.env.context.active_model;
    const models = window.models;
    if (!models.env.context.active_ids || models.env.context.active_ids.length < 1 || !models.env.context.active_ids[0]) {
      models.env.context.active_id = models.env[model].browse();
      models.env.context.editing = true;
      this.setState(models.env.context);
      return;
    }
    else if (!models.env.context.active_id) {
      models.env.context.active_id = await models.env[model].browse(models.env.context.active_ids);
    }
    const refresh = () => this.setState({active_id: models.env.context.active_id});
    models.env.context.refresh = refresh;
    refresh()
  }

  async edit() {
    const models = window.models;
    const model = models.env.context.active_id._name;
    const offline = this.props.offline ? JSON.parse(this.props.offline) : false;
    if (!this.state.editing) {
      models.env.context.editing = true;
      return await this.setState({...models.env.context, offline});
    }
    const operation = models.env.context.active_id.id ? 'write' : 'create';
    await models.env.context.active_id[operation]({}, !offline);
    models.env.context.editing = false;
    if (offline) models.env.context.unsaved = {...models.env.context.unsaved, [model]: {...(models.env.context.unsaved && models.env.context.unsaved[model]), [models.env.context.active_id.id]: models.env.context.active_id.id}};
    await api.update_session({unsaved: models.env.context.unsaved});
    return await this.setState({...models.env.context, offline});
  }

  async upload() {
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
    return (
      <Page cache={props.cache} title={window.tools.view[model].string}>
        <div className="card" style={{margin: 0, boxShadow: 'none'}}>
          <div className="card-header">
            <div className="data-table-title">
              {window.tools.view[model].string}
              <span style={{color: '#666666'}}>{' / ' + (this.state.active_id && this.state.active_id.id ? this.state.active_id.name : 'New')}</span>
              <div>
                <Button onClick={this.edit.bind(this)} style={buttonStyle} fill>{this.state.editing ? 'Save' : 'Edit'}</Button>
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
