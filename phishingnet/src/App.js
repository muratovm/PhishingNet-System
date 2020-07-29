import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './table/grid/Dashboard.jsx';
import Login from './table/authentication/Login.jsx';
import Signup from './table/authentication/Signup.jsx';

const App = () => (
  <div className="app-routes">
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signup" component={Signup} />
        <Route path="/" component={Login} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;