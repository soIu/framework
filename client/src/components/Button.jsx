import React from 'react';
import {
    Button,
} from 'framework7-react';
import api from 'api';

async function button(props) {
  const load = api.preload();
  if (props.name) {
    try {
      await window.models.env.context.active_id[props.name]();
    }
    catch(error) {
      console.log(error);
      load.done();
    }
  }
  await window.models.env.context.refresh();
  load.done();
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = window.models.env.context;
  }

  render(props) {
    return (
      <Button fill onClick={() => button.bind(this)(props)} style={{display: 'block', float: 'left', width: 'auto', margin: '10px'}}>{props.string}</Button>
    );
  }
}
