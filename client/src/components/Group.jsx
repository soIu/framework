import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state.lastHeight = 0.0;
  }

  componentDidMount() {
    if (this.props.children || this.refs.group.previousElementSibling === null) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.refs.group || !this.refs.group.previousElementSibling) return clearInterval(this.interval);
      const lastHeight = this.refs.group.previousElementSibling.clientHeight - 20;
      if (lastHeight !== this.state.lastHeight) {
        this.setState({lastHeight: lastHeight});
      }
    }, 500);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render(props) {
    if (props.width && props.width.slice(-1) === '%' && parseInt(props.width.slice(0, -1)) > 97) {
      props.width = '97%';
    }
    return (
      <div ref="group" className="component-group" style={{float: 'left', width: props.width || '46.5%', padding: '10px', marginTop: '20px', height: props.children ? 'auto' : this.state.lastHeight + 'px', ...((props.invisible instanceof Function ? props.invisible(window.models.env.context.active_id) : props.invisible) ? {position: 'absolute', left: '-9999px', top: '-9999px'} : {})}}>
        {props.children}
      </div>
    );
  }
}
