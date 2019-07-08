import React from 'react';
import {Page, Navbar, Button, Link} from 'framework7-react';

import api from 'api';

let hide = false;

function hidePanel() {
  api.globals.app.params.panel.leftBreakpoint = hide ? 768 : 1000000;
  api.globals.app.panel.left.initBreakpoints();
  hide = !hide;
}

export default () => (
  <Page>
    <Navbar title="Menu"/>
    <div id="menu" className="list list-block media-list chevron-center inset" style={{fontWeight: 500}} panelClose>
      {window.tools.keys(window.tools.menu, 'sequence').as_array().map((menu, index) => (
      <ul>
        <li className="accordion-item">
          <a className={'item-link item-content' + (window.tools.menu[menu].childs.length < 1 ? ' panel-close external' : '')} onClick={window.tools.menu[menu].childs.length < 1 && ((event) => event.preventDefault() || api.globals.app.panel.left.close() === {} || Object.assign(window.models.env.context, window.tools.menu[menu].context) === {} || api.globals.app.views.main.router.navigate(event.currentTarget.href.split('#!')[1]))} href={window.tools.menu[menu].childs.length < 1 && '#!/' + (window.tools.menu[menu].view_id ? 'view' : 'tree') + '/' + (window.tools.menu[menu].view_id || window.tools.menu[menu].model)} data-view="#main-view">
            <div className="item-inner">
              <div className="item-title">{window.tools.menu[menu].string}</div>
            </div>
          </a>
          {window.tools.menu[menu].childs.as_array().map((child_menu, index) => (
          <div className="accordion-item-content">
            <a className="item-content panel-close external" onClick={(event) => event.preventDefault() || api.globals.app.panel.left.close() === {} || Object.assign(window.models.env.context, child_menu.context) === {} || api.globals.app.views.main.router.navigate(event.currentTarget.href.split('#!')[1])} href={'#!/' + (child_menu.view_id ? 'view' : 'tree') + '/' + (child_menu.view_id || child_menu.model)} data-view="#main-view">
              <div className="item-inner">
                <div className="item-title">{child_menu.string}</div>
              </div>
            </a>
          </div>))}
        </li>
      </ul>))}
    </div>
    <Button fill id="pwa_install_button" onClick={async () => api.globals.InstallPromp.prompt() || (await api.globals.InstallPromp.userChoice === 'accepted') && (document.getElementById('pwa_install_button').display = 'none')} style={{display: api.globals.InstallPrompt ? 'inline-block' : 'none', margin: '10px'}}>Install</Button>
    <Link iconMd="material:more_horiz" iconSize="30" onClick={hidePanel} style={{display: 'inline-block', margin: '10px'}}/>
  </Page>
);
