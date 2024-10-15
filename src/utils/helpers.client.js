import React from 'react';

const utils = {};

utils.useCache = function useCache(originalValue, modifiers) {
  //Cache a value in a component
  const [value, setValue] = React.useState(originalValue);
  if (!modifiers) return value;
  React.useEffect(() => {
    if (typeof originalValue === 'function') setValue(originalValue());
    return () => {};
  }, modifiers);
  return value;
}

export default utils;
