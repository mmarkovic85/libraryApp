import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import UserDashboardPage from "../components/UserDashboardPage";
import Error404Page from "../components/Error404Page";
import HomePage from "../components/HomePage";
import LoginPage from "../components/LoginPage";
import RegistrationPage from "../components/RegistrationPage";

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/" component={HomePage} exact={true} />
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/registration" component={RegistrationPage} />
        <PrivateRoute path="/dashboard" component={UserDashboardPage} />
        <Route component={Error404Page} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
