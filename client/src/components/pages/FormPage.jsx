import React from 'react';
import Form from '../Form';
import Header from '../Header';
import Button from '../Button';
import Sheet from '../Sheet';
import Group from '../Group';
import Field from '../Field';
import Tree from '../Tree';
import Footer from '../Footer';
//import {transform as Parser} from 'babel-core';
//import preset from '@babel/preset-react';
import api from 'api';

window.rapydComponents = {...window.rapydComponents, Form, Header, Button, Sheet, Group, Field, Tree, Footer};

const function_string =
`if (!active_id) return false;
var True = true;
var False = false;
var None = null;
return `;

function parseView(view, model) {
  const customComponents = {...window.rapydComponents, Form, Header, Button, Sheet, Group, Field, Tree, Footer};
  view = new DOMParser().parseFromString(view, 'text/xml').children[0];
  function recurse(elements, parent_props) {
    let components = [];
    for (let element of elements) {
      const component = api.hasValue(element.tagName, '-') ? customComponents[element.tagName.split('-').map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join('')] : null || customComponents[element.tagName[0].toUpperCase() + element.tagName.toLowerCase().slice(1)] || customComponents[element.tagName] || element.tagName;
      const props = {model};
      for (let attribute of element.attributes) {
        props[attribute.name] = attribute.value;
      }
      for (let attribute of ['invisible', 'required', 'readonly', 'create']) {
        if (api.hasKey(props, attribute)) {
          if (api.hasValue(['true', 'True'], props[attribute])) props[attribute] = true;
          if (api.hasValue(['false', 'False'], props[attribute])) props[attribute] = false;
          if (props[attribute].constructor === Boolean) continue;
          if (api.hasValue(props[attribute], ' == ')) props[attribute] = props[attribute].replace('==', '===');
          if (api.hasValue(props[attribute], ' != ')) props[attribute] = props[attribute].replace('!=', '!==');
          if (api.hasValue(props[attribute], ' === ') || api.hasValue(props[attribute], ' !== ')) props[attribute] = new (Function.prototype.bind.apply(Function, [null, 'active_id', 'parent', function_string + props[attribute]]))();
        }
      }
      if (props.domain) props.domain = new (Function.prototype.bind.apply(Function, [null, 'active_id', 'parent', function_string + '[' + props.domain + ']']))();
      if (component === Tree) {
        const field = window.models.env[model]._fields[parent_props.name];
        props.model = field.relation;
        props.field = field.type === 'one2many' ? field.inverse : parent_props.name;
        if (field.type !== 'one2many') {
          props.parent_model = model;
          props.tree_arch = element.outerHTML;
        }
        if (parent_props.invisible) props.invisible = parent_props.invisible;
        if (parent_props.domain) props.domain = parent_props.domain;
      }
      components.push(React.createElement(component, props, recurse(element.children, props)));
    }
    components = components.length === 1 ? components[0] : components;
    return components
  }
  return recurse([view]);
}

const cachedViews = {};

export default class extends React.Component {
  componentDidMount() {
    const model = this.model, mode = this.mode;
    if (window.tools.view[model].custom_init && window.tools.view[model].custom_init[model + '.' + mode]) window.tools.view[model].custom_init[model + '.' + mode].bind(this)(this.props);
  }

  render(props) {
    const refresh = () => this.setState({});
    this.refresh = refresh.bind(this);
    window.models.env.context.refresh = this.refresh;
    let model = window.models.env.context.active_model;
    if (props.f7route && props.f7route.url) window.models.env.context.active_url = props.f7route.url;
    else window.models.env.context.active_url = '/';
    if (props.f7route && props.f7route.params && props.f7route.params.model) {
      model = props.f7route.params.model;
    }
    this.model = model;
    this.mode = 'form';
    const id = props.f7route.query.id;
    const view = window.tools.view[model].form;
    window.models.env.context.active_model = model;
    if (id) {
      window.models.env.context.active_ids = [id];
      //delete window.models.env.context.active_id;
    }
    else {
      delete window.models.env.context.active_ids;
    }
    /*if (id) {
      window.models.env[model].browse(id).then((record) => window.models.env.context.active_id = record);
    }*/
    if (!cachedViews[view]) {
      // eslint-disable-next-line
      //cachedViews[view] = eval(Parser(view, {presets: [preset]}).code);
      cachedViews[view] = parseView(view, model);
    }

    return cachedViews[view];
  }
}
