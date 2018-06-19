var command = 'node ./node_modules/.bin/rapydscript -p modules/ client.pyj';
if (process.argv[2] === '--clear-cache') {
    command = 'rm -f */*.pyj-cached && ' + command;
}
var client = require('child_process').execSync(command).toString();
var conf = require('fs').readFileSync(__dirname + '/app.conf').toString();
if (conf !== '') {
    conf = conf.split(' =').join('=').split('= ').join('=').split('=').join('":"').split('\n').join('","');
    conf = '{"' + conf.slice(0, -2) + '}';
    client = client.replace('{"home_view": window.localStorage.rapyd_home_view || "res.message.chat"}', conf)
    conf = JSON.parse(conf);
    client = client.replace('http:\/\/localhost:8069', conf.default_url + ':' + conf.port)
    client = client.replace("PouchDB('main')", "PouchDB('"+conf.client_db+"')")
    client = client.replace("admin_password = 'r4pyd'", "admin_password = '"+conf.admin_password+"'")
}
console.log(client);
