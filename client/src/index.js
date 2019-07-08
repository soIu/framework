// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle';

// Import Framework7-React plugin
import Framework7React from 'framework7-react';

import * as Framework7Components from 'framework7-react';

// Import main App component
import App from './components/App.jsx';

import Page from './components/Page.jsx';

import Flatpickr from './components/Flatpickr.jsx';

// Framework7 styles
import 'framework7/css/framework7.min.css';

// Icons
import './css/icons.css';

// Custom app styles
import './css/app.css';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import api from 'api';

OfflinePluginRuntime.install({onInstalled: () => OfflinePluginRuntime.update(), onUpdateReady: () => api.globals.app.dialog.confirm('Update available, apply it?', () => OfflinePluginRuntime.applyUpdate())});

// Init Framework7-React plugin
Framework7.use(Framework7React);

window.React = React;
window.ReactDOM = ReactDOM;

window.rapydComponents = {...Framework7Components, ...window.rapydComponents, Page, Flatpickr};

// Mount React App
(async () => {
  await api.get_session();
  await ReactDOM.render(
    React.createElement(App),
    document.getElementById('app'),
  );
  if (window.tools && window.tools.configuration.custom_navbar) {
    var style = document.createElement('style');
    style.innerHTML = '.navbar, .toolbar {background-color: ' + window.tools.configuration.custom_navbar + '!important}';
    document.querySelector('head').append(style);
  }
  if (document.querySelector('div.navbar')) {
    const color_element = document.createElement('meta');
    color_element.name = 'theme-color';
    color_element.content = '#' + getComputedStyle(document.querySelector('.navbar'), null).backgroundColor.replace('rgb(', '').replace(')', '').split(', ').map(function(c) {return parseInt(c).toString(16)}).map(function(hex) {return hex.length === 1 ? "0" + hex : hex}).join('');
    document.querySelector('head').appendChild(color_element);
  }
})();
