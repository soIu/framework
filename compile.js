#!/usr/bin/env node
process.chdir(__dirname);

const is_building = process.argv.indexOf('--build') !== -1;
if (is_building) process.env.SOLU_ENV = 'building';

const use_wasm = process.argv.indexOf('--wasm') !== -1 ? ['server.py', 'client.py'] : (process.argv.indexOf('--wasm=server') !== -1 ? ['server.py'] : (process.argv.indexOf('--wasm=client') !== -1 ? ['client.py'] : []));

const onexit_callbacks = [];

const sleep = (duration) => new Promise(resolve => setTimeout(() => resolve(), duration));
const spawn_promise = require('util').promisify(require('child_process').spawn);
const spawn = async (command, args) => {
  const does_use_wasm = use_wasm.indexOf(args[0]) !== -1;
  if (does_use_wasm) args.push('--wasm');
  else onexit_callbacks.push(function () {
    if (!does_use_wasm) require('fs').closeSync(require('fs').openSync({'server.py': './server.wasm', 'client.py': './client.wasm'}[args[0]], 'w'));
    if (args[0] !== 'client.py') return;
    try {
      require('fs').writeFileSync('./client.js', require('uglify-js').minify(require('fs').readFileSync('./client.js').toString(), {compress: false, mangle: true}).code.toString());
    }
    catch (error) {
      console.error(error);
    }
  });
  const result = await spawn_promise(command, args, {env: process.env, stdio: 'inherit'});
  /*const now = Date.now()
  while (now === Date.now()) {
    true;
  }*/
  return result
}

const default_configuration =
`port = 8069
server_url = False
server_db = 'main'
server_db_adapter = 'memory'
server_db_custom_adapter = False
client_db = 'local'
appbar_color = '#875A7B'
theme_color = '#009688'
`;

function create_configuration() {
  require('fs').writeFileSync('./configuration.py', default_configuration);
}

const server = ['server.py'].concat(process.argv.slice(2));
const client = ['client.py'].concat(process.argv.slice(2));

async function compile() {
  if (!require('fs').existsSync('./configuration.py')) create_configuration();
  if (process.argv.indexOf('--server') !== -1) return spawn('rpython', server);
  if (process.argv.indexOf('--client') !== -1) return spawn('rpython', client);
  process.env.CORE = require('os').cpus().filter((cpu) => cpu.speed).length;
  if (!process.env.CORE) process.env.CORE = parseInt(child_process.execSync('nproc').toString().trim());
  process.env.CORE = Math.floor(process.env.CORE / 2).toString();
  const server_promise = spawn('rpython', server);
  await sleep(1000);
  await Promise.all([server_promise, spawn('rpython', client)]);
}

let does_throws = false;

compile().catch((error) => console.error(does_throws = error));

process.on('exit', () => onexit_callbacks.map(callback => callback()) && !does_throws && is_building && require('child_process').execSync('cp -r server.js server.wasm client.js client.wasm global.js utils build/'));
