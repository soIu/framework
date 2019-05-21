import React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class extends React.Component {
  /*constructor(props) {
    super(props);
  }*/

  componentDidMount() {
    console.log(this.props.customInput)
    const clone = this.props.customInput || (!this.props.inline ? this.refs.flatpickr : this.refs.flatpickr.cloneNode(false));
    if (!clone) return;
    if (this.props.inline) {
      clone.style.display = '';
      this.refs.flatpickr.insertAdjacentElement('afterend', clone);
    }
    let onChange = this.props.onChange;
    if (this.props.readOnly) onChange = (value) => value !== this.props.defaultDate && (this.props.defaultDate ? this.flatpickr.setDate(this.props.defaultDate) : this.flatpickr.clear());
    this.flatpickr = flatpickr(clone, {...this.props, onChange: async (value) => {await onChange(value); this.flatpickr.open()}});
  }

  componentDidUpdate() {
    if (this.props.customInput) this.componentDidMount();
    if (!this.flatpickr) return;
    let onChange = this.props.onChange;
    if (this.props.readOnly) onChange = (value) => value !== this.props.defaultDate && (this.props.defaultDate ? this.flatpickr.setDate(this.props.defaultDate) : this.flatpickr.clear());
    this.flatpickr.set('onChange', async (value) => {await onChange(value); this.flatpickr.open()});
    this.flatpickr.setDate(this.props.defaultDate);
  }

  render(props) {
    return props.customComponent || (
      <input ref="flatpickr" style={props.inline && {display: 'none'}}/>
    );
  }
}
