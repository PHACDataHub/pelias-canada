import csv
import requests
import time
import hashlib
import zipfile
from google.colab import files  # This is needed to run in the Google Colab environment. Remove if necessary

# Function to send request to API endpoint and collect relevant information
def geocode_address(address):
    url = "https://geocoder.alpha.phac.gc.ca/api/v1/search?text=" + address  # Check to see that the URL path has not changed/updated
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
uploaded = files.upload()  # This is in conjunction with the Google Colab module. Allows you to upload your input data locally.

# Get the current epoch time
epoch_start = int(time.time())

# Accuracy ranges
accuracy_ranges = {
    "0 - 0.1": 0,
    "0.1 - 0.3": 0,
    "0.3 - 0.5": 0,
    "0.5 - 0.7": 0,
    "0.7 - 0.9": 0,
    "0.9 - 0.99": 0,
    "1.0": 0
}

# Iterate over uploaded files
for filename in uploaded.keys():
    # Create output filename with epoch timestamp
    output_filename = f"output_geocoder_{epoch_start}.csv"
    metadata_filename = f"metadata_forward_geocoding_{epoch_start}.txt"
    
    # Read addresses from uploaded CSV file and collect information
    with open(filename, newline='', encoding='utf-8-sig') as csvfile:  # Use utf-8-sig to handle BOM
        reader = csv.DictReader(csvfile)
        print(reader.fieldnames)  # Print the header row for debugging
        
        # Open output CSV file
        with open(output_filename, 'w', newline='', encoding='utf-8') as outputfile:
            fieldnames = reader.fieldnames + ['Latitude', 'Longitude', 'Score', 'Match Type', 'Source']
            writer = csv.DictWriter(outputfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for row in reader:
                address = row['PHYSICAL ADDRESS']  # Ensure that your input file has this _EXACT_
                line_id = None
                for key in row.keys():
                    if key.strip() == 'id':  # Check for 'id' key (strip to handle any whitespace)
                        line_id = row[key]
                        break  # Found 'id', no need to continue searching
                if line_id is None:
                    print(f"File: {filename}, Missing 'id' key in row: {row}")
                    continue  # Skip to next row if 'id' is missing

                coordinates, score, match_type, source = geocode_address(address)
                if coordinates:
                    latitude, longitude = coordinates
                    row.update({'Latitude': latitude, 'Longitude': longitude, 'Score': score, 'Match Type': match_type, 'Source': source})
                    writer.writerow(row)
                    
                    # Update accuracy ranges
                    if score <= 0.1:
                        accuracy_ranges["0 - 0.1"] += 1
                    elif score <= 0.3:
                        accuracy_ranges["0.1 - 0.3"] += 1
                    elif score <= 0.5:
                        accuracy_ranges["0.3 - 0.5"] += 1
                    elif score <= 0.7:
                        accuracy_ranges["0.5 - 0.7"] += 1
                    elif score <= 0.9:
                        accuracy_ranges["0.7 - 0.9"] += 1
                    elif score < 1.0:
                        accuracy_ranges["0.9 - 0.99"] += 1
                    else:
                        accuracy_ranges["1.0"] += 1

                    print(f"File: {filename}, Address: {address}, ID: {line_id}, Latitude: {latitude}, Longitude: {longitude}, Score: {score}, Match Type: {match_type}, Source: {source}")
                else:
                    print(f"File: {filename}, Failed to geocode address: {address}")

# Get the epoch time after processing
epoch_end = int(time.time())

# Compute MD5 checksum of the output file
def compute_md5(filename):
    md5_hash = hashlib.md5()
    with open(filename, 'rb') as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            md5_hash.update(byte_block)
    return md5_hash.hexdigest()

checksum_md5 = compute_md5(output_filename)

# Write metadata file
with open(metadata_filename, 'w') as metafile:
    metafile.write(f"Coordinate System: WGS 1984\n")
    metafile.write(f"Epoch Start: {epoch_start}\n")
    metafile.write(f"Epoch End: {epoch_end}\n")
    metafile.write(f"Checksum MD5: {checksum_md5}\n")
    metafile.write("Accuracy Breakdown:\n")
    for range, count in accuracy_ranges.items():
        metafile.write(f"{range}: {count}\n")

# Create a zip file containing the output CSV and metadata file
zip_filename = f"{epoch_start}_forwardgeocoding.zip"
with zipfile.ZipFile(zip_filename, 'w') as zipf:
    zipf.write(output_filename)
    zipf.write(metadata_filename)

# Download the zip file
files.download(zip_filename)
