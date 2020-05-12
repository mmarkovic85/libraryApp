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
import Footer from "../components/Footer";
import Header from "../components/Header";
import HomePage from "../components/HomePage";
import LoginPage from "../components/LoginPage";
import RegistrationPage from "../components/RegistrationPage";

const AppRouter = () => (
  <Router>
    <div>
      <Header />

      <Switch>
        <Route path="/" component={HomePage} exact={true} />
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/registration" component={RegistrationPage} />
        <PrivateRoute path="/dashboard" component={UserDashboardPage} />
        <Route component={Error404Page} />
      </Switch>

      <Footer />
    </div>
  </Router>
);

export default AppRouter;
