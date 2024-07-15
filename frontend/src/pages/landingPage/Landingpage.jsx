import { useState } from "react"
import ForwardSinglefetch from "../../components/apiFetch/ForwardSingleFetch"
import SingleFetchResults from "../../components/apiFetch/ResultsSingleFetch"
import UseLocationButton from "../../components/apiFetch/UseLocationButton" 
import { GcdsButton } from "@cdssnc/gcds-components-react"
import ReverseSingleFetch from "../../components/apiFetch/ReverseSingleFetch"

export default function LandingPage() {
	const [forwardResponsedata, setForwardResponsedata] = useState("")
	const [forwardInput, setForwardInput] = useState("")
	const [reverseResponsedata, setReverseResponsedata] = useState("")
	const [useLocationButtonResults, setUseLocationButtonResults] = useState("")

	const handleForwardResponseData = data => {
		resetData()
		setForwardResponsedata(data)
	}

	const handleForwardInput = data => {
		setForwardInput(data)
	}

	const handleUseButtonLocationResponseData = data => {
		resetData()
		setUseLocationButtonResults(data) // Corrected spelling here
	}

	const handleReverseResponseData = data => {
		resetData()
		setReverseResponsedata(data)
	}

	const resetData = () => {
		setForwardResponsedata("")
		setReverseResponsedata("")
		setUseLocationButtonResults("")
	}

	
	return (
		<>
			<h1>Welcome to Pelias Geocoder</h1>

			<div>
				<p>
					Developing in-house, geolocation services (i.e. &quot;batch geocoding&quot;) within PHAC ensuring accurate, cost-effective, secure, trusted, and transparency results as a common
					but important start of multiple analytical, spatial journeys. Phases include tech exploration, prototyping, refining based on user interaction, and expanding coverage.
					Advantages include enhanced privacy, cost savings, traceability, independence from external resources, flexibility, and modularity. Avoids reliance on third-party
					services, ensuring data stays within PHAC&apos;s network and reducing costs associated with external.
				</p>
			</div>
			<section>
				<div style={{ display: "flex", justifyContent: "space-around"  }} >
					<div style={{ display: "flex", justifyContent: "center" }}>
						<ForwardSinglefetch onResponseData={handleForwardResponseData} UserInput={handleForwardInput} />
					</div>
					<div
						style={{
							width: "2px",
							backgroundColor: "#26374a",
							margin: "5px 0",
						}}
					></div>
					<div
						style={{
							display: "flex",
							alignContent: "center",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<UseLocationButton ButtonResponseData={handleUseButtonLocationResponseData} />
					</div>
					<div
						style={{
							width: "2px",
							backgroundColor: "#26374a",
							margin: "5px 0",
						}}
					></div>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
						}}
					>
						<ReverseSingleFetch onResponseData={handleReverseResponseData} />
					</div>
				</div>
				
				{useLocationButtonResults !== "" || forwardResponsedata !== "" || reverseResponsedata !== "" ? (
					<>
						<div>
							<br />
							<GcdsButton
							buttonId="Clear Results" size="small" name="Clear Results"
								onClick={() => {
									resetData()
								}}
							>
								Clear Results
							</GcdsButton>

							<SingleFetchResults forwardResponse={forwardResponsedata} userInput={forwardInput} buttonResponse={useLocationButtonResults} reverseResponse={reverseResponsedata} />
						</div>
					</>
				) : (
					<></>
				)}
			</section>
		</>
	)
}
