import React, { Component } from 'react';
import "../../styles/App/App.css";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NotFound from './NotFound';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import UserList from '../Users/UserList';
import ModuleList from '../Module/ModuleList';

import PipelineList from '../Pipeline/PipelineList';

import { PrivateRoute, OnlyAdminPrivateRoute } from '../PrivateRoute/PrivateRoute';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={`/`} component={Login} />
          <PrivateRoute exact path={`/dashboard`} component={Dashboard} />
          <PrivateRoute exact path={`/modules`} component={ModuleList} />
          <PrivateRoute exact path={`/pipelines`} component={PipelineList} />
          <OnlyAdminPrivateRoute exact path={`/users`} component={UserList} />




          <Route component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

export default App;