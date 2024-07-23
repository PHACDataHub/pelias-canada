import { useState, useEffect } from "react"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css" // Import the CSS file if necessary
import { copyToClipboard } from "../../assets/copyToClipboard.jsx" // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"
import RZipDownload from "../../components/zipDowloads/RZipDownload.jsx"

export default function RShinyAPIPage() {
	const [rForwardCode, setRForwardCode] = useState("")
	const [rReverseCode, setRReverseCode] = useState("")
	const [isForwardOpen, setIsForwardOpen] = useState(false)
	const [isReverseOpen, setIsReverseOpen] = useState(false)

	useEffect(() => {
		const fetchRScript = async () => {
			try {
				const response = await fetch("/codeZips/R/forwardGeocode_R_script_v1.r")
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				const text = await response.text()
				setRForwardCode(text)
			} catch (error) {
				console.error("Failed to fetch R script:", error)
			}
		}

		fetchRScript()
	}, [])

	useEffect(() => {
		const fetchRScript = async () => {
			try {
				const response = await fetch("/codeZips/R/reverseGeocode_R_script_v1.r")
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				const text = await response.text()
				setRReverseCode(text)
			} catch (error) {
				console.error("Failed to fetch R script:", error)
			}
		}

		fetchRScript()
	}, [])

	// copied must stay for toast to work
	// eslint-disable-next-line no-unused-vars
	const [copied, setCopied] = useState(false)

	const handleCopyRForward = () => {
		copyToClipboard(rForwardCode, () => {
			setCopied(true)
			toast.success("Code copied to clipboard!")
			setTimeout(() => setCopied(false), 2000)
		})
	}
	const handleCopyRReverse = () => {
		copyToClipboard(rReverseCode, () => {
			setCopied(true)
			toast.success("Code copied to clipboard!")
			setTimeout(() => setCopied(false), 2000)
		})
	}

	const commonStyles = {
		flex: 1,
		backgroundColor: "#eeeeee",
		position: "relative",
		padding: "20px",
		borderLeft: "5px solid black",
		marginBottom: "10px",
	}

	const codeBlockStyles = {
		marginTop: "20px",
		overflowWrap: "break-word",
		overflowX: "auto",
	}

	const { t } = useTranslation()

	// Toggle function to manage open/close state
	const toggleAccordion = setter => {
		setter(prev => !prev)
	}

	// Keyboard event handler for accessibility
	const handleKeyDown = (event, setter) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault() // Prevent scrolling when space is pressed
			toggleAccordion(setter)
		}
	}

	return (
		<>
			<h1>{t("pages.rshiny.title")}</h1>
			<div style={{ textAlign: "justify", overflow: "auto" }}>
				<p>{t("pages.rshiny.rshinyParagraph")}</p>
			</div>
			<div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
				<RZipDownload />
				<br />
				<div style={commonStyles}>
					<h2
						id="forwardRCodeHeader"
						onClick={() => setIsForwardOpen(!isForwardOpen)}
						onKeyDown={event => handleKeyDown(event, setIsForwardOpen)}
						style={{ cursor: "pointer" }}
						aria-expanded={isForwardOpen}
						aria-controls="forwardRCodeContent"
						tabIndex="0"
					>
						{t("pages.rshiny.forwardRcode")}
					</h2>
					{isForwardOpen && (
						<div id="forwardRCodeContent" tabIndex="0">
							<div style={{ position: "absolute", top: "10px", right: "10px" }}>
								<GcdsButton size="small" onClick={handleCopyRForward} aria-label="Copy Forward Geocoding R code to clipboard">
									{t("copyCode")}
								</GcdsButton>
							</div>
							<pre style={codeBlockStyles}>
								<code style={codeBlockStyles} aria-label="Forward Geocoding R Code">
									{rForwardCode}
								</code>
							</pre>
						</div>
					)}
				</div>
				<div style={commonStyles}>
					<h2
						id="reverseRCodeHeader"
						onClick={() => setIsReverseOpen(!isReverseOpen)}
						onKeyDown={event => handleKeyDown(event, setIsReverseOpen)}
						style={{ cursor: "pointer" }}
						aria-expanded={isReverseOpen}
						aria-controls="reverseRCodeContent"
						tabIndex="0"
					>
						{t("pages.rshiny.reverseRCode")}
					</h2>
					{isReverseOpen && (
						<div id="reverseRCodeContent" tabIndex="0">
							<div style={{ position: "absolute", top: "10px", right: "10px" }}>
								<GcdsButton size="small" onClick={handleCopyRReverse} aria-label="Copy Reverse Geocoding R code to clipboard">
									{t("copyCode")}
								</GcdsButton>
							</div>
							<pre style={codeBlockStyles}>
								<code style={codeBlockStyles} aria-label="Reverse Geocoding R Code">
									{rReverseCode}
								</code>
							</pre>
						</div>
					)}
				</div>
			</div>
			<ToastContainer />
		</>
	)
}
