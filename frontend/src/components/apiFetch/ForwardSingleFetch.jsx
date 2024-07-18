import { useState } from "react"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css" // Import the CSS file if necessary
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

ForwardSinglefetch.propTypes = {
	onResponseData: PropTypes.func.isRequired,
}

export default function ForwardSinglefetch({ onResponseData }) {
	const [address, setAddress] = useState("")
	const [city, setCity] = useState("")
	const [province, setProvince] = useState("")
	const [loading, setLoading] = useState(false)
	const { t } = useTranslation()

	const handleSubmit = e => {
		e.preventDefault()
		const fullAddress = `${address.trim()}, ${city.trim()}, ${province.trim()}`

		if (!address || !city || !province) {
			toast.error("Please enter address, city, and province.")
			return
		}
		sendRequest(fullAddress)
	}

	const extractApartmentNumber = address => {
		const aptPattern1 = /\b\d+\s*-\s*\d+\b/ // Matches patterns like 711 - 3100
		const aptPattern2 = /\b\d+\b/ // Matches standalone numbers like 120

		let match = address.match(aptPattern1)
		let apartmentNumber = ""
		let unitNumber = ""
		let mainAddress = address.trim()
		let streetAddress = ""

		if (match) {
			apartmentNumber = match[0]
			const parts = apartmentNumber.split("-").map(part => part.trim())
			mainAddress = mainAddress.replace(apartmentNumber, "").trim()
			streetAddress = `${parts[1]} ${mainAddress}`.trim()
			apartmentNumber = {
				firstPart: parts[0],
				secondPart: parts[1],
			}
			unitNumber = parts[0]
		} else {
			match = address.match(aptPattern2)
			if (match) {
				apartmentNumber = match[0]
				mainAddress = mainAddress.replace(apartmentNumber, "").trim()
				streetAddress = `${apartmentNumber} ${mainAddress}`.trim()
				apartmentNumber = {
					firstPart: apartmentNumber,
					secondPart: "",
				}
				unitNumber = apartmentNumber.secondPart
			}
		}

		return { streetAddress, apartmentNumber, unitNumber }
	}

	const sendRequest = fullAddress => {
		setLoading(true)

		const { streetAddress, apartmentNumber, unitNumber } = extractApartmentNumber(fullAddress)

		const url = `https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(streetAddress)}`

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
					const result = {
						...data,
						apartmentNumber,
						unitNumber,
					}

					onResponseData(result)
				} else {
					const result = { ...data, apartmentNumber, unitNumber }
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
			<div style={{ paddingX: "40px", height: "full", display: "flex", flexDirection: "column", justifyContent: "space-around", gap: "10px" }}>
				<h4>{t("components.apiFetch.forwardSingleFetch.inputHeader")}</h4>
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
						<label>{t("components.apiFetch.forwardSingleFetch.address")}:</label>
						<input required type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="110 Laurier Ave W" />
					</div>
					<div
						style={{
							display: "flex",
							width: "300px",
							justifyContent: "space-between",
						}}
					>
						<label>{t("components.apiFetch.forwardSingleFetch.city")}:</label>
						<input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Ottawa" />
					</div>
					<div
						style={{
							display: "flex",
							width: "300px",
							justifyContent: "space-between",
						}}
					>
						<label>{t("components.apiFetch.forwardSingleFetch.province")}:</label>
						<input required type="text" value={province} onChange={e => setProvince(e.target.value)} placeholder="ON" />
					</div>
					<div
						style={{
							display: "flex",
							width: "300px",
							justifyContent: "space-around",
						}}
					>
						<GcdsButton type="submit" buttonId="submit forward geolocation" size="small" name="submit forward geolocation">
							{t("search")}
						</GcdsButton>
						<GcdsButton
							type="reset"
							buttonRole="secondary"
							buttonId="reset forward geolocation"
							size="small"
							name="reset forward geolocation"
							onClick={() => {
								setAddress("")
								setCity("")
								setProvince("")
							}}
						>
							{t("reset")}
						</GcdsButton>
					</div>
				</form>
				{loading === false ? null : "Loading"}
			</div>
		</>
	)
}
