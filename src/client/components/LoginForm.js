import React, { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then(res => res.json())
      .then(({ user = {}, token = "", error = "" }) => {
        error ?
          setError(error) || setLoading(false) :
          handleLogin({ user, token });
      })
      .catch(e => setError(e.message));
  };

  return loading ?
    (<p>loading...</p>) :
    (
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <fieldset>
          <legend>Login:</legend>

          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="e-mail address"
          /><br />

          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="password"
          /><br />

          <button type="submit">Sign in</button>
        </fieldset>
      </form>
    );
};

export default LoginForm;
