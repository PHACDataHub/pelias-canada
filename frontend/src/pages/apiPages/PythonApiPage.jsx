import { useState } from "react"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css" // Import the CSS file if necessary
import { copyToClipboard } from "../../assets/copyToClipboard.jsx" // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"

export default function PythonAPIPage() {
	const pythonCodeForward = `
import csv
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
        print(f"File: {filename}, Failed to geocode address: {address}")
    `

	const pythonCodeReverse = `
import pandas as pd
import requests
from urllib.parse import urlencode
import io  # Import io module for BytesIO handling
from google.colab import files

# Function to fetch reverse geocoding data
def reverse_geocode(lat, lon):
    base_url = "https://geocoder.alpha.phac.gc.ca/api/v1/reverse?"
    params = {
        "point.lat": lat,
        "point.lon": lon
    }
    url = base_url + urlencode(params)
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Function to prioritize and rank features
def prioritize_features(features):
    if not features:
        return None
    
    # Sort features by confidence (descending), then by distance (ascending)
    sorted_features = sorted(features, key=lambda x: (-x['properties']['confidence'], x['properties']['distance']))
    top_feature = sorted_features[0]  # Select the top ranked feature
    
    # Extract relevant properties
    properties = top_feature['properties']
    coordinates = top_feature['geometry']['coordinates']
    
    result = {
        'coordinates': coordinates,
        'name': properties.get('name', ''),
        'housenumber': properties.get('housenumber', ''),
        'street': properties.get('street', ''),
        'confidence': properties.get('confidence', ''),
        'distance': properties.get('distance', ''),
        'accuracy': properties.get('accuracy', ''),
        'country': properties.get('country', ''),
        'region': properties.get('region', ''),
        'region_a': properties.get('region_a', ''),
        'county': properties.get('county', ''),
        'county_gid': properties.get('county_gid', ''),
        'locality': properties.get('locality', ''),
        'neighbourhood': properties.get('neighbourhood', ''),
        'label': properties.get('label', '')
    }
    return result

# Function to process input CSV and generate output CSV
def process_csv(input_file, output_file):
    df = pd.read_csv(io.BytesIO(uploaded[input_file]))
    results = []
    
    for index, row in df.iterrows():
        if pd.notna(row['ddLat']) and pd.notna(row['ddLong']):
            lat = float(row['ddLat'])
            lon = float(row['ddLong'])
            geocoding_data = reverse_geocode(lat, lon)
            
            if geocoding_data:
                features = geocoding_data.get('features', [])
                result = prioritize_features(features)
                
                if result:
                    result['inputID'] = row['inputID']  # Assuming 'inputID' is the primary key in input CSV
                    results.append(result)
    
    # Create output DataFrame and save to CSV
    output_df = pd.DataFrame(results)
    output_df.to_csv(output_file, index=False)

# Upload the input CSV file
print("Upload the input CSV file:")
uploaded = files.upload()

# Assuming the uploaded file name is 'testRgeo.csv'
input_csv = next(iter(uploaded))

# Prompt user to enter the name of the output CSV file (without extension)
print("Please enter the name of the output CSV file (without extension):")
output_file_name = input().strip()  # Ensure no leading/trailing spaces

# Ensure output path is within /content directory
output_dir = '/content'
output_csv = f"{output_dir}/{output_file_name}.csv"

# Process the CSV file
process_csv(input_csv, output_csv)

print(f"Output CSV file saved as {output_csv}")
    `
	// copied has to stay for toastify to work
	// eslint-disable-next-line no-unused-vars
	const [copied, setCopied] = useState(false)

	const handleCopyPythonCodeForward = () => {
		copyToClipboard(pythonCodeForward, () => {
			setCopied(true)
			toast.success("Code copied to clipboard!")
			setTimeout(() => setCopied(false), 1000)
		})
	}
	const handleCopyPythonCodeReverse = () => {
		copyToClipboard(pythonCodeReverse, () => {
			setCopied(true)
			toast.success("Code copied to clipboard!")
			setTimeout(() => setCopied(false), 1000)
		})
	}

	const commonStyles = {
		flex: 1,
		backgroundColor: "#eeeeee",
		position: "relative",
		padding: "20px",
		borderLeft: "5px solid black",
	}

	const codeBlockStyles = {
		marginTop: "40px",
		overflowWrap: "break-word",
		overflowX: "auto",
	}
	const { t } = useTranslation()
	return (
		<>
			<h1>{t("pages.python.title")}</h1>
			<div style={{ textAlign: "justify", overflow: "auto" }}>
				<p>{t("pages.python.pythonParagraph")}</p>
			</div>
			<div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
				<blockquote style={commonStyles}>
					<h2>{t("pages.python.forwardPythoncode")}</h2>
					<div style={{ position: "absolute", top: "10px", right: "10px" }}>
						<GcdsButton size="small" onClick={handleCopyPythonCodeForward} aria-label="Copy Address Geocoding Python code to clipboard">
							{t("copyCode")}
						</GcdsButton>
					</div>
					<pre style={codeBlockStyles}>
						<code style={codeBlockStyles} aria-label="Address Geocoding Python Code">
							{pythonCodeForward}
						</code>
					</pre>
				</blockquote>
				<blockquote style={commonStyles}>
					<h2>{t("pages.python.reversePythonCode")}</h2>
					<div style={{ position: "absolute", top: "10px", right: "10px" }}>
						<GcdsButton size="small" onClick={handleCopyPythonCodeReverse} aria-label="Copy Reverse Geocoding Python code to clipboard">
							{t("copyCode")}
						</GcdsButton>
					</div>
					<pre style={codeBlockStyles}>
						<code style={codeBlockStyles} aria-label="Reverse Geocoding Python Code">
							{pythonCodeReverse}
						</code>
					</pre>
				</blockquote>
			</div>

			<ToastContainer />
		</>
	)
}
