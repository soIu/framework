import React from 'react';

export default class extends React.Component {

  render(props) {
    return (
      <div className="card" style={{margin: 0, boxShadow: 'none', padding: '20px', minHeight: '30%', marginTop: '30px', ...((props.invisible instanceof Function ? props.invisible(window.models.env.context.active_id) : props.invisible) ? {display: 'none'} : {})}}>
        <div className="card-header">
          {props.children}
        </div>
      </div>
    );
  }
}
