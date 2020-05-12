import React from "react";

const Header = () => (
  <header className="header">
    <h1>
      <a href="/">Nineveh</a>
    </h1>

    <div>
      <a href="/login">Login</a>
      <span> / </span>
      <a href="/registration">Sign up</a>
    </div>
  </header>
);

export default Header;
