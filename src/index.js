import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:5000";
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
