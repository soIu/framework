const { parentPort } = require('node:worker_threads');
const Comlink = require('comlink');
const nodeEndpoint = require('comlink/dist/umd/node-adapter');

let pglite, dbTable;

const worker = {
  init: async (type, path, table) => {
    if (type !== 'pglite') throw new Error('Only PGlite is now supported');
    dbTable = table;
    pglite = worker.pglite = new (require('@electric-sql/pglite').PGlite)(path);
    await pglite.exec(`CREATE TABLE IF NOT EXISTS "${table}" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "data" jsonb);`);
  },
  createIndex: async (field) => {
    if (!dbTable) throw new Error('Database is not initialized yet');
    await pglite.exec(`CREATE INDEX IF NOT EXISTS ${dbTable}_idx_${field} ON ${dbTable} ((data->'${field}'))`);
  },
};

Comlink.expose(worker, nodeEndpoint(parentPort));
