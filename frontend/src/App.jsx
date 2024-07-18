import { Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import BulkInput from "./pages/bulkInput/BulkInput"
import LandingPage from "./pages/landingPage/Landingpage"
import RShinyAPIPage from "./pages/apiPages/RShinyAPIPage"
import PythonAPIPage from "./pages/apiPages/PythonApiPage"
import FAQ from "./pages/FAQ/FAQ"
import GeocodingExplanation from "./pages/GeocodingExplanation"

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* Render LandingPage component for both index and "/home" routes */}
				<Route index element={<LandingPage />} />
				<Route path="home" element={<LandingPage />} />
				{/* Render BulkInput component for the "/bulkinput" route */}
				<Route path="forward-bulk-files" element={<BulkInput />} />
				<Route path="r-shiny-api" element={<RShinyAPIPage />} />
				<Route path="python-api" element={<PythonAPIPage />} />
				<Route path="frequently-asked-questions" element={<FAQ />} />
				<Route path="geocoding-explanation" element={<GeocodingExplanation />} />
			</Route>
		</Routes>
	)
}

export default App
