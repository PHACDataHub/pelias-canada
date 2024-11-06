import { Outlet, useLocation } from "react-router-dom"
import { GcdsHeader, GcdsContainer, GcdsFooter, GcdsTopNav, GcdsNavLink, GcdsNavGroup, GcdsLangToggle, GcdsBreadcrumbsItem, GcdsBreadcrumbs } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css"
import "./Layout.css"
import { useTranslation } from "react-i18next"
import { useState } from "react"

export default function Layout() {
	const { t, i18n } = useTranslation()
	const [announcement, setAnnouncement] = useState("") // State for announcements
	const location = useLocation()

	const contextualLinks = {
		[t("footer.resultsExplained")]: "/geocoding-results-explanation",
		[t("footer.faq")]: "/frequently-asked-questions",
	}

	const changeLanguage = lng => {
		i18n.changeLanguage(lng)
		setAnnouncement(`${lng === "fr" ? "La langue a été changée en français" : "The language has been changed to English"}`) // Update announcement
	}

	return (
		<>
			<GcdsHeader langHref={i18n.language} signatureHasLink="false" lang={i18n.language}>
				<div slot="menu">
					<GcdsTopNav label="Top navigation" alignment="right">
						<GcdsNavLink href="/" slot="home">
							Pelias
						</GcdsNavLink>
						<GcdsNavGroup openTrigger={t("menu.bulkFile")} menuLabel={t("menu.bulkFile")}>
							<GcdsNavLink href="/reverse-bulk-files" current={location.pathname === "/reverse-bulk-files" ? true : undefined}>
								{t("menu.reverseBulkFile")}
							</GcdsNavLink>
							<GcdsNavLink href="/forward-bulk-files" current={location.pathname === "/forward-bulk-files" ? true : undefined}>
								{t("menu.addressBulkFile")}
							</GcdsNavLink>
						</GcdsNavGroup>
						<GcdsNavGroup openTrigger={t("menu.developers")} menuLabel={t("menu.developers")}>
							<GcdsNavLink href="/r-api" current={location.pathname === "/r-api" ? true : undefined}>
								R Api
							</GcdsNavLink>
							<GcdsNavLink href="/python-api" current={location.pathname === "/python-api" ? true : undefined}>
								Python Api
							</GcdsNavLink>
						</GcdsNavGroup>
						<GcdsNavLink href="/contact-us" current={location.pathname === "/contact-us" ? true : undefined}>
							{t("menu.contactUs")}
						</GcdsNavLink>
					</GcdsTopNav>
				</div>
				<div slot="breadcrumb">
					{location.pathname === "/" ? null : (
						<GcdsBreadcrumbs>
							<GcdsBreadcrumbsItem href="/">Pelias</GcdsBreadcrumbsItem>
						</GcdsBreadcrumbs>
					)}
				</div>
				<div slot="skip-to-nav" style={{ textAlign: "center", top: "10px", left: 0, width: "100%", zIndex: 3 }}>
					<a className="skip-to-content-link" href="#main-content">
						Skip to main content / Passer au contenu principal
					</a>
				</div>
				<div slot="toggle">
					<GcdsLangToggle
						href="#"
						lang={i18n.language}
						onClick={event => {
							event.preventDefault()
							changeLanguage(i18n.language === "en" ? "fr" : "en")
						}}
					></GcdsLangToggle>
				</div>
			</GcdsHeader>

			<GcdsContainer
				size={location.pathname === "/home" || location.pathname === "/" ? "full" : "xl"}
				centered
				color="black"
				style={{ flexGrow: "1" }}
				main-container
				id="main-content"
			>
				<Outlet />
				<GcdsTopNav
  label="Top navigation"
  alignment="right"
>
  <GcdsNavLink href="#home" slot="home">GC Notify</GcdsNavLink> 
  <GcdsNavLink href="#">Why GC Notify</GcdsNavLink>

  <GcdsNavGroup  openTrigger="Features" menuLabel="Features">
    <GcdsNavLink href="#" current>Create reusable templates</GcdsNavLink>
    <GcdsNavLink href="#">Personalize messages</GcdsNavLink>
    <GcdsNavLink href="#">Schedule messages</GcdsNavLink>
    <GcdsNavLink href="#">Send messages automatically</GcdsNavLink>
  </GcdsNavGroup>

  <GcdsNavLink href="#">Contact us</GcdsNavLink>
</GcdsTopNav>
			</GcdsContainer>

			{/* Announce the language change */}
			<span aria-live="polite" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
				{announcement}
			</span>

			<GcdsFooter lang={i18n.language} display="full" contextualHeading={t("footer.additionalNav")} contextualLinks={contextualLinks} style={{paddingTop:"50px"}}/>
		</>
	)
}
