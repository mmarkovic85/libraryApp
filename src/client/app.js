
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";

import AppStore from "./store/AppStore";

render(<AppStore />, document.getElementById("app"));
