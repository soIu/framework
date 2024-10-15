import React from 'react';

const utils = {};

utils.useCache = function useCache(value) {
  //Cache a value in a component
  return React.useState(value)[0];
}

export default utils;
