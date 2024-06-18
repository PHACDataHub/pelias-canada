import Layout from '../../layout/layout'
import {
GcdsHeading,

} from '@cdssnc/gcds-components-react'
import '@cdssnc/gcds-components-react/gcds.css' // Import the CSS file if necessary
import './styles.css'

const rCode = `library(httr)
# Read the quakes dataset
data("USArrests")
USArrests$address <- rownames(USArrests)
# Initialize an empty address column
USArrests$lat <- NA
USArrests$long <- NA
# Iterate over each row in the quakes dataset
for (i in seq_len(nrow(USArrests))) {
  response <- GET("https://geocoder.alpha.phac.gc.ca/api/v1/search", query = list(text = USArrests$address[i]))
  # Check the response status
  if (response$status_code == 200) {# Parse the JSON response
    result <- content(response, as = "parsed")
    # Extract the address from the response
    lat <- result$features[[1]]$geometry$coordinates[2]
    long <- result$features[[1]]$geometry$coordinates[1]
    # Store the address in the quakes dataset
    USArrests$lat[i] <- lat
    USArrests$long[i] <- long} else { # Handle the error
    USArrests$lat[i] <- NA
    USArrests$long[i] <- NA  } }
print(USArrests)`

export default function LandingPage() {
  return (
    <Layout>
      <GcdsHeading tag="h2" >Welcome to geocoder</GcdsHeading>
      <div style={{textAlign:"justify"}}>
        <p> Developing in-house geolocation services within PHAC to improve accuracy, precision, cost-effectiveness, security, and transparency. Phases include tech exploration, prototyping, refining based on user interaction, and expanding coverage. Advantages include enhanced privacy, cost savings, traceability, independence from external resources, flexibility, and modularity. Avoids reliance on third-party services, ensuring data stays within PHAC's network and reducing costs associated with external queries.</p>
      </div>
     <h2>Geocode Example using R</h2>
    <pre> <code> {rCode} </code></pre>
    </Layout>
  )
}
