import React from "react";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      e.target.username.value,
      e.target.email.value,
      e.target.password.value
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Create account:</legend>
          <input type="text" name="username" placeholder="username" />
          <br />
          <input type="email" name="email" placeholder="e-mail" />
          <br />
          <input type="password" name="password" placeholder="password" />
          <br />
          <button type="submit">Sign up</button>
        </fieldset>
      </form>
      <Link to="/login">
        <button>Sign in</button>
      </Link>
    </div>
  );
};

export default RegistrationPage;
