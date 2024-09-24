const pglite = new (require('@electric-sql/pglite').PGlite)('./test');
const { parentPort } = require('node:worker_threads');
//parentPort.on('message', (message) => pglite.query(`select pg_sleep(${message}) as sleep_${message}`).then(console.log));
//parentPort.on('message', (message) => pglite.query(`select * from towns limit ${message}`).then(console.log));
//parentPort.on('message', (message) => [unlink('./test/postmaster.pid'), (new (require('@electric-sql/pglite').PGlite)('./test')).query(`select * from towns limit ${message}`).then(console.log)]);
parentPort && parentPort.on('message', (message) => pglite.query(message).then(console.log));
