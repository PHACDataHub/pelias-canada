import { useState } from "react"
import { GcdsHeading } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css" // Import the CSS file if necessary
import { copyToClipboard } from "../../assets/copyToClipboard.jsx" // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function PythonAPIPage() {
	const pythonCode = `import csv
import requests
from google.colab import files
# Function to send request to API endpoint and collect relevant information
def geocode_address(address):
  url = "https://geocoder.alpha.phac.gc.ca/api/search?text=" + address
  response = requests.get(url)
  if response.status_code == 200:
    data = response.json()
    if "features" in data:
      feature = data["features"][0]
      coordinates = feature["geometry"]["coordinates"]
      score = feature["properties"]["confidence"]
      match_type = feature["properties"]["match_type"]
      source = feature["properties"]["source"]
      return coordinates, score, match_type, source
  return None, None, None, None
# Upload CSV files
uploaded = files.upload()
# Iterate over uploaded files
for filename in uploaded.keys():
  # Read addresses from uploaded CSV file and collect information
  with open(filename, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      address = row['address']
      line_id = row['ID']
      coordinates, score, match_type, source = geocode_address(address)
      if coordinates:
        latitude, longitude = coordinates
        print(f"File: {filename}, Address: {address}, ID: {line_id}, Latitude: {latitude}, 
            Longitude: {longitude}, Score: {score}, Match Type: {match_type}, Source: {source}")
      else:
        print(f"File: {filename}, Failed to geocode address: {address}")`

	// coppied has to stay for toastify to work
	// eslint-disable-next-line no-unused-vars
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		copyToClipboard(pythonCode, () => {
			setCopied(true)
			toast.success("Code copied to clipboard!")
			setTimeout(() => setCopied(false), 2000)
		})
	}

	return (
		<>
			<GcdsHeading tag="h2" marginTop="50">
				Python API
			</GcdsHeading>
			<div style={{ textAlign: "justify", overflow: "auto" }}>
				<p>
					Developing in-house geolocation services within PHAC to improve accuracy, precision, cost-effectiveness, security, and transparency. Phases include tech exploration,
					prototyping, refining based on user interaction, and expanding coverage. Advantages include enhanced privacy, cost savings, traceability, independence from external
					resources, flexibility, and modularity. Avoids reliance on third-party services, ensuring data stays within PHAC&#39;s network and reducing costs associated with external
					queries.
				</p>
				<blockquote style={{ backgroundColor: "#eeeeee", position: "relative", padding: "20px", borderLeft: "5px solid black" }}>
					<h3>Geocode Example using Python</h3>
					<div style={{ position: "absolute", top: "10px", right: "10px" }}>
						<button onClick={handleCopy}>Copy code</button>
					</div>
					<pre style={{ marginTop: "40px", overflowWrap: "break-word" }}>
						<code style={{ marginTop: "40px", overflowWrap: "break-word" }}>{pythonCode}</code>
					</pre>
				</blockquote>
			</div>
			<ToastContainer />
		</>
	)
}
