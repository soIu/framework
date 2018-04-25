process.chdir(__dirname)
process.on('uncaughtException', function(error){
    console.error(error);
});
var conf = require('fs').readFileSync(__dirname + '/app.conf').toString()
if (conf !== '') {
    conf = conf.split(' =').join('=').split('= ').join('=').split('=').join('":"').split('\n').join('","');
    conf = '{"' + conf.slice(0, -2) + '}';
    conf = JSON.parse(conf);
    process.env = Object.assign(process.env, conf);
}
var command;
var pipe;
if (process.argv.indexOf('--serverless') === -1 && require.main === module) {
    command = process.execPath + ' ./node_modules/.bin/rapydscript -p modules/ -x server.pyj';
    pipe = 'inherit'
} else {
    command = process.execPath + ' ./node_modules/.bin/rapydscript -p modules/ server.pyj'
    pipe = 'pipe'
    process.env.serverless = true
}
if (process.argv.indexOf('--clear-cache') !== -1) {
    command = 'rm -f */*.pyj-cached && ' + command;
}
result = require('child_process').execSync(command, {cwd: __dirname, stdio: pipe, env: process.env});
if (process.argv.indexOf('--serverless') !== -1 | require.main !== module) {
    if (process.argv.indexOf('--print-file') !== -1) {
       console.log(result.toString())
       process.exit()
    }
    eval(result.toString())
}
