import { useEffect, useState } from "react"
import { GcdsButton, GcdsHeading, GcdsInput } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import Loading from "../Loading"

ReverseSinglefetch.propTypes = {
	onResponseData: PropTypes.func.isRequired,
}

export default function ReverseSinglefetch({ onResponseData }) {
	const { t, i18n } = useTranslation()
	const [formData, setFormData] = useState({ latitude: "", longitude: "" })
	const [errors, setErrors] = useState({ latitude: "", longitude: "" })
	const [loading, setLoading] = useState(false)
	const [responseData, setResponseData] = useState(null)

	const LAT_MIN = 41.679999
	const LAT_MAX = 83.113336
	const LONG_MIN = -141.001087
	const LONG_MAX = -52.622111

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
		setErrors({ ...errors, [name]: validateField(name, parseFloat(value)) })
	}

	const handleBlur = e => {
		const { name, value } = e.target
		setErrors({ ...errors, [name]: validateField(name, parseFloat(value)) })
	}

	const validateField = (name, value) => {
		if (isNaN(value)) {
			return ` ${name} ${t(`components.apiFetch.reverseSingleFetch.alerts.required`)}`
		}
		if (name === "latitude" && (value < LAT_MIN || value > LAT_MAX)) {
			// return `${t("components.apiFetch.reverseSingleFetch.latitude")} must be between ${LAT_MIN} and ${LAT_MAX}.`
			return (i18n.language === "en" ? 
			`${t("components.apiFetch.reverseSingleFetch.latitude")} must be between ${LAT_MIN} and ${LAT_MAX}.` : `${t("components.apiFetch.reverseSingleFetch.latitude")} doit être compris entre ${LAT_MIN} et ${LAT_MAX}.`)

		}
		if (name === "longitude" && (value < LONG_MIN || value > LONG_MAX)) {
			// return `${t("components.apiFetch.reverseSingleFetch.longitude")} must be between ${LONG_MIN} and ${LONG_MAX}.`
			return (i18n.languag === "en" ?  
			`${t("components.apiFetch.reverseSingleFetch.longitude")} must be between ${LONG_MIN} and ${LONG_MAX}.` 
		: `${t("components.apiFetch.reverseSingleFetch.longitude")} doit être compris entre ${LONG_MIN} et ${LONG_MAX}.` )} 
		return ""
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const latitude = parseFloat(formData.latitude)
		const longitude = parseFloat(formData.longitude)

		console.log(latitude)
		const newErrors = {
			latitude: validateField("latitude", latitude),
			longitude: validateField("longitude", longitude),
		}
		setErrors(newErrors)

		if (Object.values(newErrors).some(error => error)) return

		try {
			setLoading(true)
			const url = `https://geocoder.alpha.phac.gc.ca/api/v1/reverse?point.lat=${encodeURIComponent(latitude)}&point.lon=${encodeURIComponent(longitude)}`
			const response = await fetch(url)
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
			const data = await response.json()

			if (data.features && data.features.length > 0) {
				const coords = data.features[0].geometry.coordinates
				setFormData({ latitude: coords[1], longitude: coords[0] })
			} else {
				toast.error(t("components.apiFetch.reverseSingleFetch.alerts.moreSpecificCoords"))
			}
			setResponseData(data)
			onResponseData(data)
		} catch (error) {
			toast.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleReset = () => {
		setFormData({ latitude: "", longitude: "" })
		setErrors({ latitude: "", longitude: "" })
		toast.info(t("components.apiFetch.reverseSingleFetch.alerts.formReset"))
	}

	useEffect(() => {
		setFormData({ latitude: "", longitude: "" })
		setErrors({ latitude: "", longitude: "" })
	}, [i18n.language])

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<GcdsHeading tag="h3" characterLimit="false">
				{t("components.apiFetch.reverseSingleFetch.inputHeader")}
			</GcdsHeading>
			<form onSubmit={handleSubmit} key={i18n.language}>
				<GcdsInput
					label={t("components.apiFetch.reverseSingleFetch.latitude")}
					required
					type="number"
					id="latitude"
					name="latitude"
					value={formData.latitude}
					onGcdsChange={handleInputChange}
					onBlur={handleBlur}
					lang={i18n.language}
					errorMessage={errors.latitude}
					hint={`${LAT_MIN} to ${LAT_MAX}`}
					step="0.01"
				/>
				<GcdsInput
					label={t("components.apiFetch.reverseSingleFetch.longitude")}
					required
					type="number"
					id="longitude"
					name="longitude"
					value={formData.longitude}
					onGcdsChange={handleInputChange}
					onBlur={handleBlur}
					lang={i18n.language}
					errorMessage={errors.longitude}
					hint={`${LONG_MIN} to ${LONG_MAX}`}
					step="0.01"
				/>
				<div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1em" }}>
					<GcdsButton type="submit">{t("components.apiFetch.reverseSingleFetch.search")}</GcdsButton>
					<GcdsButton type="button" onClick={handleReset} variant="secondary">
						{t("components.apiFetch.reverseSingleFetch.reset")}
					</GcdsButton>
				</div>
			</form>
			{loading && <Loading />}
			{responseData === true ? "responseData" : null}
		</div>
	)
}
