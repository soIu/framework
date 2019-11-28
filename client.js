/*process.chdir(__dirname);
if (process.execPath.indexOf('.exe') !== -1) {
    process.execPath = 'node';
}*/
var stdout;
if (process.argv[2]) stdout = process.argv[2];
var argv = ['', ''];
argv = argv.concat(['--client']);
process.argv = argv;
eval(require('fs').readFileSync('./server.js').toString());
var code = module.exports;
if (require.main === module) {
    //if (stdout) require('fs').writeFileSync(stdout, code);
    var quarter = Math.ceil(code.length / 4);
    process.stdout.write(code.slice(0, quarter));
    process.stdout.write(code.slice(quarter * 1, quarter * 2));
    process.stdout.write(code.slice(quarter * 2, quarter * 3));
    process.stdout.write(code.slice(quarter * 3, quarter * 4));
}
