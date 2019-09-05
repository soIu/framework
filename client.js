process.chdir(__dirname);
if (process.execPath.indexOf('.exe') !== -1) {
    process.execPath = 'node';
}
var code = require('child_process').spawnSync(process.execPath, ['server.js', '--clear-cache', '--client'], {env: process.env, maxBuffer: 5000 * 1024}).stdout.toString();
var quarter = Math.ceil(code.length / 4);
process.stdout.write(code.slice(0, quarter));
process.stdout.write(code.slice(quarter * 1, quarter * 2));
process.stdout.write(code.slice(quarter * 2, quarter * 3));
process.stdout.write(code.slice(quarter * 3, quarter * 4));
