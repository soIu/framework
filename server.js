process.chdir(__dirname)
process.on('uncaughtException', function(error){
    console.error(error);
});
var child_process = require('child_process');
if (process.execPath.indexOf('.exe') !== -1) {
    process.execPath = 'node';
}
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
var modules_list = '';
var controllerst_list = '';
try {
    modules_list = child_process.execSync('cd modules && find * -maxdepth 1 -mindepth 1 | grep modules.pyj | grep -v .pyj-cached | tr / . | sed "s/.pyj//g" | sed "s/^/import /"', {cwd: __dirname}).toString();
    controllers_list = child_process.execSync('cd modules && find * -maxdepth 1 -mindepth 1 | grep controllers.pyj | grep -v .pyj-cached | tr / . | sed "s/.pyj//g" | sed "s/^/import /"', {cwd: __dirname}).toString();
    fs.writeFileSync(__dirname + '/modules/modules.pyj', modules_list)
    fs.writeFileSync(__dirname + '/modules/controllers.pyj', controllers_list)
    if (fs.existsSync(__dirname + '/app.conf') === false) {
        fs.writeFileSync(__dirname + '/app.conf', conf)
    }
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
//process.env.RAPYDSCRIPT_IMPORT_PATH = 'modules/';
var command = process.execPath + ' node_modules/rapydscript-ng/bin/rapydscript -p modules/';
if (process.env.custom_modules !== undefined && process.env.custom_modules !== false) {
    //command += ':' + process.env.custom_modules + '/';
    process.env.RAPYDSCRIPT_IMPORT_PATH = process.env.custom_modules;
    try {
        if (fs.existsSync(process.env.custom_modules + '/__init__.pyj') === false) {
            fs.writeFileSync(process.env.custom_modules + '/__init__.pyj', '');
        }
        modules_list += child_process.execSync('cd ' + process.env.custom_modules + ' && find * -maxdepth 1 -mindepth 1 | grep modules.pyj | grep -v .pyj-cached | tr / . | sed "s/.pyj//g" | sed "s/^/import /"', {cwd: __dirname}).toString();
        controllers_list += child_process.execSync('cd ' + process.env.custom_modules + ' && find * -maxdepth 1 -mindepth 1 | grep controllers.pyj | grep -v .pyj-cached | tr / . | sed "s/.pyj//g" | sed "s/^/import /"', {cwd: __dirname}).toString();
        fs.writeFileSync(__dirname + '/modules/modules.pyj', modules_list);
        fs.writeFileSync(__dirname + '/modules/controllers.pyj', controllers_list);
    } catch(error) {
        console.log(error);
    }
}
var pipe;
if (process.argv.indexOf('--serverless') === -1 && require.main === module) {
    command += ' -x server.pyj';
    pipe = 'inherit'
} else {
    command += ' server.pyj'
    pipe = 'pipe'
    process.env.serverless = true
}
if (process.argv.indexOf('--clear-cache') !== -1) {
    command = 'rm -f */*.pyj-cached && ' + command;
}
result = child_process.execSync(command, {cwd: __dirname, stdio: pipe, env: process.env});
if (process.argv.indexOf('--serverless') !== -1 | require.main !== module) {
    if (process.argv.indexOf('--print-file') !== -1) {
       console.log(result.toString())
       process.exit()
    }
    eval(result.toString())
}
