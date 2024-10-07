const utils = typeof window !== 'undefined' ? (await import('./helpers.client.js')).default : (await import('./helpers.server.js')).default;

let appTitle = 'App';

utils.setTitle = function (title) {
  appTitle = title;
}

utils.getTitle = () => appTitle;

export default utils;
