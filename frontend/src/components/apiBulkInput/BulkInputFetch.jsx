import { useState } from "react"
import FileUploadComponent from "./FileUploadComponent"
import FileProcessorComponent from "./FileProcessorComponent"
import { GcdsButton } from "@cdssnc/gcds-components-react"

const BulkInputFetch = () => {
	const [jsonData, setJsonData] = useState([])

	const handleJsonDataLoaded = data => {
		setJsonData(data)
	}

	const handleReset = () => {
		location.reload() // Stop all API calls and/or Reset jsonData to an empty array 
	}

	return (
		<div>
			{jsonData == "" ? (
				<>
					<FileUploadComponent onJsonDataLoaded={handleJsonDataLoaded} />
				</>
			) : (
				<div>

					<GcdsButton size="small" onClick={handleReset}>RESET</GcdsButton>
					<br/> 
					<FileProcessorComponent jsonData={jsonData} />
				</div>
			)}
		</div>
	)
}

export default BulkInputFetch
