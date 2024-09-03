import { createPages } from 'waku';

import { RootLayout } from './templates/root-layout.js';
import { HomePage } from './templates/home-page.js';
import { AboutPage } from './templates/about-page.js';

export default createPages(async ({ createPage, createLayout }) => {
  /*createLayout({
    render: 'dynamic',
    path: '/',
    component: RootLayout,
  });*/

  createPage({
    render: 'dynamic',
    path: '/',
    component: HomePage,
  });

  createPage({
    render: 'dynamic',
    path: '/about',
    component: AboutPage,
  });
});
