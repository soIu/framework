import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import TreePage from './components/pages/TreePage';
import FormPage from './components/pages/FormPage';
import CustomPage from './components/pages/CustomPage';
import NotFound from './components/pages/NotFound';
import PanelLeft from './components/pages/PanelLeft';
import PanelRight from './components/pages/PanelRight';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/panel-left/',
    component: PanelLeft,
  },
  {
    path: '/panel-right/',
    component: PanelRight,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/tree/:model',
    component: TreePage,
  },
  {
    path: '/form/:model',
    component: FormPage,
  },
  {
    path: '/view/:view_id',
    component: CustomPage,
  },
  {
    path: '(.*)',
    component: NotFound,
  },
];
