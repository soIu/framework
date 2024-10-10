import path from 'node:path';
import fs from 'node:fs';
import { Worker } from "worker_threads";

import * as Comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/esm/node-adapter.mjs';

const __dirname = import.meta.dirname;

export function createLocalWorker(table) {
  if (!(fs.existsSync(path.join(__dirname, './data/')))) fs.mkdirSync(path.join(__dirname, './data/'));
  const worker = Comlink.wrap(nodeEndpoint(new Worker(path.join(__dirname, './worker.js'))))
  worker.init('pglite', path.join(__dirname, './data/' + table), table);
  return worker;
};
