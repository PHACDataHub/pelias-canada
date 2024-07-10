
const GeocodingExplanation = () => {
  return (
    <div className="geocoding-explanation">
      <h1>Geocoding-Explanation </h1>
      <section aria-labelledby="match-types">
        <h2 id="match-types">Understanding Match Types in Pelias</h2>
        <p>When Pelias returns geocoding results, it uses different types of matches to determine the accuracy of the location.</p>
        <h3>Match Types</h3>
        <ul>
          <li>
            <strong>Exact/Rooftop Matches</strong>: These matches are very accurate and pinpoint the exact location of an address.
          </li>
          <li>
            <strong>Centroid Matches</strong>: These matches place the address at the center of a larger area, like a city or postal code region.
          </li>
          <li>
            <strong>Interpolation Matches</strong>: These matches estimate the address location based on nearby known addresses or along road segments.
          </li>
        </ul>
      </section>

      <section aria-labelledby="improving-accuracy">
        <h2 id="improving-accuracy">Improving Geocoding Accuracy</h2>
        <p>To improve the accuracy of geocoding results, follow these steps:</p>
        <ol>
          <li>
            <strong>Verify Address Format:</strong> Ensure the address is in a standardized format.
          </li>
          <li>
            <strong>Check Spelling and Abbreviations:</strong> Correct spelling errors and standardize abbreviations.
          </li>
          <li>
            <strong>Include Relevant Details:</strong> Provide complete address details like unit numbers and building names.
          </li>
          <li>
            <strong>Split Civic Addresses into Components:</strong> Break down addresses into street number, street name, city, province, etc.
          </li>
          <li>
            <strong>Consider Bilingual Requirements:</strong> Handle bilingual addresses and special characters correctly.
          </li>
          <li>
            <strong>Convert Provinces/Territories to Standard Digraphs:</strong> Use two-letter codes for provinces and territories.
          </li>
          <li>
            <strong>Remove Special Characters:</strong> Clean data by removing non-alphanumeric characters.
          </li>
          <li>
            <strong>Standardize Capitalization:</strong> Ensure consistent capitalization.
          </li>
          <li>
            <strong>Account for Address Variations:</strong> Handle different address formats consistently.
          </li>
        </ol>
      </section>

      <section aria-labelledby="less-accurate-matches">
        <h2 id="less-accurate-matches">Implications of Less Accurate Matches</h2>
        <p>Less accurate matches, like centroid or interpolation matches, can impact spatial accuracy and limit the reliability of spatial analyses.</p>
        <ul>
          <li>
            <strong>Spatial Accuracy:</strong> Matches that are not exact may place addresses at centroids or interpolate along road segments, potentially misrepresenting spatial contexts.
          </li>
          <li>
            <strong>Limitations to Spatial Analyses:</strong> Inaccurate geocoding matches can introduce errors in studies such as demographic analysis or emergency response planning.
          </li>
        </ul>
      </section>

      <section aria-labelledby="geocoding-results">
        <h2 id="geocoding-results">Understanding Geocoding Results</h2>
        <p>Geocoding is the process of converting addresses into geographic coordinates (like latitude and longitude). When you use a geocoding service like Pelias, you get structured output.</p>
        
        <h3>Features</h3>
        <ul>
          <li>
            <code>$.features</code>: Represents the list of results you get from the geocoding service.
          </li>
          <li>
            <code>$.features[0].bbox</code>: The bounding box of the feature, defining the area that includes the location.
          </li>
          <li>
            <code>$.features[0].geometry.coordinates</code>: The latitude and longitude of the location in decimal degrees, based on WGS 1984.
          </li>
          <li>
            <code>$.features[0].geometry.type</code>: The type of geometry (e.g., Point, Polygon).
          </li>
          <li>
            <code>$.features[0].type</code>: The type of feature (e.g., Feature).
          </li>
          <li>
            <code>$.features[0].properties</code>: Additional information about the feature.
          </li>
          <li>
            <code>$.features[0].properties.country</code>: The country of the location.
          </li>
          <li>
            <code>$.features[0].properties.gid</code>: A unique identifier for the location.
          </li>
          <li>
            <code>$.features[0].properties.locality_gid</code>: The unique identifier for the locality (city or town).
          </li>
          <li>
            <code>$.features[0].properties.neighbourhood_gid</code>: The unique identifier for the neighborhood.
          </li>
          <li>
            <code>$.features[0].properties.confidence</code>: A score indicating how confident the service is about the accuracy of the location.
          </li>
          <li>
            <code>$.features[0].properties.country_a</code>: The abbreviation for the country.
          </li>
          <li>
            <code>$.features[0].properties.county</code>: The county of the location.
          </li>
          <li>
            <code>$.features[0].properties.locality</code>: The locality (city or town) of the location.
          </li>
          <li>
            <code>$.features[0].properties.accuracy</code>: The type of accuracy (e.g., rooftop, centroid).
          </li>
          <li>
            <code>$.features[0].properties.source</code>: The data source of the location.
          </li>
          <li>
            <code>$.features[0].properties.label</code>: A human-readable label for the location.
          </li>
          <li>
            <code>$.features[0].properties.region_a</code>: The abbreviation for the region.
          </li>
          <li>
            <code>$.features[0].properties.layer</code>: The layer or category of the feature (e.g., address, venue).
          </li>
          <li>
            <code>$.features[0].properties.country_code</code>: The country code.
          </li>
          <li>
            <code>$.features[0].properties.street</code>: The street name.
          </li>
          <li>
            <code>$.features[0].properties.neighbourhood</code>: The neighborhood.
          </li>
          <li>
            <code>$.features[0].properties.region_gid</code>: The unique identifier for the region.
          </li>
          <li>
            <code>$.features[0].properties.name</code>: The name of the location.
          </li>
          <li>
            <code>$.features[0].properties.match_type</code>: The type of match (e.g., exact, fallback, interpolated).
          </li>
          <li>
            <code>$.features[0].properties.id</code>: A unique ID and source of the location.
          </li>
          <li>
            <code>$.features[0].properties.source_id</code>: The source ID of the location.
          </li>
          <li>
            <code>$.features[0].properties.country_gid</code>: The unique identifier for the country.
          </li>
          <li>
            <code>$.features[0].properties.region</code>: The region of the location.
          </li>
          <li>
            <code>$.features[0].properties.county_gid</code>: The unique identifier for the county.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default GeocodingExplanation;
