
import { useState } from "react"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css" // Import the CSS file if necessary
import {  toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PropTypes from "prop-types"

ReverseSinglefetch.propTypes = {
	onResponseData: PropTypes.func.isRequired,
  };

export default function ReverseSinglefetch({ onResponseData }) {
	const [latitude, setLatitude] = useState("")
	const [longitude, setLongitude] = useState("")
	const [loading, setLoading] = useState(false)


	const handleSubmit = e => {
		e.preventDefault()

		if (!latitude || !longitude) {
			toast.error("Please enter a Latitude and a Longitude.")
			return
		}

		console.log(`point.lat": ${latitude},"point.lon": ${longitude}`)
		sendRequest(latitude, longitude)
	}

	const sendRequest = (latitude, longitude) => {
		setLoading(true)

		const url = `https://geocoder.alpha.phac.gc.ca/api/v1/reverse?point.lat=${latitude}&point.lon=${longitude}`

		console.log("Sending request to:", url)

		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				return response.json()
			})
			.then(data => {
				console.log("Received data:", data)
				setLoading(false)

				if (data.features && data.features.length > 0) {
					const coords = data.features[0].geometry.coordinates
					setLatitude(coords[1])
					setLongitude(coords[0])

					const result = {
						...data,
					}
					onResponseData(result) // <-- Call the callback here
				} else {
					const result = { ...data }
					onResponseData(result) // <-- Call the callback here
				}
			})
			.catch(error => {
				console.error("Error:", error)
				toast.error("An error occurred. Please try again later.")
				setLoading(false)
			})
	}

	return (
		<>
			<div style={{ paddingX: "40px", height: "full", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px" }}>
				<h4>Enter a Latitude and a Longitude</h4>

				<form
					onSubmit={handleSubmit}
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						alignItems: "center",
					}}
				>
					<div
						style={{
							display: "flex",
							width: "300px",
							justifyContent: "space-between",
						}}
					>
						<label>Longitude:</label>
						<input required type="text" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="-79.387054" />
					</div>
					<div
						style={{
							display: "flex",
							width: "300px",
							justifyContent: "space-between",
						}}
					>
						<label>Latitude:</label>
						<input required type="text" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="43.642567" />
					</div>
					<br />
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							width: "300px",
							justifyContent: "space-around",
							marginBottom: "2",
						}}
					>
						<GcdsButton type="submit" buttonId="submit reverse geolocation" size="small" name="submit reverse geolocation">
							Search
						</GcdsButton>
						<GcdsButton
							type="reset"
							buttonRole="secondary"
							buttonId="reset reverse geolocation"
							size="small"
							name="submit reverse geolocation"
							onClick={() => {
								setLatitude("")
								setLongitude("")								
							}}
						>
							Reset
						</GcdsButton>
					</div>
				</form>
			{loading === false ? (null): ("Loading")}

			</div>
		</>
	)
}
