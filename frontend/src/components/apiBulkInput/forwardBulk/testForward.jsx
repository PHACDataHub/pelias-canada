import { useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import GovTestForwardUploading from "./GcdsTestForward"
import ForwardCallAPIReturn from "./ForwardCallAPIReturn"
import FilteredResultsDisplay from "./FilteredResultsDisplay" // Import the new component

export default function ForwardBulk() {
  const [inputtedData, setInputtedData] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [continueStatus, setContinueStatus] = useState(false)
  const childRef = useRef(null) // Create a ref for child component

  const handleReset = () => {
    setInputtedData([]) // Clear the data
    setFilteredResults([])
    setContinueStatus(false) // Reset continue status
    if (childRef.current) {
      childRef.current.reset() // Call the reset function in the child
    }
  }

  const handleButtonClick = () => {
    setContinueStatus(true)
  }
  const handleFilteredResults = filteredData => {
    setFilteredResults(filteredData)
  }

  return (
    <>
      <h2>IntakeForwardFile</h2>
      <p>
        Make sure the column to transform is called <strong>inputID</strong>, and there is a column named <strong>physicalAddress</strong>.
      </p>

      {!continueStatus && (
        <>
          <GovTestForwardUploading
            ref={childRef}
            setResults={setInputtedData}
          />
          {inputtedData.length > 0 && (
            <>
              <GcdsButton onClick={handleReset}>Reset</GcdsButton>
              <hr />
              <ForwardCallAPIReturn results={inputtedData} 
                sendFilteredResults={handleFilteredResults} // Pass the function here
              />
              <GcdsButton onClick={handleButtonClick}>Continue</GcdsButton>
            </>
          )}
          <br />
        </>
      )}
      <br />
      {/* Displaying Continue Status */}
      {continueStatus && (
        <>
          <GcdsButton onClick={handleReset}>Reset</GcdsButton>
          <p>
            <strong>Status:</strong> Continue action triggered successfully.
          </p>
        </>
      )}
      {/* Display filtered results using the new component */}
      {filteredResults.length > 0 && continueStatus && (
        <FilteredResultsDisplay filteredResults={filteredResults} />
      )}
    </>
  )
}
