#!/usr/bin/env node
process.chdir(__dirname);
process.env.CORE = require('os').cpus().filter((cpu) => cpu.speed).length;
if (!process.env.CORE) process.env.CORE = parseInt(child_process.execSync('nproc').toString().trim());
process.env.CORE = (process.env.CORE / 2).toString();

const spawn_promise = require('util').promisify(require('child_process').spawn);
const spawn = (command, args) => spawn_promise(command, args, {env: process.env, stdio: 'inherit'});

async function compile() {
  await Promise.all([spawn('rpython', ['client.py']), spawn('rpython', ['client.py'])]);
}

compile().catch(console.error)
