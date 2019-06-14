import React from 'react';

export default class extends React.Component {

  render(props) {
    return (
      <div className="card" style={{minHeight: '250px', marginTop: '20px'}}>
        <div className="card-content form-sheet">
          {props.children}
        </div>
      </div>
    );
  }
}
