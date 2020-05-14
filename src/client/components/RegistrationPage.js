import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import AppContext from "../context/AppContext"
import RegistrationForm from "./RegistrationForm";

const RegistrationPage = () => {
  const { setAuthToken, setUser } = useContext(AppContext);

  const handleRegistration = ({ user, token }) => {
    setUser(user);
    setAuthToken(token);
  };

  return (
    <div>
      <RegistrationForm handleRegistration={handleRegistration} />
      <Link to="/login">
        <button>Sign in</button>
      </Link>
    </div>
  );
};

export default RegistrationPage;
