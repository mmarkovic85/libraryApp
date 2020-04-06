
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";

import Placeholder from "./components/Placeholder";

render(<Placeholder />, document.getElementById("app"));
