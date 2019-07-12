import React from 'react';
import api from 'api';
import { Page, Navbar, NavLeft, Block, Button, BlockTitle, List, ListItem, Icon, Toolbar, Link, Tabs, Tab } from 'framework7-react';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'name': ''};
  }

  async componentDidMount(props) {
    api.globals.app = this.$f7;
    if (api.globals.app.device.ios) document.body.style.height = 'calc(100% + 20px)';
    window.tools.navigate = api.globals.app.views.main.router.navigate.bind(api.globals.app.views.main.router);
    window.tools.dialog = api.globals.app.dialog;
    this.setState({'name': await window.models.env.user.browse(window.models.env.user.id.toString()).then((record) => record.name)});
  }

  render = (props) => (
    <Page>
      <Navbar>
        <NavLeft className="user-link">
          <List>
            <ListItem link="#" title={this.state.name}>
              <Icon material="person"></Icon>
            </ListItem>
          </List>
        </NavLeft>
      </Navbar>
      <Toolbar tabbar>
        <Link tabLink="#notification" tabLinkActive>Notifications</Link>
        {/*<Link tabLink="#message">Messages</Link>*/}
      </Toolbar>
      <Tabs>
        <Tab id="notification" className="page-content" tabActive style={{paddingTop: '0px'}}>
          <List mediaList style={{marginTop: '0px'}}>
            <ListItem link="#" title="Notification Title" after="17:20" text="Notification Text"/>
          </List>
          <Button fill onClick={api.logout} style={{display: 'inline-block', margin: '10px'}}>Logout</Button>
        </Tab>
        {/*<Tab id="message" className="page-content">
          <Block>
            <p>Tab 2 content</p>
            ...
          </Block>
        </Tab>*/}
      </Tabs>
      {/*<Block strong>
        <p>Right panel content goes here</p>
      </Block>
      <BlockTitle>Load page in panel</BlockTitle>
      <List>
        <ListItem link="/about/" title="About"></ListItem>
        <ListItem link="/form/" title="Form"></ListItem>
      </List>
      <BlockTitle>Load page in main view</BlockTitle>
      <List>
        <ListItem link="/about/" title="About" view="#main-view" panelClose></ListItem>
        <ListItem link="/form/" title="Form" view="#main-view" panelClose></ListItem>
      </List>*/}
    </Page>
  )
}
