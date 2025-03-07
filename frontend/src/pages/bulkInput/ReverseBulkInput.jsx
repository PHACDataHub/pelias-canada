import { useTranslation } from "react-i18next"

import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
import ReverseBulk from "../../components/apiBulkInput/reverseBulk/IntakeReverseBulk"

export default function ReverseBulkInput() {
	const { t } = useTranslation()
	return (
		<>
			<GcdsHeading tag="h1">{t("pages.reverseBulk.title")}</GcdsHeading>

			<div>
				<section aria-labelledby="what-is-the-bulk-upload">
					<GcdsHeading tag="h2" characterLimit="false" id="what-is-the-bulk-upload">
						{t("pages.reverseBulk.subTitle")}?
					</GcdsHeading>
					<GcdsText characterLimit="false">{t("pages.reverseBulk.subtTitlePara")}</GcdsText>
				</section>

				<section aria-labelledby="how-to-use-bulk-input">
					<GcdsHeading tag="h2" characterLimit="false" id="how-to-use-bulk-input">
						{t("pages.reverseBulk.howToUse.title")}
					</GcdsHeading>
					<GcdsText characterLimit="false">
						<i>{t("pages.reverseBulk.howToUse.fileType")}</i>
					</GcdsText>
					<GcdsText characterLimit="false">
						<ol>
							<li>
								{t("pages.reverseBulk.howToUse.one")}:
								<ul>
									<li>
										<strong>inputID</strong>
									</li>
									<li>
										<strong>ddLat</strong>
									</li>
									<li>
										<strong>ddLong</strong>
									</li>
								</ul>
							</li>
							<li>{t("pages.reverseBulk.howToUse.two")}</li>
							<li>{t("pages.reverseBulk.howToUse.three")}</li>
							<li>{t("pages.reverseBulk.howToUse.four")}</li>
							{/* <li>{t("pages.reverseBulk.howToUse.five")}</li> */}
							<li>{t("pages.reverseBulk.howToUse.six")}</li>
						</ol>
					</GcdsText>
				</section>
			</div>

			<div id="BulkInput">
				<ReverseBulk />
			</div>
		</>
	)
}
