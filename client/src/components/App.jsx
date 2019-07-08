import React from 'react';
import {
  App,
  Panel,
  View,
  Statusbar,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListItem,
  Label,
  Input,
  ListButton,
  BlockFooter
} from 'framework7-react';

import routes from '../routes';

import api from 'api';

export default function (props) {
  const tools = window.tools;

  const manifest = tools ? {
    "short_name": tools.configuration.app_name || "App",
    "name": tools.configuration.long_name || tools.configuration.app_name || "App",
    "description": tools.configuration.app_description || "A webclient for Rapydframework based apps",
    "scope": ((href) => href.substring(0, href.lastIndexOf('/')) + '/')(window.location.origin + window.location.pathname),
    "start_url": ((href) => href.substring(0, href.lastIndexOf('/')) + '/')(window.location.origin + window.location.pathname) + '/index.html',
    "display": 'standalone',
    "background_color": 'white',
    "icons": [{
      "src": ((href) => href.substring(0, href.lastIndexOf('/')) + '/')(window.location.origin + window.location.pathname) + '/' + (tools.configuration.icon_big || "icon-512.png"),
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": ((href) => href.substring(0, href.lastIndexOf('/')) + '/')(window.location.origin + window.location.pathname) + '/' + (tools.configuration.icon_small || "icon-192.png"),
      "sizes": "192x192",
      "type": "image/png"
    }],
  } : null;

  let manifestRegistered = false;
  api.globals.registerManifest = () => {
    if (manifestRegistered || !tools || document.getElementById('rapyd-app-manifest').href) return;
    manifest.theme_color = document.querySelector('meta[name=theme-color]').content;
    const manifest_string = JSON.stringify(manifest);
    const blob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
    document.getElementById('rapyd-app-manifest').setAttribute('href', URL.createObjectURL(blob));
    manifestRegistered = true;
  }

  const f7params = {
    id: 'org.rapyd.client', // App bundle ID
    name: 'App', // App name
    theme: 'md', // Automatic theme detection
    // App routes
    routes: routes(),
    panel: {
      leftBreakpoint: 960,
    },
  };

  return (
    <App params={f7params} colorTheme={(window.tools && window.tools.configuration.color_theme) ? (window.tools && window.tools.configuration.color_theme) : 'gray'}>
      {/* Statusbar */}
      <Statusbar />

      { window.models !== undefined &&
        <Panel left reveal>
          <View url="/panel-left/" />
        </Panel>
      }

      { window.models !== undefined &&
        <Panel right cover>
          <View url="/panel-right/"/>
        </Panel>
      }

      {/* Main View */}
      <View id="main-view" url="/" main className="ios-edges" preloadPreviousPage={false} pushState/>

      {/*
      <Popup id="popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, architecto. Cupiditate laudantium rem nesciunt numquam, ipsam. Voluptates omnis, a inventore atque ratione aliquam. Omnis iusto nemo quos ullam obcaecati, quod.</Block>
          </Page>
        </View>
      </Popup>*/}

      {/* Login Screen */}
      <LoginScreen id="login-screen">
        <View>
          <Page loginScreen>
            <LoginScreenTitle>Login</LoginScreenTitle>
            <List form>
              <ListItem>
                <Label>Username</Label>
                <Input name="username" placeholder="Username" type="text"></Input>
              </ListItem>
              <ListItem>
                <Label>Password</Label>
                <Input name="password" type="password" placeholder="Password"></Input>
              </ListItem>
            </List>
            <List>
              <ListButton title="Sign In" loginScreenClose></ListButton>
              <BlockFooter>
                <p>Click Sign In to close Login Screen</p>
              </BlockFooter>
            </List>
          </Page>
        </View>
      </LoginScreen>
    </App>
  );
}
