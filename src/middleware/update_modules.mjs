import path from 'node:path';
import fs from 'node:fs';

const server_modules = [];
const client_modules = [];

const __dirname = import.meta.dirname;

const modules_path = path.join(__dirname, '../../modules');
const modules = fs.readdirSync(modules_path);
for (let module of modules) {
  if (module === 'index.js') continue;
  if (module === 'client.js') continue;
  try {
    const files_path = path.join(modules_path, module);
    for (let file of fs.readdirSync(files_path)) {
      if (file === '__init__.py') server_modules.push("require('./" + path.posix.join(module, file) + "');");
      if (file === '__client__.py') client_modules.push("require('./" + path.posix.join(module, file) + "');");
    }
  }
  catch (error) {}
}
fs.writeFileSync(path.join(modules_path, 'index.js'), server_modules.join('\n'));
fs.writeFileSync(path.join(modules_path, 'client.js'), client_modules.join('\n'));