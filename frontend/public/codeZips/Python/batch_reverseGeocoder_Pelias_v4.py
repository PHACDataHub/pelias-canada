import pandas as pd
import requests
from urllib.parse import urlencode
import io
from google.colab import files
import time
import csv

# Function to fetch reverse geocoding data with validation and maximum distance
def reverse_geocode(lat, lon, max_distance_km=2.5):
    if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        print(f"Invalid latitude ({lat}) or longitude ({lon}). Skipping.")
        return None
    
    base_url = "https://geocoder.alpha.phac.gc.ca/api/v1/reverse?"
    params = {
        "point.lat": lat,
        "point.lon": lon,
        "maxDistance": max_distance_km * 1000  # Convert km to meters
    }
    url = base_url + urlencode(params)
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Failed to fetch geocoding data: {e}")
        return None

# Function to prioritize and rank features
def prioritize_features(features):
    if not features:
        return None
    
    sorted_features = sorted(features, key=lambda x: (-x['properties']['confidence'], x['properties']['distance']))
    top_feature = sorted_features[0]
    
    properties = top_feature['properties']
    coordinates = top_feature['geometry']['coordinates']
    
    result = {
        'ddLat': str(coordinates[1]),
        'ddLong': str(coordinates[0]),
        'name': properties.get('name', ''),
        'housenumber': properties.get('housenumber', ''),
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

def calculate_match_rate(confirmed_count, submitted_count):
    return (confirmed_count / submitted_count * 100) if submitted_count > 0 else 0.0

def classify_accuracy(confidence):
    if confidence >= 1.0:
        return '100%'
    elif 0.8 <= confidence < 1.0:
        return '80%-99.999%'
    elif 0.5 <= confidence < 0.8:
        return '50%-79.999%'
    elif 0.1 <= confidence < 0.5:
        return '0.1%-49.999%'
    else:
        return 'No Match'

# Add function to calculate total confidence levels
def calculate_total_confidence(features):
    confidence_data = {'0.0-0.5': 0.0, '0.5-0.8': 0.0, '0.8-0.95': 0.0, '1.0': 0.0}
    for feature in features:
        confidence = float(feature['properties'].get('confidence', 0))
        if confidence >= 1.0:
            confidence_data['1.0'] += 1
        elif 0.8 <= confidence < 1.0:
            confidence_data['0.8-0.95'] += 1
        elif 0.5 <= confidence < 0.8:
            confidence_data['0.5-0.8'] += 1
        elif 0.0 <= confidence < 0.5:
            confidence_data['0.0-0.5'] += 1
    return confidence_data

def process_csv(input_file, output_file):
    df = pd.read_csv(io.BytesIO(uploaded[input_file]))
    results = []
    total_confidence = {'0.0-0.5': 0.0, '0.5-0.8': 0.0, '0.8-0.95': 0.0, '1.0': 0.0}
    confirmed_count = 0
    submitted_count = len(df)
    match_accuracy = {'100%': 0, '80%-99.999%': 0, '50%-79.999%': 0, '0.1%-49.999%': 0, 'No Match': 0}
    
    for index, row in df.iterrows():
        if pd.notna(row['ddLat']) and pd.notna(row['ddLong']):
            lat = float(row['ddLat'])
            lon = float(row['ddLong'])
            
            if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
                print(f"Invalid latitude ({lat}) or longitude ({lon}) in row {index + 1}. Skipping.")
                continue
            
            geocoding_data = reverse_geocode(lat, lon, max_distance_km)
            
            if geocoding_data:
                features = geocoding_data.get('features', [])
                result = prioritize_features(features)
                
                if result:
                    result['RowNumber'] = str(index + 1)
                    results.append(result)
                    
                    # Update total confidence levels and confirmed count
                    confidence_data = calculate_total_confidence(features)
                    for key, value in confidence_data.items():
                        total_confidence[key] += value
                    
                    if float(result['confidence']) >= 1.0:
                        confirmed_count += 1
                    
                    accuracy_label = classify_accuracy(float(result['confidence']))
                    match_accuracy[accuracy_label] += 1
    
    match_rate = calculate_match_rate(confirmed_count, submitted_count)
    
    output_df = pd.DataFrame(results)
    output_df.to_csv(output_file, index=False)
    
    epoch_time = int(time.time())
    metadata_file = output_file.replace('.csv', '_meta.csv')
    with open(metadata_file, 'w', newline='') as metafile:
        writer = csv.writer(metafile)
        writer.writerow(['Metadata Information'])
        writer.writerow(['Epoch Time', epoch_time])
        writer.writerow(['Match Rate', f'{confirmed_count}/{submitted_count} ({match_rate}%)'])
        writer.writerow(['Total Requests', submitted_count])
        writer.writerow(['100% Match', match_accuracy['100%']])
        writer.writerow(['80%-99.999% Match', match_accuracy['80%-99.999%']])
        writer.writerow(['50%-79.999% Match', match_accuracy['50%-79.999%']])
        writer.writerow(['0.1%-49.999% Match', match_accuracy['0.1%-49.999%']])
        writer.writerow(['No Match', match_accuracy['No Match']])
        writer.writerow(['Coordinate System', 'WGS 1984'])
        writer.writerow(['Maximum Search Distance (km)', max_distance_km])
    
    output_csv = f"/content/{output_file_name}_{epoch_time}.csv"
    output_df.to_csv(output_csv, index=False)
    
    print(f"Output CSV file saved as {output_csv}")
    print(f"Metadata file saved as {metadata_file}")

print("Upload the input CSV file:")
uploaded = files.upload()

input_csv = next(iter(uploaded))

print("Please enter the name of the output CSV file (without extension):")
output_file_name = input().strip()

output_dir = '/content'
max_distance_km = 2.5

process_csv(input_csv, output_file_name)
