import React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

let flatpickr_count = 0;

export default class extends React.Component {
  constructor(props) {
    super(props);
    flatpickr_count += 1;
    this.count = flatpickr_count;
  }

  componentWillUnmount() {
    if (this.props.inline) return document.getElementById('flatpickr-inline-clone-' + this.count) && document.getElementById('flatpickr-inline-clone-' + this.count).remove();
    if (this.flatpickr) this.flatpickr.destroy()
    if (this.props.customInput) delete this.props.customInput._flatpickr;
    delete this.flatpickr;
  }

  componentDidMount() {
    const clone = this.props.customComponent ? this.props.customInput : (!this.props.inline ? this.refs.flatpickr : document.getElementById('flatpickr-inline-clone-' + this.count) || this.refs.flatpickr.cloneNode(false));
    console.log(clone);
    if (!clone) return;
    if (this.props.inline) {
      clone.id = 'flatpickr-inline-clone-' + this.count;
      //clone.style.display = '';
      this.refs.flatpickr.insertAdjacentElement('afterend', clone);
    }
    let onChange = this.props.onChange;
    if (this.props.readOnly) onChange = async (value) => value !== await this.props.defaultDate && (await this.props.defaultDate ? this.flatpickr.setDate(await this.props.defaultDate) : this.flatpickr.clear());
    this.flatpickr = clone._flatpickr || flatpickr(clone, {...this.props, allowKeyboard: false, onChange: async (value) => {await onChange(value); this.flatpickr.open()}});
  }

  async componentDidUpdate() {
    if (this.props.customInput) this.componentDidMount();
    if (!this.flatpickr) return;
    let onChange = this.props.onChange;
    if (this.props.readOnly) onChange = async (value) => value !== await this.props.defaultDate && (await this.props.defaultDate ? this.flatpickr.setDate(await this.props.defaultDate) : this.flatpickr.clear());
    this.flatpickr.set('onChange', async (value) => {await onChange(value); this.flatpickr.open()});
    const date = await this.props.defaultDate;
    if (!this.flatpickr) return;
    if (date) this.flatpickr.setDate(date);
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
