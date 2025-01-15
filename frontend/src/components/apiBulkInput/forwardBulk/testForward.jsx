import { useRef, useState, useCallback } from "react"
import "leaflet/dist/leaflet.css"
import { GcdsButton, GcdsHeading } from "@cdssnc/gcds-components-react"
import GovTestForwardUploading from "./GcdsTestForward"
import ForwardCallAPIReturn from "./ForwardCallAPIReturn"
import FilteredResultsDisplay from "./FilteredResultsDisplay"
import PaginatedTable from "../../tables/dataTable"
import Mapping from "./forwardmap"

export default function ForwardBulk() {
	const [inputtedData, setInputtedData] = useState([])
	const [filteredResults, setFilteredResults] = useState([])
	const [continueStatus, setContinueStatus] = useState(false)
	const childRef = useRef(null)

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
      <GcdsHeading tag="h1">IntakeForwardFile </GcdsHeading>
			<p>
				Make sure the column to transform is called <strong>inputID</strong>, and there is a column named <strong>physicalAddress</strong>.
			</p>

      <p>
				More Instructions .
			</p>

			{!continueStatus && (
				<>
					<GovTestForwardUploading ref={childRef} setResults={setInputtedData} />
					{inputtedData.length > 0 && (
						<>
							<GcdsButton onClick={handleReset}>Reset</GcdsButton>
							<hr />
							<ForwardCallAPIReturn results={inputtedData} sendFilteredResults={handleFilteredResults} />
							<GcdsButton onClick={handleButtonClick}>Continue</GcdsButton>
						</>
					)}
					<br />
				</>
			)}
			<br />
			{continueStatus && (
				<>
					<GcdsButton onClick={handleReset}>Reset</GcdsButton>
					<p>
						<strong>Status:</strong> Continue action triggered successfully.
					</p>
				</>
			)}
      
			{filteredResults.length > 0 && continueStatus && (
				<FilteredResultsDisplay
					filteredResults={filteredResults}
					triggerApiCall={continueStatus} // Pass trigger flag
				/>
			)}
<br></br>
			<Mapping />
		</>
	)
}
