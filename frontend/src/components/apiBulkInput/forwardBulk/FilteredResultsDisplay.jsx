/* eslint-disable react/prop-types */
import { GcdsText } from "@cdssnc/gcds-components-react"

function FilteredResultsDisplay({ filteredResults }) {
  return (
    <div>
      <h3>Filtered Results:</h3>
      <p>{filteredResults.length}</p>
      {filteredResults.map(item => (
        <div key={item.inputID}>
          <GcdsText>{`Input ID: ${item.inputID}, Physical Address: ${item.physicalAddress}`}</GcdsText>
          <p>{`ID: ${item.inputID}, Query: ${item.query}`}</p>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default FilteredResultsDisplay
