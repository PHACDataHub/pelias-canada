import React from "react"
import ReactDOM from "react-dom/client" // Correct import
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./i18n"
import { I18nextProvider } from "react-i18next"
import "./index.css"
import "@cdssnc/gcds-components-react/gcds.css"

ReactDOM.createRoot(document.getElementById("react-root")).render(
	<React.StrictMode>
		<I18nextProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</I18nextProvider>
	</React.StrictMode>
)
