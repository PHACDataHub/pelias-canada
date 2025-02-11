import { useRef, useState, useCallback } from "react"
import "leaflet/dist/leaflet.css"
import { GcdsButton, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
import IntakeForwardFile from "./ForwardBulkInputFile"
import ForwardCallAPIReturn from "./ForwardCallAPIReturn"
import FilteredResultsDisplay from "./FilteredResultsDisplay"
import { useTranslation } from "react-i18next"

export default function ForwardBulk() {
	const [inputtedData, setInputtedData] = useState([])
	const [filteredResults, setFilteredResults] = useState([])
	const [continueStatus, setContinueStatus] = useState(false)
	const childRef = useRef(null)
	const { t } = useTranslation()

	const handleReset = () => {
		setInputtedData([])
		setFilteredResults([])
		setContinueStatus(false)
		if (childRef.current) {
			childRef.current.reset()
		}
	}

	const handleButtonClick = () => {
		setContinueStatus(true)
	}

	const handleFilteredResults = useCallback(filteredData => {
		setFilteredResults(filteredData)
	}, [])

	return (
		<>
			{/* <p>{t("components.forwardBulk.inputUpload.title")} </p> */}

			{!continueStatus && (
				<>
					{/* This is the input component for the function. This handles the csv upload */}
					<IntakeForwardFile ref={childRef} setResults={setInputtedData} />
					{/* This is the data cleaning function. This handles the uploaded csvand makes sure it is formatted correctly */}
					{inputtedData.length > 0 && (
						<>
							<GcdsButton onClick={handleReset}>{t("components.forwardBulk.inputUpload.reset")}</GcdsButton>
							<hr />
							<ForwardCallAPIReturn results={inputtedData} sendFilteredResults={handleFilteredResults} />
							<GcdsText characterLimit="false">{t("components.forwardBulk.inputUpload.continuePara")} </GcdsText>
							<GcdsButton onClick={handleButtonClick}>{t("components.forwardBulk.inputUpload.continue")}</GcdsButton>
						</>
					)}
					<br />
					{continueStatus && (
						<>
							<GcdsButton onClick={handleReset}>{t("components.forwardBulk.inputUpload.reset")}</GcdsButton>
						</>
					)}
				</>
			)}
			<br />

			{/* This is the API call and display results function. This takes the cleaned data and calls the api. Once processed the tables and the map are displayed */}
			{filteredResults.length > 0 && continueStatus && (
				<FilteredResultsDisplay
					filteredResults={filteredResults}
					triggerApiCall={continueStatus} // Pass trigger flag
				/>
			)}
		</>
	)
}
