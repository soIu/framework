import React from 'react';
import * as cookie from 'cookie';

const utils = {};

const checkSession = React.cache((cookies) => {
  const session = cookie.parse(cookies);
});

//This helper function should be called inside a Server Component
utils.getComponentEndpoint = () => process.env.solu_middleware_path;
utils.isAuthenticated = () => checkSession(process.env.solu_middleware_cookie);

export default utils;
