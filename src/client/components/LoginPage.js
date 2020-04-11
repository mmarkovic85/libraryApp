import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      e.target.username.value,
      e.target.password.value
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Login:</legend>
          <input type="text" name="username" placeholder="username or e-mail" />
          <br />
          <input type="password" name="password" placeholder="password" />
          <br />
          <button type="submit">Sign in</button>
        </fieldset>
      </form>
      <Link to="/registration">
        <button>Sign up</button>
      </Link>
    </div>
  );
};

export default LoginPage;
