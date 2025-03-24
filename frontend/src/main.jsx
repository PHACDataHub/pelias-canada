import React from "react";
import ReactDOM from "react-dom/client"; // Correct import
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import i18n from "./i18n"; // Import your i18n configuration
import { I18nextProvider } from "react-i18next";
import "./index.css";
import "@cdssnc/gcds-components-react/gcds.css";

i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
});

ReactDOM.createRoot(document.getElementById("react-root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>,
);
