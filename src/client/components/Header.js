import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AppContext from "../context/AppContext"

const Header = () => {
  const { authToken, setAuthToken } = useContext(AppContext);

  const handleLogout = (e) => {
    const { name } = e.target;
    let url;

    switch (name) {
      case "logout":
        url = "/api/users/logout"
        break;
      case "logoutall":
        url = "/api/users/logoutall"
        break;
    };

    fetch(url, {
      method: "POST",
      headers: { "Authorization": "Bearer " + authToken }
    }).then(res => res.status == "200" && setAuthToken(""))
      .catch(e => console.log(e.message))
  };

  return (
    <header className="header">
      <h1>
        <Link to="/">Nineveh</Link>
      </h1>
      {
        authToken ?
          <div>
            <button
              name="logout"
              onClick={handleLogout}
            >Logout</button>

            <span> / </span>

            <button
              name="logoutall"
              onClick={handleLogout}
            >Logout All</button>
          </div> :
          <div>
            <Link to="/login">
              <button>Login</button>
            </Link>

            <span> / </span>

            <Link to="/registration">
              <button>Sign Up</button>
            </Link>
          </div>
      }
    </header>
  );
};

export default Header;
