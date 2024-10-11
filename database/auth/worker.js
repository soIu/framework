const { parentPort } = require('node:worker_threads');
const Comlink = require('comlink');
const nodeEndpoint = require('comlink/dist/umd/node-adapter');

let pglite, dbTable;

const worker = {
  init: async (type, path, table) => {
    if (type !== 'pglite') throw new Error('Only PGlite is now supported');
    dbTable = table;
    pglite = worker.pglite = new (require('@electric-sql/pglite').PGlite)(path);
    await pglite.exec(`CREATE TABLE IF NOT EXISTS "res_users_auth" ("login" text PRIMARY KEY NOT NULL, "password" text)`);
  }
};

Comlink.expose(worker, nodeEndpoint(parentPort));
