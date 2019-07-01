import React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class extends React.Component {
  /*constructor(props) {
    super(props);
  }*/

  componentWillUnmount() {
    this.flatpickr.destroy()
    if (this.props.customInput) delete this.props.customInput._flatpickr;
    delete this.flatpickr;
  }

  componentDidMount() {
    const clone = this.props.customComponent ? this.props.customInput : (!this.props.inline ? this.refs.flatpickr : this.refs.flatpickr.cloneNode(false));
    console.log(clone);
    if (!clone) return;
    if (this.props.inline) {
      clone.style.display = '';
      this.refs.flatpickr.insertAdjacentElement('afterend', clone);
    }
    let onChange = this.props.onChange;
    if (this.props.readOnly) onChange = (value) => value !== this.props.defaultDate && (this.props.defaultDate ? this.flatpickr.setDate(this.props.defaultDate) : this.flatpickr.clear());
    this.flatpickr = clone._flatpickr || flatpickr(clone, {...this.props, onChange: async (value) => {await onChange(value); this.flatpickr.open()}});
  }

  componentDidUpdate() {
    if (this.props.customInput) this.componentDidMount();
    if (!this.flatpickr) return;
    let onChange = this.props.onChange;
    if (this.props.readOnly) onChange = (value) => value !== this.props.defaultDate && (this.props.defaultDate ? this.flatpickr.setDate(this.props.defaultDate) : this.flatpickr.clear());
    this.flatpickr.set('onChange', async (value) => {await onChange(value); this.flatpickr.open()});
    if (this.props.defaultDate) this.flatpickr.setDate(this.props.defaultDate);
    else {
      this.flatpickr.selectedDateObj = null;
      this.flatpickr.input.value = '';
    }
  }

  render(props) {
    return props.customComponent || (
      <input ref="flatpickr" style={props.inline && {display: 'none'}}/>
    );
  }
}
