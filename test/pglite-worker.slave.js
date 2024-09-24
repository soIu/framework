const orig_opendir = require('fs').opendirSync.bind(require('fs'));
const orig_open = require('fs').openSync.bind(require('fs'));
const orig_read = require('fs').readFileSync.bind(require('fs'));
const orig_write = require('fs').writeFileSync.bind(require('fs'));
const replacement = require('path').join(require('os').tmpdir(), require('crypto').randomUUID() + '.pid');
//const replacement = require('path').join(require('path').resolve('./test/'), require('crypto').randomUUID() + '.pid');
if (require('fs').existsSync(require('path').resolve('./test/postmaster.pid'))) {
  require('fs').copyFileSync(require('path').resolve('./test/postmaster.pid'), replacement);
}
require('fs').openSync = (...args) => {
  const [file] = args;
  if (file === require('path').resolve('./test/postmaster.pid')) {
    args[0] = replacement;
    const result = orig_open(...args);
    return result
  }
  const result = orig_open(...args);
  return result
}
require('fs').readFileSync = (...args) => {
  const [file] = args;
  if (file === require('path').resolve('./test/postmaster.pid')) {
    args[0] = replacement;
  }
  const result = orig_read(...args);
  return result
}
require('fs').writeFileSync = (...args) => {
  const [file] = args;
  if (file === require('path').resolve('./test/postmaster.pid')) {
    args[0] = replacement;
  }
  const result = orig_write(...args);
  return result
}

const pglite = new (require('@electric-sql/pglite').PGlite)('./test');

const { parentPort } = require('node:worker_threads');
//parentPort.on('message', (message) => pglite.query(`select pg_sleep(${message}) as sleep_${message}`).then(console.log));
//parentPort.on('message', (message) => pglite.query(`select * from towns limit ${message}`).then(console.log));
//parentPort.on('message', (message) => [unlink('./test/postmaster.pid'), (new (require('@electric-sql/pglite').PGlite)('./test')).query(`select * from towns limit ${message}`).then(console.log)]);
parentPort && parentPort.on('message', (message) => pglite.query(message).then(console.log));
