import React from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    Row,
    Col,
    Button
} from 'framework7-react';
import LoginPage from './LoginPage';
import TreePage from './TreePage';
import FormPage from './FormPage';
import CustomPage from './CustomPage';
//import api from 'api';

export default function (props) {

  if (window.models === undefined) {
    return (<LoginPage/>);
  }
  else if (window.tools.configuration.home_view) {
    const mode = window.tools.configuration.home_view.split('.').slice(-1)[0];
    const model = window.tools.configuration.home_view.split('.').slice(0, -1).join('.');
    window.models.env.context.active_mode = mode;
    window.models.env.context.active_model = model;
    if (mode === 'tree') {
      return (<TreePage/>);
    }
    else if (mode === 'form') {
      return (<FormPage/>);
    }
    else if (mode !== 'chat') return (<CustomPage/>);
  }

  return (
  <Page>
    <Navbar>
      <NavLeft>
        <Link iconMd="material:menu" panelOpen="left"></Link>
      </NavLeft>
      <NavTitle>Home</NavTitle>
      <NavRight>
        <Link iconMd="material:person" panelOpen="right"></Link>
      </NavRight>
    </Navbar>
    <Toolbar>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>
    <Block strong>
      <p>Here is your blank Framework7 app. Let's see what we have here.</p>
    </Block>
    <BlockTitle>Navigation</BlockTitle>
    <List>
      <ListItem link="/about/" title="About"></ListItem>
      <ListItem link="/form/" title="Form"></ListItem>
    </List>
    <BlockTitle>Modals</BlockTitle>
    <Block strong>
      <Row>
        <Col width="50">
          <Button fill raised popupOpen="#popup">Popup</Button>
        </Col>
        <Col width="50">
          <Button fill raised loginScreenOpen="#login-screen">Login Screen</Button>
        </Col>
      </Row>
    </Block>
    <BlockTitle>Panels</BlockTitle>
    <Block strong>
      <Row>
        <Col width="50">
          <Button fill raised panelOpen="left">Left Panel</Button>
        </Col>
        <Col width="50">
          <Button fill raised panelOpen="right">Right Panel</Button>
        </Col>
      </Row>
    </Block>
    <List>
      <ListItem link="/dynamic-route/blog/45/post/125/?foo=bar#about" title="Dynamic Route"></ListItem>
      <ListItem link="/load-something-that-doesnt-exist/" title="Default Route (404)"></ListItem>
    </List>
  </Page>
  );
}
