import { GcdsButton, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
import { useState } from "react"
import { toast } from "react-toastify"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

const UseLocationButton = ({ ButtonResponseData }) => {
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const { t } = useTranslation()

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError)
		} else {
			setError("Geolocation is not supported by this browser.")
		}
	}

	const showPosition = position => {
		sendRequest(position.coords.latitude, position.coords.longitude)
	}

	const sendRequest = (latitude, longitude) => {
		setLoading(true)
		const url = `https://geocoder.alpha.phac.gc.ca/api/v1/reverse?point.lat=${latitude}&point.lon=${longitude}`

		// console.log("Sending request to:", url)

		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				return response.json()
			})
			.then(data => {
				// console.log("Received data:", data)
				setLoading(false)

				const result = data.features && data.features.length > 0 ? { ...data, coordinates: data.features[0].geometry.coordinates } : { ...data }
				ButtonResponseData(result)
			})
			.catch(error => {
				console.error("Error:", error)
				toast.error("An error occurred. Please try again later.")
				setLoading(false)
			})
	}

	const showError = error => {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				setError("User denied the request for Geolocation.")
				break
			case error.POSITION_UNAVAILABLE:
				setError("Location information is unavailable.")
				break
			case error.TIMEOUT:
				setError("The request to get user location timed out.")
				break
			case error.UNKNOWN_ERROR:
				setError("An unknown error occurred.")
				break
			default:
				setError("An unknown error occurred.")
		}
	}

	return (
		<div
			style={{
				display: "flex",
				placeItems: "center",
				height: "100%",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<GcdsHeading tag="h3" characterLimit="false">
				{t("components.apiFetch.useLocationButton.header")}
			</GcdsHeading>
			<GcdsText style={{ textAlign: "center", paddingLeft: "15px", paddingRight: "15px" }}>
				<em>{t("components.apiFetch.useLocationButton.warning")}</em>
			</GcdsText>
			<div
				style={{
					paddingX: "40px",
					height: "full",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
					gap: "10px",
				}}
			>
				<GcdsButton onClick={getLocation} center buttonId={t("components.apiFetch.useLocationButton.getLocation")}  name={t("components.apiFetch.useLocationButton.getLocation")}>
					{t("components.apiFetch.useLocationButton.getLocation")}
				</GcdsButton>
			</div>
			{error !== "" ? null : error}
			{loading === false ? null : "Loading"}
		</div>
	)
}

UseLocationButton.propTypes = {
	ButtonResponseData: PropTypes.func.isRequired,
}

export default UseLocationButton
