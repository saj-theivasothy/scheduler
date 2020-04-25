import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "index.scss";
import Application from "components/Application";

if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
} else {
  axios.defaults.baseURL = "http://localhost:8001";
}

ReactDOM.render(<Application />, document.getElementById("root"));
