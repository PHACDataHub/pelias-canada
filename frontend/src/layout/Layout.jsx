import { Outlet, useLocation } from "react-router-dom"
import { GcdsHeader, GcdsContainer, GcdsFooter } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css"
import Breadcrumb from "../components/Breadcrumb"
import "./Layout.css"
import TopNav from "./TopNav"
import { useTranslation } from "react-i18next"

export default function Layout() {
	const { t, i18n } = useTranslation()

	const changeLanguage = lng => {
		i18n.changeLanguage(lng)
	}

	const location = useLocation()

	const contextualLinks = {
		[t("footer.resultsExplained")]: "/geocoding-results-explanation",
		[t("footer.faq")]: "/frequently-asked-questions",
	}

	return (
		<>
			<GcdsHeader skipToHref="#main-content" padding="150px" height="auto" lang={i18n.language}>
				<div slot="toggle">
					{i18n.language === "en" ? (
						<button className="astext" onClick={() => changeLanguage("fr")}>
							French
						</button>
					) : (
						<button className="astext" onClick={() => changeLanguage("en")}>
							English
						</button>
					)}
				</div>
				<div slot="skip-to-nav">
					<a className="skip-to-content-link" href="#main-content">
						Skip to main content
					</a>
				</div>
				<nav slot="menu" style={{ backgroundColor: "#f1f2f3" }}>
					<GcdsContainer size="xl" centered color="black">
						<TopNav />
					</GcdsContainer>
				</nav>
			</GcdsHeader>
			<GcdsContainer
				size={location.pathname === "/home" || location.pathname === "/" ? "full" : "xl" || "lg"}
				centered
				color="black"
				style={{
					flexGrow: "1",
				}}
				padding="400"
				id="main-content"
			>
				<Breadcrumb />
				<Outlet />
			</GcdsContainer>
			<GcdsFooter
				lang={i18n.language}
				display="full"				
				contextualHeading={t("footer.additionalNav")}
				contextualLinks={contextualLinks} // Pass the object here
			/>
		</>
	)
}
