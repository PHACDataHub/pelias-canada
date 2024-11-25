import PropTypes from "prop-types"
import { GcdsButton, GcdsDetails } from "@cdssnc/gcds-components-react"
import MapComponentOL from "../map/MapComponent"
import PercentageCircle from "../PercentageCircle"
import { copyToClipboard } from "../../assets/copyToClipboard"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"
import "./ResultsMap.css"



export default function SingleFetchResults({ forwardResponse, buttonResponse, reverseResponse }) {
	const result = forwardResponse || buttonResponse || reverseResponse
	const { t } = useTranslation()

	const convertTimestamp = epoch => {
		const date = new Date(epoch)
		const dateString = date.toLocaleDateString("en-CA") // 'en-CA' gives us the YYYY/MM/DD format
		const timeString = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", second: "numeric", hour12: true })
		return `${dateString} ${timeString}`
	}

	const handleCopyAddress = () => {
		if (!result || !result.features || !result.features[0]) {
			toast.error("Address information is not available.")
			return
		}
		copyToClipboard(result.features[0].properties.label.toString(), () => {
			toast.success("Address copied to clipboard!")
		})
	}

	const handleCopyLatitude = () => {
		if (!result || !result.features || !result.features[0]) {
			toast.error("Latitude information is not available.")
			return
		}
		copyToClipboard(result.features[0].geometry.coordinates[1].toString(), () => {
			toast.success("Latitude copied to clipboard!")
		})
	}

	const handleCopyLongitude = () => {
		if (!result || !result.features || !result.features[0]) {
			toast.error("Longitude information is not available.")
			return
		}
		copyToClipboard(result.features[0].geometry.coordinates[0].toString(), () => {
			toast.success("Longitude copied to clipboard!")
		})
	}

	const handleCopyLatitudeLongitude = () => {
		if (!result || !result.features || !result.features[0]) {
			toast.error("Latitude and Longitude information is not available.")
			return
		}
		const latitude = result.features[0].geometry.coordinates[1]
		const longitude = result.features[0].geometry.coordinates[0]
		const latLong = `${latitude}, ${longitude}`
		copyToClipboard(latLong, () => {
			toast.success("Latitude and Longitude copied to clipboard!")
		})
	}

	const handleCopyLongitudeLatitude = () => {
		if (!result || !result.features || !result.features[0]) {
			toast.error("Latitude and Longitude information is not available.")
			return
		}
		const latitude = result.features[0].geometry.coordinates[1]
		const longitude = result.features[0].geometry.coordinates[0]
		const longLat = `${longitude}, ${latitude}`
		copyToClipboard(longLat, () => {
			toast.success("Longitude and Latitude copied to clipboard!")
		})
	}

	return (
		<div>
			{/* 
      Uncomment for debugging if responses are not working as intended:
      <p>forwardResponse Response: {JSON.stringify(forwardResponse)}</p>
      <p>buttonResponse Response: {JSON.stringify(buttonResponse)}</p>
      <p>reverseResponse Response: {JSON.stringify(reverseResponse)}</p>
      */}

			{result && result.features && result.features[0] && (
				<div>
					<h2>{t("components.apiFetch.resultSingleFetch.infoReturn")}</h2>
					<div style={{ border: "1px solid black", padding: "4px" }}>
						<div></div>
						<div>
							<p>
								<strong>{t("components.apiFetch.resultSingleFetch.addressReturn")}: </strong>
								{result.features[0].properties.housenumber !== undefined ? ` ${result.features[0].properties.housenumber + " "}`: null}
								{result.features[0].properties.street !== undefined ? `${result.features[0].properties.street + ", "}`: null}
								{`${result.features[0].properties.locality}, ${result.features[0].properties.region}`}
							</p>
							<p>
								<strong>{t("components.apiFetch.resultSingleFetch.geoReturn")}: </strong>
								{`${result.features[0].geometry.coordinates[0]}, ${result.features[0].geometry.coordinates[1]}`}
							</p>
						</div>
						<div style={{ display: "flex", justifyContent: "space-evenly" }}>
							<div>
								<p>{t("components.apiFetch.resultSingleFetch.confidence")} </p>
								<PercentageCircle confidencePercentage={result.features[0].properties.confidence} />
							</div>
							<div style={{ display: "flex", flexDirection: "column" }}>
								<p>
									<strong>{t("components.apiFetch.resultSingleFetch.matchType")}: </strong> {result.features[0].properties.match_type || "n/a"}
								</p>
								<p>
									<strong>{t("components.apiFetch.resultSingleFetch.accuracy")}: </strong> {result.features[0].properties.accuracy}
								</p>
								<p>
									<strong>{t("components.apiFetch.resultSingleFetch.source")}: </strong> {result.features[0].properties.source}
								</p>
							</div>
						</div>
						<div style={{ display: "flex", justifyContent: "flex-end", fontSize: "11px" }}>
							<i>
								{t("components.apiFetch.resultSingleFetch.infoVersion")} v{result.geocoding.version}
							</i>
						</div>
					</div>
					<h4> </h4>
					<div>
						<p>
							<strong>{t("components.apiFetch.resultSingleFetch.dateTime")}: </strong> {convertTimestamp(result.geocoding.timestamp)}
						</p>
					</div>
					<p>
						{t("components.apiFetch.resultSingleFetch.address")}: {result.features[0].properties.label}
						<GcdsButton buttonRole="secondary" buttonId="Copy Longitude" size="small" name="Copy Longitude" style={{ marginLeft: "10px" }} onClick={handleCopyAddress}>
							{t("copy")}
						</GcdsButton>
					</p>
					<p>
						{t("components.apiFetch.resultSingleFetch.longitude")}: {result.features[0].geometry.coordinates[0]}
						<GcdsButton buttonRole="secondary" buttonId="Copy Longitude" size="small" name="Copy Longitude" style={{ marginLeft: "10px" }} onClick={handleCopyLongitude}>
							{t("copy")}
						</GcdsButton>
					</p>

					<p>
						{t("components.apiFetch.resultSingleFetch.latitude")}: {result.features[0].geometry.coordinates[1]}
						<GcdsButton buttonRole="secondary" buttonId="Copy Latitude" size="small" name="Copy Latitude" style={{ marginLeft: "10px" }} onClick={handleCopyLatitude}>
							{t("copy")}
						</GcdsButton>
					</p>

					<GcdsDetails detailsTitle={`${t("components.apiFetch.resultSingleFetch.seeMoreOpts")}`}>
						<p style={{ fontSize: "16px" }}>
							{t("components.apiFetch.resultSingleFetch.longlat")}: {result.features[0].geometry.coordinates[0]}, {result.features[0].geometry.coordinates[1]}
							<GcdsButton
								buttonRole="secondary"
								buttonId="Copy Longitude Latitude"
								size="small"
								name="Copy Longitude Latitude"
								style={{ marginLeft: "10px" }}
								onClick={handleCopyLongitudeLatitude}
							>
								{t("copy")}
							</GcdsButton>
						</p>

						<p style={{ fontSize: "16px" }}>
							{t("components.apiFetch.resultSingleFetch.latlong")}: {result.features[0].geometry.coordinates[1]}, {result.features[0].geometry.coordinates[0]}
							<GcdsButton
								buttonRole="secondary"
								buttonId="Copy Latitude Longitude"
								size="small"
								name="Copy Latitude Longitude"
								style={{ marginLeft: "10px" }}
								onClick={handleCopyLatitudeLongitude}
							>
								{t("copy")}
							</GcdsButton>
						</p>
					</GcdsDetails>

					<div style={{ paddingTop: "40px", paddingBottom: "40px",  }}>
						<>
							{result?.features?.length > 0 ? (
								<MapComponentOL								
									mapContentJSON={[`${result.features[0].geometry.coordinates[0]},${result.features[0].geometry.coordinates[1]},${result.features[0].properties.confidence * 100}`]}
								/>
							): (
								<p>No Results</p>
							)}
						</>
					</div>
				</div>
			)}
		</div>
	)
}

SingleFetchResults.propTypes = {
	forwardResponse: PropTypes.any,
	buttonResponse: PropTypes.any,
	reverseResponse: PropTypes.any,
}
