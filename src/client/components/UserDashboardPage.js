import React, { useContext, useEffect } from "react";

import AppContext from "../context/AppContext";
import BookList from "./BookList";

const UserDashboardPage = () => {
  const { authToken, books, setBooks } = useContext(AppContext);

  // >>> Lifecycle
  const componentWillUnmount = () => { };

  const componentDidMount = () => {
    fetch("/api/books/private", {
      headers: { "Authorization": "Bearer " + authToken }
    }).then(res => res.json())
      .then(books => setBooks(books))
      .catch(e => console.log(e));

    return componentWillUnmount;
  };

  useEffect(componentDidMount, []);
  // <<< Lifecycle

  return (
    <BookList books={books} />
  );
};

export default UserDashboardPage;
