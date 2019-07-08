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

OfflinePluginRuntime.install({onInstalled: () => OfflinePluginRuntime.update(), onUpdateReady: () => window.tools ? api.globals.app.dialog.confirm('Update available, apply it?', () => OfflinePluginRuntime.applyUpdate(() => window.location.reload())) : OfflinePluginRuntime.applyUpdate(() => window.location.reload())});

// Init Framework7-React plugin
Framework7.use(Framework7React);

window.React = React;
window.ReactDOM = ReactDOM;

window.rapydComponents = {...Framework7Components, ...window.rapydComponents, Page, Flatpickr};

// Mount React App
(async () => {
  const wait_session = api.get_session();
  try {
    window.addEventListener('beforeinstallprompt', async (event) => {
      event.preventDefault();
      await wait_session;
      api.globals.InstallPromp = event;
      if (document.getElementById('pwa_install_button')) document.getElementById('pwa_install_button').style.display = 'inline-block';
      try {
        if (window.models) {
          await api.wait(3000);
          event.prompt();
          if (await event.userChoice === 'accepted') window.location.reload();
          document.getElementById('pwa_install_button').style.display = 'none';
        }
      }
      catch (error) {
        console.error(error);
      }
    });
  }
  catch (error) {
    console.error(error);
  }
  await wait_session;
  const tools = window.tools;
  if (tools && (tools.configuration.long_name || tools.configuration.app_name)) document.querySelector('title').innerHTML = tools.configuration.long_name || tools.configuration.app_name;
  await ReactDOM.render(
    React.createElement(App),
    document.getElementById('app'),
  );
  if (tools && tools.configuration.custom_navbar) {
    var style = document.createElement('style');
    style.innerHTML = '.navbar, .toolbar {background-color: ' + window.tools.configuration.custom_navbar + '!important}';
    document.querySelector('head').append(style);
  }
  if (document.querySelector('div.navbar')) {
    const color_element = document.createElement('meta');
    color_element.name = 'theme-color';
    color_element.content = '#' + getComputedStyle(document.querySelector('.navbar'), null).backgroundColor.replace('rgb(', '').replace(')', '').split(', ').map(function(c) {return parseInt(c).toString(16)}).map(function(hex) {return hex.length === 1 ? "0" + hex : hex}).join('');
    document.querySelector('head').appendChild(color_element);
    api.globals.registerManifest();
  }
})();
