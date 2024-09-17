/** @type {import('waku/config').Config} */
export default {
  middleware: () => [
    import('./src/middleware/index.js'),
    import('waku/middleware/dev-server'),
    import('waku/middleware/rsc'),
    import('waku/middleware/fallback'),
  ],
};
