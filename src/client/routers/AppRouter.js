import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PublicRoute from "./PublicRoute";
import BookDashboardPage from "../components/BookDashboardPage";
import Error404Page from "../components/Error404Page";
import LoginPage from "../components/LoginPage";

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <Route path="/dashboard" component={BookDashboardPage} />
        <Route component={Error404Page} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
