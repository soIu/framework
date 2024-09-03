import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const plugins = [
  ["module-resolver", {
    "alias": {
      "^react-native$": "react-native-web"
    }
  }],
]

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
  ],
  resolve: {
    alias: {'react-native': 'react-native-web'},
  },
})
