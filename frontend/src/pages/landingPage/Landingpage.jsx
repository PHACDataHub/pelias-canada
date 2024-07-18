import { useState } from "react"
import ForwardSinglefetch from "../../components/apiFetch/ForwardSingleFetch"
import SingleFetchResults from "../../components/apiFetch/ResultsSingleFetch"
import UseLocationButton from "../../components/apiFetch/UseLocationButton"
import { GcdsButton, GcdsGrid } from "@cdssnc/gcds-components-react"
import ReverseSingleFetch from "../../components/apiFetch/ReverseSingleFetch"
import { useTranslation } from "react-i18next"
// import FlipCard from "../../components/flipCard/FlipCard"

export default function LandingPage() {
	const [forwardResponsedata, setForwardResponsedata] = useState("")
	const [reverseResponsedata, setReverseResponsedata] = useState("")
	const [useLocationButtonResults, setUseLocationButtonResults] = useState("")

	const handleForwardResponseData = data => {
		resetData()
		setForwardResponsedata(data)
	}

	const handleUseButtonLocationResponseData = data => {
		resetData()
		setUseLocationButtonResults(data) // Corrected spelling here
	}

	const handleReverseResponseData = data => {
		resetData()
		setReverseResponsedata(data)
	}

	const resetData = () => {
		setForwardResponsedata("")
		setReverseResponsedata("")
		setUseLocationButtonResults("")
	}

	const { t } = useTranslation()

	// function LandingPageCardFLipSection() {
	// 	return (
	// 		<>
	// 			<GcdsGrid container="xl" columns="repeat(auto-fit, minmax(100px, 200px))" justifyContent="space-evenly" equalRowHeight>
	// 				<FlipCard
	// 					frontText={t("pages.landingPage.cardFlip.enhancedPrivacyTitle")}
	// 					backText={t("pages.landingPage.cardFlip.enhancedPrivacyPara")}
	// 					backColor="#90909020"
	// 					textColor="#26374a"
	// 					flipCardHeight={"225px"}
	// 					flipCardWidth={"200px"}
	// 				/>
	// 				<FlipCard
	// 					frontText={t("pages.landingPage.cardFlip.costSavingTitle")}
	// 					backText={t("pages.landingPage.cardFlip.costSavingPara")}
	// 					backColor="#90909020"
	// 					textColor="#26374a"
	// 					flipCardHeight={"225px"}
	// 					flipCardWidth={"200px"}
	// 				/>

	// 				<FlipCard
	// 					frontText={t("pages.landingPage.cardFlip.traceabilityTitle")}
	// 					backText={t("pages.landingPage.cardFlip.traceabilityPara")}
	// 					backColor="#90909020"
	// 					textColor="#26374a"
	// 					flipCardHeight={"225px"}
	// 					flipCardWidth={"200px"}
	// 				/>
	// 				<FlipCard
	// 					frontText={t("pages.landingPage.cardFlip.flexibilityTitle")}
	// 					backText={t("pages.landingPage.cardFlip.flexibilityPara")}
	// 					backColor="#90909020"
	// 					textColor="#26374a"
	// 					flipCardHeight={"225px"}
	// 					flipCardWidth={"200px"}
	// 				/>
	// 			</GcdsGrid>
	// 		</>
	// 	)
	// }

	return (
		<>
			<h1>{t("pages.landingPage.title")}</h1>
			<section>
				{/* <h2 style={{ textAlign: "justify", fontWeight: "normal", paddingTop: "15px", paddingBottom: "15px" }}>
				{t("pages.landingPage.underHeader")}
				</h2>
				<LandingPageCardFLipSection />
				<h3 style={{ textAlign: "justify", fontWeight: "normal", paddingTop: "15px", paddingBottom: "15px" }}>
				{t("pages.landingPage.cardFlipCaption")}
				</h3> */}
				<p>{t("landingPagePara")}</p>
			</section>

			<section>
				<GcdsGrid container="xl" columns="repeat(auto-fit, minmax(100px, 300px))" justifyContent="space-evenly" equalRowHeight>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<ForwardSinglefetch onResponseData={handleForwardResponseData} />
					</div>
					<div
						style={{
							display: "flex",
							alignContent: "center",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<UseLocationButton ButtonResponseData={handleUseButtonLocationResponseData} />
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
						}}
					>
						<ReverseSingleFetch onResponseData={handleReverseResponseData} />
					</div>
				</GcdsGrid>

				{useLocationButtonResults !== "" || forwardResponsedata !== "" || reverseResponsedata !== "" ? (
					<>
						<div>
							<br />
							<GcdsButton
								buttonId="Clear Results"
								size="small"
								name="Clear Results"
								onClick={() => {
									resetData()
								}}
							>
								Clear Results
							</GcdsButton>

							<SingleFetchResults forwardResponse={forwardResponsedata} buttonResponse={useLocationButtonResults} reverseResponse={reverseResponsedata} />
						</div>
					</>
				) : (
					<></>
				)}
			</section>
		</>
	)
}
