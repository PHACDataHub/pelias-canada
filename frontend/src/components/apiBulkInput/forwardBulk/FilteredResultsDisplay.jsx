/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { GcdsHeading } from "@cdssnc/gcds-components-react"
import Loading from "../../Loading"
import { useTranslation } from "react-i18next"
import ConfidenceTable from "../../tables/ConfidenceTable"
import PaginatedTable from "../../tables/dataTable"

export default function FilteredResultsDisplay({ filteredResults, triggerApiCall }) {
	const [apiResults, setApiResults] = useState([])
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState([])
	const { t } = useTranslation()

	useEffect(() => {
		// Only trigger the API call if filteredResults is not empty
		if (filteredResults && filteredResults.length > 0) {
			setLoading(true) // Start loading
			setErrors([]) // Clear previous errors

			// Create a new array to store the results
			const results = []

			// Define the async function to fetch data
			const fetchData = async () => {
				for (const item of filteredResults) {
					try {
						const response = await fetch(`https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(item.query)}`, {
							method: "GET",
							headers: { "Content-Type": "application/json" },
						})
						const data = await response.json()
						results.push({ inputID: item.inputID, result: data })
					} catch (error) {
						console.error("API request failed for:", item.query, error)
						results.push({ inputID: item.inputID, error: error.message })
					}
				}
				setApiResults(results) // Set all the results at once
				setLoading(false) // Stop loading
			}

			// Call the async function to fetch data
			fetchData()
		}
	}, [filteredResults]) // Trigger API call whenever filteredResults changes

	return (
		<>
			{loading && <Loading />} {/* Show loading component if fetching */}
			{errors.length > 0 && (
				<div className="error">
					{errors.map((error, index) => (
						<p key={index}>{error}</p>
					))}
				</div>
			)}
			<p>Input count: {filteredResults.length}</p>
			{apiResults.length > 0 && (
				<>
					<p>Results returned: {apiResults.length}</p>

					{/* Render the API results if there are any */}
					{/* {apiResults.length > 0 && <pre>{JSON.stringify(apiResults, null, 2)}</pre>} */}

					<GcdsHeading tag="h3">{t("components.forwardBulk.resultsTable.confidence.confidenceTableHeader")}</GcdsHeading>
					{apiResults.length > 0 ? <ConfidenceTable apiResults={apiResults} /> : <p>{t("components.forwardBulk.resultsTable.noResults")}</p>}
					<GcdsHeading tag="h3">Results Preview</GcdsHeading>
					{apiResults.length > 0 ? <PaginatedTable apiResults={apiResults} /> : <p>{t("components.forwardBulk.resultsTable.noResults")}</p>}
				</>
			)}
		</>
	)
}
