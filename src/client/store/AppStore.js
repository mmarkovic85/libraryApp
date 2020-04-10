import React, { useState } from "react";

import AppContextProvider from "../context/AppContext";
import AppRouter from "../routers/AppRouter";

const AppStore = () => {
  const [authToken, setAuthToken] = useState("");

  return (
    <AppContextProvider value={{
      authToken,
      setAuthToken
    }}>
      <AppRouter />
    </AppContextProvider>
  );
};

export default AppStore;
