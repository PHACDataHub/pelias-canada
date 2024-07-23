import { GcdsContainer, GcdsFooter } from "@cdssnc/gcds-components-react"
import { NavLink } from "react-router-dom"
import "./TopNav.css"
import { useTranslation } from "react-i18next"

// THis is a temporary component
export default function Footer() {
	const { t ,i18n} = useTranslation()
	return (
		<>
			<div style={{ backgroundColor: "rgb(38, 55, 74)", color: "white", margin: "0", padding: "0", marginTop: "50px" }}>
				<GcdsContainer size="xl" centered padding="200">
					<p>{t("footer.additionalNav")}</p>
					<div style={{ display: "flex", w: "100%", paddingTop: "0px", gap: "5%" }} className="body">
						<NavLink to="/geocoding-results-explanation" style={{ color: "white" }}>
						{t("footer.resultsExplained")}
						</NavLink>
						<NavLink to="/frequently-asked-questions" style={{ color: "white" }}>
						{t("footer.faq")}
						</NavLink>
					</div>
				</GcdsContainer>

				<GcdsFooter
					lang={i18n.language}
					// contextualHeading="Pelias Geocoder "
					// contextualLinks='{ "Geocoding Results Explanation": "/geocoding-explanation", "Frequently Asked Questions": "/frequently-asked-questions" }'
				/>
			</div>
		</>
	)
}
