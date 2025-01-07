/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
import Loading from "../../Loading"
import { useTranslation } from "react-i18next"
import ConfidenceTable from "../../tables/ConfidenceTable"
import PaginatedTable from "../../tables/dataTable"

function FilteredResultsDisplay({ filteredResults, triggerApiCall }) {
	const [apiResults, setApiResults] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const { t } = useTranslation()

	useEffect(() => {
		if (!triggerApiCall) return // Wait for the trigger

		const fetchApiResults = async () => {
			try {
				setLoading(true)
				setError(null) // Reset error state on new API call

				const results = await Promise.all(
					filteredResults.map(async item => {
						const response = await fetch(`https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(item.query)}`)

						if (!response.ok) {
							throw new Error(`Failed to fetch data for query: ${item.query}`)
						}

						const data = await response.json()
						return { ...item, apiData: data } // Combine original item with API response
					})
				)

				setApiResults(results)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchApiResults()
	}, [filteredResults, triggerApiCall]) // Only run when `triggerApiCall` changes to true

	if (loading) {
		return (
			<div>
				<Loading />
				{t("components.forwardBulk.loading")}
			</div>
		)
	}

	if (error) {
		return <p>{t("components.forwardBulk.error", { message: error })}</p>
	}

	return (
		<div>
			<GcdsHeading tag="h2"> apiResultsTitle </GcdsHeading>
			<p>.rowsSub : {filteredResults.length}</p>
			<p>rowsReturned : {apiResults.length}</p>
			<GcdsHeading tag="h3"> results confidence </GcdsHeading>
			{/* Only render ConfidenceTable if apiResults have been successfully fetched */}
			{apiResults.length > 0 ? (
				<ConfidenceTable data={apiResults} />
			) : (
				<p>noApiResults</p> // Provide fallback message
			)}

			<GcdsHeading tag="h3"> results preview </GcdsHeading>
			{apiResults.length > 0 ? (
				<PaginatedTable apiResults={apiResults} />
			) : (
				<p>noApiResults</p> // Provide fallback message
			)}
		</div>
	)
}

export default FilteredResultsDisplay
