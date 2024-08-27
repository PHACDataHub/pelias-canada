import { GcdsHeading } from "@cdssnc/gcds-components-react"
import ForwardBulk from "../../components/apiBulkInput/ForwardBulk"
import { useTranslation } from "react-i18next"

export default function ForwardBulkInput() {
	const { t } = useTranslation()
	return (
		<>
			<GcdsHeading tag="h1"> {t("pages.forwardBulk.BulkGeocodingInput.title")}</GcdsHeading>
			<div style={{ textAlign: "justify" }}>
				<section aria-labelledby="what-is-the-bulk-upload">
					<h2 id="what-is-the-bulk-upload">{t("pages.forwardBulk.BulkGeocodingInput.subTitle")}</h2>
					<p>{t("pages.forwardBulk.BulkGeocodingInput.description")}</p>
				</section>

				<section aria-labelledby="how-to-use-bulk-input">
					<h2 id="how-to-use-bulk-input">{t("pages.forwardBulk.HowToUseBulkInput.title")}</h2>
					<p>
						<i>{t("pages.forwardBulk.HowToUseBulkInput.steps.fileRequirement")}</i>
					</p>
					<ol>
						<li>
							{t("pages.forwardBulk.HowToUseBulkInput.steps.columnRequirement1")} <strong>physicalAddress</strong>{" "}
							{t("pages.forwardBulk.HowToUseBulkInput.steps.columnRequirement2")}
							<strong>IndexID</strong>.
						</li>
						<li>{t("pages.forwardBulk.HowToUseBulkInput.steps.dataPreparation")} </li>
						<li>{t("pages.forwardBulk.HowToUseBulkInput.steps.dataSubmission")}</li>
						<li>{t("pages.forwardBulk.HowToUseBulkInput.steps.apiResponse")}</li>
						<li>{t("pages.forwardBulk.HowToUseBulkInput.steps.exportOption")}</li>
					</ol>
				</section>
			</div>

			<section aria-labelledby="input">
				<h2 id="input">{t("pages.forwardBulk.InputUploadTitle")}</h2>
				<div id="BulkInput">
					<ForwardBulk />
				</div>
			</section>
		</>
	)
}
