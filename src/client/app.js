
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";
import "normalize-css/normalize.css";

import AppStore from "./store/AppStore";
import "./styles/styles.scss";

render(<AppStore />, document.getElementById("app"));
