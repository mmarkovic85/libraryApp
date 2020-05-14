import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AppContext from "../context/AppContext"
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const { setAuthToken, setUser } = useContext(AppContext);

  const handleLogin = ({ user, token }) => {
    setUser(user);
    setAuthToken(token);
  };

  return (
    <div>
      <LoginForm handleLogin={handleLogin} />
      <Link to="/registration">
        <button>Sign up</button>
      </Link>
    </div>
  );
};

export default LoginPage;
