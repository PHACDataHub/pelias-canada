import { useEffect, useState, useCallback } from "react"
import { parse } from "papaparse"
import "./FAQ.css"
import { GcdsDetails, GcdsGrid, GcdsHeading } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"

export default function FAQ() {
	const [faqData, setFaqData] = useState(null)
	const [loading, setLoading] = useState(true)
	const { i18n, t } = useTranslation()

	const generateId = category => category.replace(/\s+/g, "-").toLowerCase()

	const fetchFaqData = useCallback(async () => {
		setLoading(true)
		const language = i18n.language
		const filePath = `locales/${language}/FAQ-${language}.csv`

		try {
			const response = await fetch(filePath)
			const text = await response.text()
			const parsed = parse(text, { header: true }).data

			const groupedData = parsed.reduce((acc, item) => {
				const category = item.Categories?.trim()
				if (category) {
					acc[category] = acc[category] || []
					acc[category].push(item)
				}
				return acc
			}, {})

			setFaqData(groupedData)
		} catch (error) {
			console.error("Failed to load FAQ data:", error)
		} finally {
			setLoading(false)
		}
	}, [i18n.language])

	useEffect(() => {
		fetchFaqData()
		i18n.on("languageChanged", fetchFaqData)

		return () => {
			i18n.off("languageChanged", fetchFaqData)
		}
	}, [fetchFaqData, i18n])

	const scrollToCategory = useCallback((event, category) => {
		event.preventDefault()
		const element = document.getElementById(category)
		if (element) {
			element.scrollIntoView({ behavior: "smooth" })
			element.setAttribute("tabindex", "-1")
			element.focus()
		}
	}, [])

	return (
		<>
			<GcdsHeading tag="h1" characterLimit="false">
				{t("pages.faq.title")}
			</GcdsHeading>

			{/* Table of Contents */}
			<GcdsHeading tag="h2">{t("navigateToSection")}</GcdsHeading>
			<nav className="tableOfContents" aria-label={t("tableOfContents")}>
				<GcdsGrid columns="repeat(auto-fit, minmax(30px, 225px))">
					{loading ? (
						<p aria-live="polite">{t("loading")}</p>
					) : (
						faqData &&
						Object.keys(faqData).map(category => (
							<li key={category} className="tableOfContentsListItem">
								<a href={`#${generateId(category)}`} onClick={e => scrollToCategory(e, generateId(category))} aria-label={`${t("navigateToSection")}: ${category}`}>
									{category}
								</a>
							</li>
						))
					)}
				</GcdsGrid>
			</nav>

			{/* FAQ Sections */}
			{faqData &&
				Object.keys(faqData).map(category => (
					<>
						<section key={category} id={generateId(category)} className="category-container">
							<GcdsHeading tag="h3">{category}</GcdsHeading>
							<ul className="listItem">
								{faqData[category].map(({ Question, Answer }, index) => (
									<li key={index} style={{ marginBottom: "10px" }}>
										<GcdsDetails
											detailsTitle={Question}
											aria-expanded="false" // Ensures assistive tech understands toggle state
										>
											{Answer}
											<span
												role="status"
												aria-live="polite"
												tabIndex="-1"
												style={{
													position: "absolute",
													left: "-9999px",
													width: "1px",
													height: "1px",
													overflow: "hidden",
												}}
											>
												{Answer}
											</span>
										</GcdsDetails>
									</li>
								))}
							</ul>
						</section>
						<br />
						<hr style={{ marginTop: "10px" }}></hr>
					</>
				))}
		</>
	)
}
