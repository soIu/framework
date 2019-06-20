import React from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavRight,
    Link,
} from 'framework7-react';

export default (props) => (
  <Page>
    <Navbar backLink={window.models.env.context.active_url === '/' ? false : 'Back'}>
      {window.models.env.context.active_url === '/' &&
      <NavLeft>
        <Link iconMd="material:menu" panelOpen="left"></Link>
      </NavLeft>}
      <NavTitle>{props.title}</NavTitle>
      <NavRight>
        <Link iconMd="material:person" panelOpen="right"></Link>
      </NavRight>
    </Navbar>
    {props.children}
  </Page>
);
