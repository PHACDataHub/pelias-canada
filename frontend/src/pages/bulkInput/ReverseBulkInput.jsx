import ReverseBulk from "../../components/reverseBulkFetch/ReverseBulk"

// https://codepen.io/Niko-sy/pen/abgdjqP
export default function ReverseBulkInput() {
	return (
		<>
			<h1>Reverse Bulk Input</h1>

			<div style={{ textAlign: "justify" }}>
				<section aria-labelledby="what-is-the-bulk-upload">
					<h2 id="what-is-the-bulk-upload">What is the Bulk Reverse Geocoding Input?</h2>
					<p>
						This tool allows users to input multiple Longitude and Latitude locations at once to get geocoding results in bulk. Users can upload a CSV file containing the
						geolocations, the tool then processes these inputs and provides the geocoded results, which can be downloaded or viewed on the page.
					</p>
				</section>

				<section aria-labelledby="how-to-use-bulk-input">
					<h2 id="how-to-use-bulk-input">How to use the Bulk Reverse Geocoding Input</h2>
					<p>
						<i>File type must be a CSV</i>
					</p>
					<ol>
						<li>
							For any data you wish to transform, ensure the three (3) following column are in your CSV Headers :
							<ul>
								<li>
									<strong>inputID</strong>
								</li>
								<li>
									<strong>ddLat</strong>
								</li>
								<li>
									<strong>ddLong</strong>
								</li>
							</ul>
						</li>
						<li>The tool cleans and formats the locations, preparing them for geocoding.</li>
						<li>Once the data is prepared and ready, the data will be sent to the Pelias Application Programming Interface (API).</li>
						<li>After the API receives the data, it will return the results, including confidence levels and additional data.</li>
						<li>Users will have a copy of the results in a CSV file and a GeoJSON file. </li>
						<li>
							Users have the option to export selected resuilts in the table at the bottom once there are returned results. The selected returns will be avaiable in a CSV file and
							a GeoJSON file
						</li>
					</ol>
				</section>
			</div>

			<section aria-labelledby="input">
				<h2 id="input">Input Upload</h2>
				<div id="BulkInput">
					<ReverseBulk />
				</div>
			</section>
		</>
	)
}
