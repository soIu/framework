require('./update_modules.mjs');

const customMiddleware = () => {
  return async (ctx, next) => {
    process.env.solu_middleware_path = ctx.req.headers.referer ? new URL(ctx.req.headers.referer).pathname : '/';
    process.env.solu_middleware_cookie = ctx.req.headers.cookie || '';
    await next();
  };
};

export default customMiddleware;
