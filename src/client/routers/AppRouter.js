import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import BookDashboardPage from "../components/BookDashboardPage";
import Error404Page from "../components/Error404Page";
import LoginPage from "../components/LoginPage";

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/" component={LoginPage} exect={true} />
      <Route path="/dashboard" component={BookDashboardPage} />
      <Route component={Error404Page} />
    </Switch>
  </Router>
);

export default AppRouter;
