import React from 'react';
//import Parser from 'react-jsx-parser';
import Tree from '../Tree';
import Field from '../Field';
//import {transform as Parser} from 'babel-core';
//import preset from '@babel/preset-react';

const customComponents = {Tree, Field};

function parseView(view, model) {
  view = new DOMParser().parseFromString(view, 'text/xml').children[0];
  function recurse(elements) {
    let components = [];
    for (let element of elements) {
      const component = customComponents[element.tagName[0].toUpperCase() + element.tagName.toLowerCase().slice(1)] || customComponents[element.tagName] || element.tagName;
      const props = {model};
      for (let attribute of element.attributes) {
        props[attribute.name] = attribute.value;
      }
      props.isTreeView = true;
      components.push(React.createElement(component, props, recurse(element.children)));
    }
    components = components.length === 1 ? components[0] : components;
    return components
  }
  return recurse([view]);
}

const cachedViews = {};

export default (props) => {
  console.log(props);
  let model = window.models.env.context.active_model;
  if (props.f7route) {
    model = props.f7route.params.model;
    window.models.env.context.active_url = props.f7route.url;
  } else {
    window.models.env.context.active_url = '/';
  }
  const view = window.tools.view[model].tree;
  window.models.env.context.active_model = model;

  if (!cachedViews[view]) {
    // eslint-disable-next-line
    //cachedViews[view] = evals(Parser(view, {presets: [preset]}).code);
    cachedViews[view] = parseView(view, model);
  }

  return cachedViews[view];

  /*return (
    <Parser components={{Tree}} jsx={view} renderInWrapper={false}/>
  );*/
}
