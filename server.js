var command = 'node ./node_modules/.bin/rapydscript -p modules/ -x server.pyj';
var conf = require('fs').readFileSync(__dirname + '/app.conf').toString()
if (conf !== '') {
    command = conf.split(' ').join('').split('\n').join(' ') + ' ' + command
}
if (process.argv[2] === '--clear-cache') {
    command = 'rm -f */*.pyj-cached && ' + command;
}
require('child_process').execSync(command, {stdio:[0, 1, 2]});
