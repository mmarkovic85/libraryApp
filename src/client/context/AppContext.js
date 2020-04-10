import React from "react";

const AppContext = React.createContext();

const AppContextProvider = (props) => (
  <AppContext.Provider
    value={props.value}
    children={props.children}
  />
);

export {
  AppContextProvider as default,
  AppContext
};
