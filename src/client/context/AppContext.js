import React from "react";

const AppContext = React.createContext();

const AppContextProvider = (props) => (
  <AppContext.Provider
    value={props.value}
    children={props.children}
  />
);

export {
  AppContext as default,
  AppContextProvider
};
