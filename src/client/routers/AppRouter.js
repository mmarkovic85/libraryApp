import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import BookDashboardPage from "../components/BookDashboardPage";
import Error404Page from "../components/Error404Page";
import LoginPage from "../components/LoginPage";
import RegistrationPage from "../components/RegistrationPage";

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PublicRoute path="/registration" component={RegistrationPage} />
        <PrivateRoute path="/dashboard" component={BookDashboardPage} />
        <Route component={Error404Page} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
