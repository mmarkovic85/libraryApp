import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import BookDashboardPage from "../components/BookDashboardPage";
import LoginPage from "../components/LoginPage";

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/" component={LoginPage} exect={true} />
      <Route path="/dashboard" component={BookDashboardPage} />
      <Route conponent={/** TODO Page404 */} />
    </Switch>
  </Router>
);

export default AppRouter;
