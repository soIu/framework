const utils = {};

const context = {};

utils.setCurrentRequest = function (request) {
  context.currentRequest = request;
}

utils.getRequest = () => context.currentRequest;

export default utils;
