import ForwardBulk from "../../components/apiBulkInput/ForwardBulk"

export default function ForwardBulkInput() {
	return (
		<>
			<h1>Bulk Geocoding Input</h1>

			<div style={{ textAlign: "justify" }}>
				<section aria-labelledby="what-is-the-bulk-upload">
					<h2 id="what-is-the-bulk-upload">What is the Bulk Geocoding Input?</h2>
					<p>
						This tool allows users to input multiple addresses or locations at once to get geocoding results in bulk. Users can upload a CSV file containing the addresses, the tool then processes these inputs and provides the geocoded results, which can be downloaded or viewed on the
						page.
					</p>
				</section>

				<section aria-labelledby="how-to-use-bulk-input">
					<h2 id="how-to-use-bulk-input">How to use Bulk Input</h2>
					<p>
						<i>File type must be a CSV</i>
					</p>
					<ol>						
						<li>
							For any data you wish to transform, ensure the column you wish to transform is called <strong>physicalAddress</strong> & there is a column called <strong>IndexID</strong>.
						</li>
						<li>The tool cleans and formats the addresses, preparing them for geocoding.</li>
						<li>Once the data is prepared and ready, the data will be sent to the Pelias Application Programming Interface (API).</li>
						<li>After the API receives the data, it will return the results, including confidence levels and additional data.</li>
						<li>Users have the option to export the results as a CSV file or as a GeoJSON.</li>
					</ol>
				</section>
			</div>

			<section aria-labelledby="input">
				<h2 id="input">Input Upload</h2>
				<div id="BulkInput">
					<ForwardBulk />
				</div>
			</section>
		</>
	)
}
