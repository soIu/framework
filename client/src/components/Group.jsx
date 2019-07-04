import React from 'react';
import {BlockTitle} from 'framework7-react';
import api from 'api';

export default class extends React.Component {
  constructor(props) {
    super(props);
    //this.state.lastHeight = 0.0;
    this.state.previousTitle = false;
  }

  async componentDidMount() {
    await api.wait_exist(() => this.refs.group);
    await api.wait(500);
    if (!this.props.title) {
      let index = 0
      for (let element of [this.refs.group.previousElementSibling, this.refs.group.nextElementSibling]) {
        if (element && (!index ? element.offsetLeft === 0 : element.offsetLeft > 0) && element.querySelector('div.component-group-title')) {
          this.setState({previousTitle: true});
          break;
        }
        index += 1;
      }
    }
    /*if (this.props.children || this.refs.group.previousElementSibling === null || this.refs.group.previousElementSibling.offsetLeft !== 0) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.refs.group || !this.refs.group.previousElementSibling) return clearInterval(this.interval);
      const lastHeight = this.refs.group.previousElementSibling.clientHeight - 20;
      if (lastHeight !== this.state.lastHeight) {
        this.setState({lastHeight: lastHeight});
      }
    }, 500);*/
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render(props) {
    if (props.width && props.width.slice(-1) === '%' && parseInt(props.width.slice(0, -1)) > 97) {
      props.width = '97%';
    }
    return (
      <div ref="group" className="component-group" style={{float: 'left', width: props.width || '46.5%', padding: '10px', marginTop: '20px', height: 'auto', ...((props.invisible instanceof Function ? props.invisible(window.models.env.context.active_id) : props.invisible) ? {position: 'absolute', left: '-9999px', top: '-9999px'} : {})}}>
        {(props.title || this.state.previousTitle) && (
          <BlockTitle className="component-group-title" style={{'fontSize': '25px', 'lineHeight': 'unset', ...(this.state.previousTitle ? {'height': '37px'} : {})}}>{props.title || ''}</BlockTitle>
        )}
        {props.children}
      </div>
    );
  }
}
