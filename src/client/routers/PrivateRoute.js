import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AppContext from "../context/AppContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authToken } = useContext(AppContext);

  return (<Route {...rest} component={
    (props) => (
      authToken ?
        (<Component {...props} />) :
        (<Redirect to="/login" />)
    )
  } />);
};

export default PrivateRoute;
