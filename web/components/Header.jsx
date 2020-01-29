import React from 'react';

export default (props) => (
  <div style={{margin: 0, backgroundColor: '#8F8F8F', 'minHeight': '56px', ...((props.invisible instanceof Function ? props.invisible(window.models.env.context.active_id) : props.invisible) ? {display: 'none'} : {})}}>
    {props.children}
  </div>
)
