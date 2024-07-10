import  { useState } from 'react';
import { GcdsHeading } from '@cdssnc/gcds-components-react';
import '@cdssnc/gcds-components-react/gcds.css'; // Import the CSS file if necessary
import { copyToClipboard } from '../../assets/copyToClipboard.jsx'; // Adjust the path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RShinyAPIPage() {
  const rCode = `library(httr)
 
# Set the Pelias API endpoint URL
pelias_url <- "https://geocoder.alpha.phac.gc.ca/api/v1/search?text="
 
# Read the quakes dataset
data("USArrests")
USArrests$address <- rownames(USArrests)
# Initialize an empty address column
USArrests$lat <- NA
USArrests$long <- NA
# Iterate over each row in the quakes dataset
for (i in seq_len(nrow(USArrests))) {
  # Get the latitude and longitude for the current row
  address <- USArrests$address[i]
  # Set the search parameters for the Pelias API
  params <- list(text = address)
  # Make the API request
  response <- GET(pelias_url, query = params)
  # Check the response status
  if (response$status_code == 200) {
    # Parse the JSON response
    result <- content(response, as = "parsed")
    # Extract the address from the response
    lat <- result$features[[1]]$geometry$coordinates[2]
    long <- result$features[[1]]$geometry$coordinates[1]
    # Store the address in the quakes dataset
    USArrests$lat[i] <- lat
    USArrests$long[i] <- long
  } else {
    # Handle the error
    USArrests$lat[i] <- NA
    USArrests$long[i] <- NA
    print('error')
  }
}
print(USArrests)`;

// copied must stay for toast to work   
// eslint-disable-next-line no-unused-vars
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(rCode, () => {
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <GcdsHeading tag="h2" marginTop="50">
        R Shiny API
      </GcdsHeading>
      <div style={{ textAlign: "justify", overflow: "auto" }}>
        <p>
          Developing in-house geolocation services within PHAC to improve accuracy, precision, cost-effectiveness, security, and transparency. Phases include tech exploration, prototyping, refining based on user interaction, and expanding coverage. Advantages include enhanced privacy, cost savings, traceability, independence from external resources, flexibility, and modularity. Avoids reliance on third-party services, ensuring data stays within PHAC&#39;s network and reducing costs associated with external queries.
        </p>
        <blockquote style={{ backgroundColor: '#eeeeee', position: 'relative', padding: '20px', borderLeft: '5px solid black' }}>
          <h3>Geocode Example using R</h3>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <button onClick={handleCopy}>Copy code</button>
          </div>
          <pre style={{ marginTop: '40px' }}>
            <code>{rCode}</code>
          </pre>
        </blockquote>
      </div>
      <ToastContainer />
    </>
  );
}
