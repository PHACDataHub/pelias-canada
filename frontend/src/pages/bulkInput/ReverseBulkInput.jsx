import { useTranslation } from "react-i18next"
import ReverseBulk from "../../components/reverseBulkFetch/ReverseBulk"

export default function ReverseBulkInput() {
	const { t } = useTranslation()
	return (
		<>
			<h1>{t("pages.reverseBulk.title")}</h1>

			<div style={{ textAlign: "justify" }}>
				<section aria-labelledby="what-is-the-bulk-upload">
					<h2 id="what-is-the-bulk-upload">{t("pages.reverseBulk.subTitle")}?</h2>
					<p>{t("pages.reverseBulk.subtTitlePara")}</p>
				</section>

				<section aria-labelledby="how-to-use-bulk-input">
					<h2 id="how-to-use-bulk-input">{t("pages.reverseBulk.howToUse.title")}</h2>
					<p>
						<i>{t("pages.reverseBulk.howToUse.fileType")}</i>
					</p>
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
						<li>{t("pages.reverseBulk.howToUse.five")}</li>
						<li>
							{t("pages.reverseBulk.howToUse.six")}						
						</li>
					</ol>
				</section>
			</div>

			<section aria-labelledby="input">
				<h2 id="input">{t("pages.reverseBulk.inputUpload")} </h2>
				<div id="BulkInput">
					<ReverseBulk />
				</div>
			</section>
		</>
	)
}
