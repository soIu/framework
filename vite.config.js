import path from 'node:path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import commonjs from 'vite-plugin-commonjs'

const plugins = [
  'transform-commonjs',
  'python',
  /*["module-resolver", {
    "alias": {
      "^react-native$": "react-native-web"
    }
  }],*/
]

/*const moduleAlias = require("module-alias");
moduleAlias.addAliases({
  "react-native": require.resolve("react-native-web"),
});
moduleAlias();*/

//require('@babel/register')({plugins, ignore: []});

export default defineConfig({
  esbuild: false,
  plugins: [
    react({
      'babel': {
        ignore: [],
        plugins,
      },
    }),
    //commonjs({advanced: {importRules: 'namedFirst'}}),
  ],
  resolve: {
    alias: {'react-native': 'react-native-web', orm: path.resolve(__dirname, './orm/')},
  },
})
