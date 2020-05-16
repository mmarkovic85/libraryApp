import React, { useState } from "react";

import { AppContextProvider } from "../context/AppContext";
import AppRouter from "../routers/AppRouter";

const AppStore = () => {
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState({});
  const [books, setBooks] = useState([]);

  return (
    <AppContextProvider value={{
      authToken,
      setAuthToken,
      user,
      setUser,
      books,
      setBooks
    }}>
      <AppRouter />
    </AppContextProvider>
  );
};

export default AppStore;
