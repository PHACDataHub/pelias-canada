import { useState, useEffect } from "react"
import { GcdsHeading } from "@cdssnc/gcds-components-react"
import Loading from "../../Loading"
import { useTranslation } from "react-i18next"
import ConfidenceTable from "../../tables/ConfidenceTable"
import PaginatedTable from "../../tables/dataTable"
import Mapping from "./map/forwardmap"

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
				const newResults = []
				for (const item of filteredResults) {
					try {
						const response = await fetch(`https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(item.query)}`, {
							method: "GET",
							headers: { "Content-Type": "application/json" },
						})
						const data = await response.json()
						newResults.push({ inputID: item.inputID, result: data })
					} catch (error) {
						console.error(item.query, error)
						newResults.push({ inputID: item.inputID, error: error.message })
						setErrors(prevErrors => [...prevErrors, error.message]) // Add errors to the state
					}
				}
				setApiResults(newResults)
				setLoading(false)
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
			<p>
				{t("components.forwardBulk.resultsTable.validRows")} {filteredResults.length}
			</p>
			{apiResults.length >
				0(
					<>
						<p>
							{t("components.forwardBulk.resultsTable.returnedRows")}: {apiResults.length}
						</p>
						<Mapping apiResults={apiResults} />
						<GcdsHeading tag="h3">{t("components.forwardBulk.resultsTable.confidence.confidenceTableHeader")}</GcdsHeading>
						<ConfidenceTable apiResults={apiResults} />
						<GcdsHeading tag="h3">{t("components.forwardBulk.resultsTable.previewResultsHeader")}</GcdsHeading>
						<PaginatedTable apiResults={apiResults} />
						<br />
					</>
				)}
		</>
	)
}
