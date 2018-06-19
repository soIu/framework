process.chdir(__dirname)
process.on('uncaughtException', function(error){
    console.error(error);
});
var fs = require('fs');
var conf = "" +
"master_password = yourpassword\n" +
"admin_password = r4pyd\n" +
"default_url = http://localhost\n" +
"port = 8069\n" +
"client_db = local\n" +
"server_db = main\n" +
"server_db_adapter = memory\n" +
"server_db_custom_adapter = False\n" +
"local_app = True\n" +
"serverless = False\n"
try {
    if (fs.existsSync(__dirname + '/app.conf') === false) {
        fs.writeFileSync(__dirname + '/app.conf', conf)
    }
    var modules_list = require('child_process').execSync('cd modules && for module in $(find */modules.pyj); do echo "import $module" | sed "s/.pyj//g" | tr / .; done', {cwd: __dirname}).toString();
    fs.writeFileSync(__dirname + '/modules/modules.pyj', modules_list)
    var controllers_list = require('child_process').execSync('cd modules && for module in $(find */controllers.pyj); do echo "import $module" | sed "s/.pyj//g" | tr / .; done', {cwd: __dirname}).toString();
    fs.writeFileSync(__dirname + '/modules/controllers.pyj', controllers_list)
} catch(error) {
    console.log(error)
}
conf = fs.readFileSync(__dirname + '/app.conf').toString()
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
