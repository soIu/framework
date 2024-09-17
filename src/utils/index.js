const utils = typeof window !== 'undefined' ? (await import('./helpers.client.js')).default : (await import('./helpers.server.js')).default;

export default utils;
