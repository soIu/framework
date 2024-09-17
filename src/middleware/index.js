import utils from '../utils';

const customMiddleware = () => {
  return async (ctx, next) => {
    utils.setCurrentRequest(ctx.req);
    await next();
  };
};

export default customMiddleware;
