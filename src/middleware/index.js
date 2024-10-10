const server_modules = [];
const client_modules = [];

const __dirname = import.meta.dirname;

const modules_path = require('path').join(__dirname, '../../modules');
const modules = require('fs').readdirSync(modules_path);
for (let module of modules) {
  if (module === 'index.js') continue;
  if (module === 'client.js') continue;
  try {
    const files_path = require('path').join(modules_path, module);
    for (let file of require('fs').readdirSync(files_path)) {
      if (file === '__init__.py') server_modules.push("require('./" + require('path').posix.join(module, file) + "');");
      if (file === '__client__.py') client_modules.push("require('./" + require('path').posix.join(module, file) + "');");
    }
  }
  catch (error) {}
}
require('fs').writeFileSync(require('path').join(modules_path, 'index.js'), server_modules.join('\n'));
require('fs').writeFileSync(require('path').join(modules_path, 'client.js'), client_modules.join('\n'));

const customMiddleware = () => {
  return async (ctx, next) => {
    process.env.solu_middleware_path = ctx.req.headers.referer ? new URL(ctx.req.headers.referer).pathname : '/';
    process.env.solu_middleware_cookie = ctx.req.headers.cookie || '';
    await next();
  };
};

export default customMiddleware;
