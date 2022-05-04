import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//create private route for users
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('user_session')
      && (
        localStorage.getItem('user_role') === 'admin' 
        ||localStorage.getItem('user_role') ===  'guest'
      )
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )}
  />
);

/* check user role, and give access only to users with admin permissions */
export const OnlyAdminPrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('user_session')
      && localStorage.getItem('user_role') === 'admin'
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )}
  />
);
