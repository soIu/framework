import { lazy } from 'react';
import { defineEntries } from 'waku/server';

const App = lazy(() => import('./components/App.js'));

const plugins = [
  'python',
  ["module-resolver", {
    "alias": {
      "^react-native$": "react-native-web"
    }
  }],
]

/*const moduleAlias = require("module-alias");
moduleAlias.addAliases({
  "react-native": require.resolve("react-native-web"),
});
moduleAlias();*/

require('@babel/register')({plugins, ignore: []});

export default defineEntries(
  // renderEntries
  async (input) => {
    return {
      App: <App name={input || 'Waku'} />,
    };
  },
  // getBuildConfig
  async () => [{ pathname: '/', entries: [{ input: '' }] }],
  // getSsrConfig
  () => {
    throw new Error('SSR is should not be used in this test.');
  },
);
