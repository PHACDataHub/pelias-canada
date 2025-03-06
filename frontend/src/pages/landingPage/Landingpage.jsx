import { useEffect, useState } from "react"
import ForwardSinglefetch from "../../components/apiFetch/ForwardSingleFetch"
import SingleFetchResults from "../../components/apiFetch/ResultsSingleFetch"
import UseLocationButton from "../../components/apiFetch/UseLocationButton"
import { GcdsButton, GcdsContainer, GcdsGrid, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
import ReverseSingleFetch from "../../components/apiFetch/ReverseSingleFetch"
import { useTranslation } from "react-i18next"

export default function LandingPage() {
	const [forwardResponsedata, setForwardResponsedata] = useState("")
	const [reverseResponsedata, setReverseResponsedata] = useState("")
	const [useLocationButtonResults, setUseLocationButtonResults] = useState("")
	const { t, i18n } = useTranslation()

	const handleForwardResponseData = data => {
		resetData()
		setForwardResponsedata(data)
	}

	const handleUseButtonLocationResponseData = data => {
		resetData()
		setUseLocationButtonResults(data)
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

	useEffect(() => {
		setForwardResponsedata("")
		setReverseResponsedata("")
		setUseLocationButtonResults("")
	}, [i18n.language])

	// if (forwardResponsedata !== "") {
	// 	console.log(forwardResponsedata);
	// }

	// // Check and log reverseResponsedata if it's not an empty string
	// if (reverseResponsedata !== "") {
	// 	console.log(reverseResponsedata);
	// }

	// // Check and log useLocationButtonResults if it's not an empty string
	// if (useLocationButtonResults !== "") {
	// 	console.log(useLocationButtonResults);
	// }
	const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080)
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 1080px)")
		const handleMediaChange = () => setIsWideScreen(mediaQuery.matches)

		mediaQuery.addEventListener("change", handleMediaChange)
		return () => mediaQuery.removeEventListener("change", handleMediaChange)
	}, [])

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
					<h1>{t("pages.landingPage.title")} </h1>
					{/* Main title */}
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
				aria-label={t("pages.landingPage.title")} // Associate container with a heading
			>
				<GcdsText characterLimit="false">{t("pages.landingPage.landingPagePara")}</GcdsText> {/* Main paragraph text */}
				<div>
					<GcdsHeading tag="h2">{t("pages.landingPage.apiSectionTitle")}</GcdsHeading> {/* Section heading for API-related content */}
					<GcdsText characterLimit="false">
						<em> {t("pages.landingPage.apiSectionPara")} </em>
					</GcdsText>
					{/* Section heading for API-related content */}
					<GcdsGrid
						container="xl"
						columns="repeat(auto-fit, minmax(100px, 300px))"
						justifyContent="space-evenly"
						{...(isWideScreen ? { equalRowHeight: true } : {})} // Apply equalRowHeight only if isWideScreen is true}
					>
						{/* Container for ForwardSinglefetch component */}
						<div>
							<ForwardSinglefetch onResponseData={handleForwardResponseData} />
						</div>
						{/* Container for UseLocationButton component */}
						<div>
							<UseLocationButton ButtonResponseData={handleUseButtonLocationResponseData} />
						</div>
						{/* Container for ReverseSingleFetch component */}
						<div>
							<ReverseSingleFetch onResponseData={handleReverseResponseData} />
						</div>
					</GcdsGrid>
					{/* Show results and clear button if any response data is available */}
					{(useLocationButtonResults !== "" || forwardResponsedata !== "" || reverseResponsedata !== "") && (
						<>
							<div>
								<br />
								<hr />
								<br />
								<GcdsButton
									buttonId="clear-results"
									name={t("pages.landingPage.clearResults")}
									aria-label={t("pages.landingPage.clearResults")}
									onClick={resetData} // Clear all results
								>
									{t("pages.landingPage.clearResults")}
								</GcdsButton>
							</div>
						</>
					)}
					<SingleFetchResults forwardResponse={forwardResponsedata} buttonResponse={useLocationButtonResults} reverseResponse={reverseResponsedata} />
				</div>
			</GcdsContainer>
		</>
	)
}
