import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AppContext from "../context/AppContext";

const PublicRoute = ({ component: Component, ...rest }) => {
  const { authToken } = useContext(AppContext);

  return (<Route {...rest} component={
    (props) => (
      authToken ?
        (<Redirect to="/dashboard" />) :
        (<Component {...props} />)
    )
  } />);
};

export default PublicRoute;
