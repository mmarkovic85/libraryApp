import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/" component={/** TODO Login */} exect={true} />
      <Route path="/dashboard" component={/** TODO Dashboard */} />
      <Route conponent={/** TODO Page404 */} />
    </Switch>
  </Router>
);

export default AppRouter;
