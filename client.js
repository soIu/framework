process.chdir(__dirname);
if (process.execPath.indexOf('.exe') !== -1) {
    process.execPath = 'node';
}
var code = require('child_process').spawnSync(process.execPath, ['server.js', '--clear-cache', '--client'], {env: process.env, maxBuffer: 5000 * 1024}).stdout.toString();
var half = Math.floor(code.length / 2);
process.stdout.write(code.slice(0, half));
process.stdout.write(code.slice(half));
