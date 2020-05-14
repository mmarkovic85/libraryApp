import React, { useState } from "react";

const RegistrationForm = ({ handleRegistration }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password1":
        setPassword1(value);
        break;
      case "password2":
        setPassword2(value);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    password1 !== password2 ?
      setError("User validation failed: password: Password fields must match") :
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password: password1 })
      }).then(res => res.json())
        .then(({ user = {}, token = "", error = "" }) => {
          error ?
            setError(error) || setLoading(false) :
            handleRegistration({ user, token });
        })
        .catch(e => setError(e.message));
  };

  return loading ?
    (<p>loading...</p>) :
    (
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <fieldset>
          <legend>Create account:</legend>

          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="username"
          /><br />

          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="e-mail address"
          /><br />

          <input
            type="password"
            name="password1"
            value={password1}
            onChange={handleChange}
            placeholder="password"
          /><br />

          <input
            type="password"
            name="password2"
            value={password2}
            onChange={handleChange}
            placeholder="confirm password"
          /><br />

          <button type="submit">Sign up</button>
        </fieldset>
      </form>
    );
};

export default RegistrationForm;
