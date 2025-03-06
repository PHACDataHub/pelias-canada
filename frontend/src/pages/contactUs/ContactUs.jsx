import { useState, useEffect } from "react"
import { GcdsInput, GcdsTextarea, GcdsButton, GcdsHeading, GcdsSelect, GcdsText } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"

export default function ContactUs() {
	const { t, i18n } = useTranslation()
	const [submitted, setSubmitted] = useState(false)
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	})

	const handleInputChange = event => {
		const { name, value } = event.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = event => {
		event.preventDefault()

		// Check if all required fields have values
		const isValid = formData.name && formData.email && formData.subject && formData.message

		if (isValid) {
			const mailtoLink = `mailto:Geordin.Raganold@hc-sc.gc.ca?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
				`${t("pages.contactUs.name")}:\n${formData.name}\n\n${t("pages.contactUs.email")}:\n${formData.email}\n\n${t("pages.contactUs.subject.title")}:\n${formData.subject}\n\n${t("pages.contactUs.message")}:\n${formData.message}`
			)}`

			window.location.href = mailtoLink
			setSubmitted(true)
		}
	}

	// Reset form when the language changes
	useEffect(() => {
		setFormData({
			name: "",
			email: "",
			subject: "",
			message: "",
		})
		setSubmitted(false)
	}, [i18n.language])

	return (
		<>
			<GcdsHeading tag="h1">{t("pages.contactUs.title")}</GcdsHeading>

			{submitted ? (
				<div style={{ padding: "20px", marginTop: "20px" }}>
					<GcdsHeading tag="h2">{t("pages.contactUs.thankYou.title")}</GcdsHeading>
					<p>{t("pages.contactUs.thankYou.message")}</p>
				</div>
			) : (
				<div>
					<GcdsText characterLimit="false">
						{t("pages.contactUs.subTitle")} <a href="mailto:Geordin.Raganold@hc-sc.gc.ca">Geordin.Raganold@hc-sc.gc.ca</a>.
					</GcdsText>
					<hr style={{ margin: "50px 0" }} />
					<form onSubmit={handleSubmit} key={i18n.language}>
						
						{/* Adding key to trigger re-render */}
						<GcdsHeading tag="h2">{t("pages.contactUs.formTitle")}</GcdsHeading>
						<br />
						<GcdsInput label={t("pages.contactUs.name")} required type="text" id="name" name="name" value={formData.name} onGcdsChange={handleInputChange} lang={i18n.language} />
						<GcdsInput
							label={t("pages.contactUs.email")}
							required
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onGcdsChange={handleInputChange}
							lang={i18n.language}
						/>
						<GcdsSelect
							selectId="select-props"
							label={t("pages.contactUs.subject.title")}
							
							name="subject"
							hint={t("pages.contactUs.subject.hintMessage")}
							defaultValue="Select option."
							value={formData.subject}
							onGcdsChange={handleInputChange}
							required
							lang={i18n.language}
							aria-label={t("pages.contactUs.subject.hintMessage")}
						>
							<option value={t("pages.contactUs.subject.feedback")}>{t("pages.contactUs.subject.feedback")}</option>
							<option value={t("pages.contactUs.subject.bug")}>{t("pages.contactUs.subject.bug")}</option>
							<option value={t("pages.contactUs.subject.helpOption")}>{t("pages.contactUs.subject.helpOption")}</option>
							<option value={t("pages.contactUs.subject.inquire")}>{t("pages.contactUs.subject.inquire")}</option>
							<option value={t("pages.contactUs.subject.followingUp")}>{t("pages.contactUs.subject.followingUp")}</option>
						</GcdsSelect>
						<GcdsTextarea
							label={t("pages.contactUs.message")}
							required
							id="message"
							name="message"
							value={formData.message}
							onGcdsChange={handleInputChange}
							lang={i18n.language}
						/>
						<GcdsButton type="submit">{t("pages.contactUs.submitButton")}</GcdsButton>
					</form>

		
				</div>
			)}
		</>
	)
}