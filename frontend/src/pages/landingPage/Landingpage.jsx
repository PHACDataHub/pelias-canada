import { useState } from "react"
import ForwardSinglefetch from "../../components/apiFetch/ForwardSingleFetch"
import SingleFetchResults from "../../components/apiFetch/ResultsSingleFetch"
import UseLocationButton from "../../components/apiFetch/UseLocationButton"
import { GcdsButton, GcdsContainer, GcdsGrid } from "@cdssnc/gcds-components-react"
import ReverseSingleFetch from "../../components/apiFetch/ReverseSingleFetch"
import { useTranslation } from "react-i18next"

export default function LandingPage() {
	const [forwardResponsedata, setForwardResponsedata] = useState("")
	const [reverseResponsedata, setReverseResponsedata] = useState("")
	const [useLocationButtonResults, setUseLocationButtonResults] = useState("")
	const { t } = useTranslation()

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
			{/* Start of map and welcome section */}
			<div
				style={{
					position: "relative",
					overflow: "hidden",
					padding: "30vh 30vw",
					display: "flex",
					minHeight: "80vh",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{/* Background map image with blur effect */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundImage: `url('/assets/Toronto-Road-Map.jpg')`,
						backgroundAttachment: "fixed",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						filter: "blur(4px)", // Apply blur effect to background image
						zIndex: -1, // Ensure the background is behind other content
					}}
					aria-hidden="true" // Hide this element from assistive technologies
				></div>
				{/* Welcome message container */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(38, 55, 74, 0.9)", // Semi-transparent background for text
						boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)", // White box shadow for text container
						borderRadius: "5px",
						color: "white",
						padding: "60px 5vw",
						textAlign: "center",
						position: "relative", // Ensure this is above the blurred background
						zIndex: 1,
					}}
				>
					<h1>{t("pages.landingPage.title")}</h1> {/* Main title */}
				</div>
			</div>
			{/* End of map and welcome section */}

			{/* Start of container for paragraphs and three single fetch items */}
			<GcdsContainer
				size="xl"
				centered
				color="black"
				style={{ flexGrow: "1" }}
				padding="400"
				id="main-content"
				role="main" // Landmark role for main content
				aria-labelledby="main-title" // Associate container with a heading
			>
				<section aria-labelledby="section1-title">
					{/* Heading and description for the main content */}
					{/* <h2 id="section1-title" style={{ textAlign: "justify", fontWeight: "normal", paddingTop: "15px", paddingBottom: "15px" }}>
						{t("pages.landingPage.underHeader")}
					</h2>
					<LandingPageCardFLipSection />
					<h3 style={{ textAlign: "justify", fontWeight: "normal", paddingTop: "15px", paddingBottom: "15px" }}>
						{t("pages.landingPage.cardFlipCaption")}
					</h3> */}
					<p>{t("landingPagePara")}</p> {/* Main paragraph text */}
				</section>

				<section aria-labelledby="section2-title">
					<h2 id="section2-title">{t("pages.landingPage.apiSectionTitle")}</h2> {/* Section heading for API-related content */}
					<GcdsGrid container="xl" columns="repeat(auto-fit, minmax(100px, 300px))" justifyContent="space-evenly" equalRowHeight>
						{/* Container for ForwardSinglefetch component */}
						<div style={{ display: "flex", justifyContent: "center" }}>
							<ForwardSinglefetch onResponseData={handleForwardResponseData} />
						</div>
						{/* Container for UseLocationButton component */}
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
						{/* Container for ReverseSingleFetch component */}
						<div style={{ display: "flex", justifyContent: "center" }}>
							<ReverseSingleFetch onResponseData={handleReverseResponseData} />
						</div>
					</GcdsGrid>
					{/* Show results and clear button if any response data is available */}
					{(useLocationButtonResults !== "" || forwardResponsedata !== "" || reverseResponsedata !== "") && (
						<>
							<div>
								<br />
								<GcdsButton
									buttonId="clear-results"
									size="small"
									name="Clear Results"
									onClick={resetData} // Clear all results
								>
									{t("pages.landingPage.clearResults")}
								</GcdsButton>

							</div>
						</>
					)}
					<SingleFetchResults forwardResponse={forwardResponsedata} buttonResponse={useLocationButtonResults} reverseResponse={reverseResponsedata} />
				</section>
			</GcdsContainer>
		</>
	)
}
