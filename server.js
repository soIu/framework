process.chdir(__dirname);
process.on('uncaughtException', function(error) {
    if (process.argv.indexOf('--debug') !== -1) return;
    console.error(error.stack);
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
    fs.writeFileSync(__dirname + '/modules/modules.pyj', modules_list);
    fs.writeFileSync(__dirname + '/modules/controllers.pyj', controllers_list);
    if (fs.existsSync(__dirname + '/app.conf') === false) {
        fs.writeFileSync(__dirname + '/app.conf', conf);
    }
} catch(error) {
    console.log(error);
}
conf = fs.readFileSync(__dirname + '/app.conf').toString();
if (conf !== '') {
    conf = conf.split(' =').join('=').split('= ').join('=').split('=').join('":"').split('\n').join('","');
    conf = '{"' + conf.slice(0, -2) + '}';
    conf = JSON.parse(conf);
    process.env = Object.assign(process.env, conf);
}
var argv = ['', ''];
argv = argv.concat(['-p', 'modules/', '-x', 'server.pyj']);
var command = process.execPath + ' node_modules/rapydscript-ng/bin/rapydscript -p modules/';
if (process.env.custom_modules !== undefined && process.env.custom_modules !== false) {
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
if (process.argv.indexOf('--print-file') !== -1 || process.argv.indexOf('--serverless') !== -1 || require.main !== module) {
    command += ' server.pyj'
    pipe = 'pipe';
    process.env.serverless = true;
} else {
    command += ' -x server.pyj';
    pipe = 'inherit';
}
if (process.argv.indexOf('--clear-cache') !== -1) {
    var clear_command = 'find . -name "*.pyj-cached" -type f -delete';
    child_process.execSync(clear_command, {cwd: __dirname, stdio: pipe, env: process.env});
}
if (process.argv.indexOf('--debug') !== -1) {
    if (process.execArgv.indexOf('--experimental-vm-modules') !== -1) {
        var vm = require('vm');
        var global_module = module;
        var runInNewContext = vm.runInNewContext;
        vm.runInNewContext = function () {
            var args = Array.prototype.slice.call(arguments);
            if (args[2] && args[2] !== 'server.pyj') return runInNewContext.apply(vm, arguments);
            if (typeof args[2] === 'string') args[2] = {filename: args[2]};
            var options = args[2];
            options.context = vm.createContext(args[1] || global);
            var module = new vm.SourceTextModule(args[0], options);
            module.link(function () {}).then(function () {
                module.instantiate();
                return module.evaluate()
            }).catch(function (error) {
                if (module.status === 'errored' && error.stack.indexOf('vm:module(0)') !== -1) {
                    var line_end = parseInt(error.stack.split('\n')[1].split('vm:module(0):')[1].split(':')[0]);
                    var line_start = line_end - 15;
                    codes = args[0].split(/\n/);
                    line_end += 10;
                    var code = codes.slice(line_start, line_end).join('\n');
                    console.error(error);
                    console.error("\nCorresponding error lines:\n\n" + code + '\n\n');
                }
                else {
                    console.error(error);
                }
            });
        }
    }
    else {
        var args = ['--experimental-vm-modules', module.filename].concat(process.argv.slice(2));
        child_process.spawnSync(process.execPath, args, {stdio:'inherit'})/*.on('exit', function(code, signal) {
            process.exit(code);
        });*/
        process.exit();
    }
}
if (process.argv.indexOf('--print-file') !== -1 || process.argv.indexOf('--serverless') !== -1 || require.main !== module) {
    result = child_process.execSync(command, {cwd: __dirname, stdio: pipe, env: process.env});
    if (process.argv.indexOf('--print-file') !== -1) {
       console.log(result.toString());
       process.exit();
    }
    eval('var ρσ_module_doc__\n' + result.toString());
}
else {
    process.argv = argv;
    require('rapydscript-ng/bin/rapydscript');
}
