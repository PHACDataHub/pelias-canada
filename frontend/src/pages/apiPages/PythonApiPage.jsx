import { useState, useEffect } from "react"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css" // Import the CSS file if necessary
import { copyToClipboard } from "../../assets/copyToClipboard.jsx" // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"
import PythonZipDownload from "../../components/zipDowloads/PythonZipDownload.jsx"

export default function RShinyAPIPage() {
	const [pythonForwardCode, setPythonForwardCode] = useState("")
	const [pythonReverseCode, setPythonReverseCode] = useState("")
	const [isForwardOpen, setIsForwardOpen] = useState(false)
	const [isReverseOpen, setIsReverseOpen] = useState(false)

	useEffect(() => {
		const fetchRScript = async () => {
			try {
				const response = await fetch("/codeZips/Python/batch_forwardGeocoder_Pelias_v4.py")
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				const text = await response.text()
				setPythonForwardCode(text)
			} catch (error) {
				console.error("Failed to fetch Python script:", error)
			}
		}

		fetchRScript()
	}, [])

	useEffect(() => {
		const fetchRScript = async () => {
			try {
				const response = await fetch("/codeZips/Python/batch_reverseGeocoder_Pelias_v4.py")
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				const text = await response.text()
				setPythonReverseCode(text)
			} catch (error) {
				console.error("Failed to fetch Python script:", error)
			}
		}

		fetchRScript()
	}, [])

	// copied must stay for toast to work
	// eslint-disable-next-line no-unused-vars
	const [copied, setCopied] = useState(false)

	const handleCopyPythonForward = () => {
		copyToClipboard(pythonForwardCode, () => {
			setCopied(true)
			toast.success("Code copied to clipboard!")
			setTimeout(() => setCopied(false), 2000)
		})
	}
	const handleCopyPythonReverse = () => {
		copyToClipboard(pythonReverseCode, () => {
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
			<h1>{t("pages.python.title")}</h1>
			<div style={{ textAlign: "justify", overflow: "auto" }}>
				<p>{t("pages.python.pythonParagraph")}</p>
			</div>
			<div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
				<PythonZipDownload />
				<br />
				<div style={commonStyles}>
					<h2
						id="forwardPythonCodeHeader"
						onClick={() => setIsForwardOpen(!isForwardOpen)}
						onKeyDown={event => handleKeyDown(event, setIsForwardOpen)}
						style={{ cursor: "pointer" }}
						aria-expanded={isForwardOpen}
						aria-controls="forwardPythonCodeContent"
						tabIndex="0"
					>
						{t("pages.python.forwardPythoncode")}
					</h2>
					{isForwardOpen && (
						<div id="forwardPythonCodeContent" tabIndex="0">
							<div style={{ position: "absolute", top: "10px", right: "10px" }}>
								<GcdsButton size="small" onClick={handleCopyPythonForward} aria-label="Copy Forward Geocoding Python code to clipboard">
									{t("copyCode")}
								</GcdsButton>
							</div>
							<pre style={codeBlockStyles}>
								<code style={codeBlockStyles} aria-label="Forward Geocoding Python Code">
									{pythonForwardCode}
								</code>
							</pre>
						</div>
					)}
				</div>
				<div style={commonStyles}>
					<h2
						id="reversePythonCodeHeader"
						onClick={() => setIsReverseOpen(!isReverseOpen)}
						onKeyDown={event => handleKeyDown(event, setIsReverseOpen)}
						style={{ cursor: "pointer" }}
						aria-expanded={isReverseOpen}
						aria-controls="reversePythonCodeContent"
						tabIndex="0"
					>
						{t("pages.python.reversePythonCode")}
					</h2>
					{isReverseOpen && (
						<div id="reversePythonCodeContent" tabIndex="0">
							<div style={{ position: "absolute", top: "10px", right: "10px" }}>
								<GcdsButton size="small" onClick={handleCopyPythonReverse} aria-label="Copy Reverse Geocoding Python code to clipboard">
									{t("copyCode")}
								</GcdsButton>
							</div>
							<pre style={codeBlockStyles}>
								<code style={codeBlockStyles} aria-label="Reverse Geocoding Python Code">
									{pythonReverseCode}
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
