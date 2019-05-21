process.env.NODE_ENV = 'development';
process.env.NODE_PATH = './src';

const config = require('react-scripts/config/webpack.config.dev');

config.output.publicPath = '';

config.resolve.alias['react'] = require('path').join(__dirname, '../src/react.js');//'preact-compat';
config.resolve.alias['react-dom'] = require('path').join(__dirname, '../src/react-dom.js');//'preact-compat';
config.resolve.alias['pouchdb-promise'] = require('path').join(__dirname, '../node_modules/pouchdb-promise/lib/index.js');

config.module.rules.push({test: /framework7\.min\.css$/, loader: 'string-replace-loader', options: {search: '\#9e9e9e', replace: '#009688', flags: 'g'}});

require('react-scripts/scripts/start');
