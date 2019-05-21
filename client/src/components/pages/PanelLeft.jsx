import React from 'react';
import {Page, Navbar, Link} from 'framework7-react';

import api from 'api';

let hide = false;

function hidePanel() {
  api.locals.app.params.panel.leftBreakpoint = hide ? 768 : 1000000;
  api.locals.app.panel.left.initBreakpoints();
  hide = !hide;
}

export default () => (
  <Page>
    <Navbar title="Menu"/>
    <div id="menu" className="list list-block media-list chevron-center inset" style={{fontWeight: 500}} panelClose>
      {window.tools.keys(window.tools.menu, 'sequence').as_array().map((menu, index) => (
      <ul>
        <li className="accordion-item">
          <a className={'item-link item-content' + (window.tools.menu[menu].childs.length < 1 ? ' panel-close' : '')} href={window.tools.menu[menu].childs.length < 1 && '/' + (window.tools.menu[menu].view_id ? 'view' : 'tree') + '/' + (window.tools.menu[menu].view_id || window.tools.menu[menu].model)} data-view="#main-view">
            <div className="item-inner">
              <div className="item-title">{window.tools.menu[menu].string}</div>
            </div>
          </a>
          {window.tools.menu[menu].childs.as_array().map((child_menu, index) => (
          <div className="accordion-item-content">
            <a className="item-content panel-close" href={'/' + (child_menu.view_id ? 'view' : 'tree') + '/' + (child_menu.view_id || child_menu.model)} data-view="#main-view">
              <div className="item-inner">
                <div className="item-title">{child_menu.string}</div>
              </div>
            </a>
          </div>))}
        </li>
      </ul>))}
    </div>
    <Link iconMd="material:more_horiz" iconSize="30" onClick={hidePanel} style={{display: 'inline-block', margin: '10px'}}/>
  </Page>
);
