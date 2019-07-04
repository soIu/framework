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

//import api from 'api';

export default function (props) {

  // Framework7 parameters here
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
