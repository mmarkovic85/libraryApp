import React, { useState } from "react";

import AppContextProvider from "../context/AppContext";
import AppRouter from "../routers/AppRouter";

const AppStore = () => {
  const [message, setMessage] = useState("");

  return (
    <AppContextProvider value={{
      message,
      setMessage
    }}>
      <AppRouter />
    </AppContextProvider>
  );
};

export default AppStore;
