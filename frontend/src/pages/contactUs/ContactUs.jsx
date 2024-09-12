import { useState } from "react"
import { GcdsHeading , GcdsButton} from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"
import "./contactUs.css" // Import the CSS file

export default function ContactUs() {
	const { t } = useTranslation()
	const [submitted, setSubmitted] = useState(false) // State to track form submission

	const handleSubmit = event => {
		event.preventDefault()

		const form = event.target
		const name = form.name.value
		const email = form.email.value
		const subject = form.subject.value
		const message = form.message.value

		const mailtoLink = `mailto:Geordin.Raganold@hc-sc.gc.ca?subject=${encodeURIComponent(subject+ " - Pelias Geocoder")}&body=${encodeURIComponent(t("pages.contactUs.name"))}: ${encodeURIComponent(name)}%0A%0A${encodeURIComponent(t("pages.contactUs.email"))}: ${encodeURIComponent(email)} %0A%0A${encodeURIComponent(t("pages.contactUs.subject.title"))}: ${encodeURIComponent(subject)}%0A%0A${encodeURIComponent(t("pages.contactUs.message"))}: %0A%0A${encodeURIComponent(message)}`

		window.location.href = mailtoLink

		setSubmitted(true) // Update state to show thank you message
	}

	return (
		<div>
			<GcdsHeading tag="h1">{t("pages.contactUs.title")}</GcdsHeading>

			{submitted ? (
				<div className="thank-you-message">
					<h2>{t("pages.contactUs.thankYou.title")}</h2>
					<p>{t("pages.contactUs.thankYou.message")}</p>
				</div>
			) : (
				<form onSubmit={handleSubmit} aria-labelledby="contact-form-heading">
					{/* Heading for form */}
					<h2 id="contact-form-heading" className="visually-hidden">
						{t("pages.contactUs.title")}
					</h2>

					{/* Name Field */}
					<label htmlFor="name" className="form-label">
						{t("pages.contactUs.name")}: <strong className="required">(required)</strong>
					</label>
					<input type="text" id="name" name="name" required aria-required="true" className="form-input" />

					{/* Email Field */}
					<label htmlFor="email" className="form-label">
						{t("pages.contactUs.email")}: <strong className="required">(required)</strong>
					</label>
					<input type="email" id="email" name="email" required aria-required="true" className="form-input" />

					{/* Subject Field */}
					<label htmlFor="subject" className="form-label">
						{t("pages.contactUs.subject.title")}: <strong className="required">(required)</strong>
					</label>
					<select id="subject" name="subject" required aria-required="true" className="form-select" defaultValue={""}>
						<option value="" disabled selected>
							{t("pages.contactUs.subject.select")}
						</option>
						<option value={t("pages.contactUs.subject.feedback")}>{t("pages.contactUs.subject.feedback")}</option>
						<option value={t("pages.contactUs.subject.bug")}>{t("pages.contactUs.subject.bug")}</option>
						<option value={t("pages.contactUs.subject.helpOption")}>
							{t("pages.contactUs.subject.helpOption")}</option>
						<option value={t("pages.contactUs.subject.inquire")}>{t("pages.contactUs.subject.inquire")}</option>
						<option value={t("pages.contactUs.subject.followingUp")}>{t("pages.contactUs.subject.followingUp")}</option>
					</select>

					{/* Message Field */}
					<label htmlFor="message" className="form-label">
						{t("pages.contactUs.message")}: <strong className="required">(required)</strong>
					</label>
					<textarea id="message" name="message" required aria-required="true" className="form-textarea-message" />

					{/* Submit Button */}
					<GcdsButton type="submit" className="form-submit-button">
						{t("pages.contactUs.submitButton")}
					</GcdsButton>
				</form>
			)}
		</div>
	)
}
