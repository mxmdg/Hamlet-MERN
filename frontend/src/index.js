import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import TimeAgo from "javascript-time-ago";

//import en from 'javascript-time-ago/locale/en.json'
import es from "javascript-time-ago/locale/es.json";

//styles
import "./Styles/hamlet.css";
import "./index.css";

//TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(es);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
