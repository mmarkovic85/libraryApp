import React, { useState } from "react";

import { AppContextProvider } from "../context/AppContext";
import AppRouter from "../routers/AppRouter";

const AppStore = () => {
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState({});

  return (
    <AppContextProvider value={{
      authToken,
      setAuthToken,
      user,
      setUser
    }}>
      <AppRouter />
    </AppContextProvider>
  );
};

export default AppStore;
