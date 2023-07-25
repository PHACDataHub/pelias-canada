import React, { useEffect, useState } from "react"


type VisibilityProps = {
	buttonBackgroundColor: string
	buttonBorderColor: string
	buttonBorderRadius: string
	buttonBorderStyle: string
	buttonBorderWidth: string
	buttonBoxShadow: string
	buttonDisplay: string
	buttonFontSize: string
	buttonFontWeight: string
	buttonPadding: string
	buttonTextAlign: "left" | "right" | "center" | "justify" | "initial"
	buttonTextColor: string
	buttonTextTransform: "none" | "capitalize" | "uppercase" | "lowercase" | "initial" | "inherit"
	buttonTransition: string
	displayStatusSingleLatLong: boolean 
	fontFamily: string
	fontSize: string
	fontWeight: string
	formBackgroundColor: string
	inputBarBackgroundColor: string
	inputBarTextColor: string
}

function SingleLatLongInput({
	buttonBackgroundColor,
	buttonBorderColor,
	buttonBorderRadius,
	buttonBorderStyle,
	buttonBorderWidth,
	buttonBoxShadow,
	buttonDisplay,
	buttonFontSize,
	buttonFontWeight,
	buttonPadding,
	buttonTextAlign,
	buttonTextColor,
	buttonTextTransform,
	buttonTransition,
	displayStatusSingleLatLong = true,
	fontFamily,
	fontSize,
	fontWeight,
	formBackgroundColor,
	inputBarBackgroundColor,
	inputBarTextColor,
}: VisibilityProps) {
	const buttonStyle = {
		backgroundColor: buttonBackgroundColor,
		borderColor: buttonBorderColor,
		borderRadius: buttonBorderRadius,
		borderStyle: buttonBorderStyle,
		borderWidth: buttonBorderWidth,
		boxShadow: buttonBoxShadow,
		color: buttonTextColor,
		display: buttonDisplay,
		fontSize: buttonFontSize,
		fontWeight: buttonFontWeight,
		padding: buttonPadding,
		textAlign: buttonTextAlign,
		textTransform: buttonTextTransform,
		transition: buttonTransition,
	}

	const [inputLongitude, setInputLongitude] = useState("")
	const [inputLatitude, setInputLatitude] = useState("")
	const [address, setAddress] = useState("")
	const [originalURL, setOriginalURL] = useState("")
	const [conversionResult, setConversionResult] = useState("")

	const validInputLongitudeRegex = /^-?(\d{1,3}(\.\d{0,8})?|180(\.0{0,8})?)$/
	const validInputLatitudeRegex = /^-?(\d{1,2}(\.\d{0,8})?|90(\.0{0,8})?)$/

	useEffect(() => {
		// Get the original URL when the component mounts
		const currentURL = `${window.location.origin}${window.location.pathname}`
		setOriginalURL(currentURL)
	}, [])

	const updateURL = () => {
		const queryParams = new URLSearchParams(window.location.search)
		queryParams.set("longitude", inputLongitude)
		queryParams.set("latitude", inputLatitude)
		const newURL = `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`
		window.history.replaceState(null, "", newURL)
	}

	const resetURL = () => {
		// Reset the URL to its original state
		window.history.replaceState(null, "", originalURL)
	}

	const handleInputLongitudeChange = (event: { target: { value: any } }) => {
		const { value } = event.target
		if (value === "" || validInputLongitudeRegex.test(value)) {
			setInputLongitude(value)
		}
	}

	const handleInputLatitudeChange = (event: { target: { value: any } }) => {
		const { value } = event.target
		if (value === "" || validInputLatitudeRegex.test(value)) {
			setInputLatitude(value)
		}
	}

	const handleSubmit = (event: { preventDefault: () => void }) => {
		event.preventDefault() // Prevent form submission
		// Perform any action you want with the input values here
		// For this example, we'll just log them to the console
		setConversionResult(`Longitude: ${inputLongitude}, Latitude: ${inputLatitude}`)
		setAddress("123 Fake street, Ottawa, Quebec")
		handleClear()
		updateURL()
	}

	const handleClear = () => {
		setInputLongitude("")
		setInputLatitude("")
	}

	const handleReset = () => {
		setInputLongitude("")
		setInputLatitude("")
		setConversionResult("")
		resetURL()
		// Perform any other reset actions here if needed
	}

	return (
		<>
			{displayStatusSingleLatLong && (
				<div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: formBackgroundColor, fontSize: fontSize, fontFamily: fontFamily, fontWeight: fontWeight }}>
					<p>Enter a Longitude and Latitude / Saisir une longitude et une latitude :</p>
					<form onSubmit={handleSubmit}>
						<div style={{ margin: "5px" }}>
							<label>
								Longitude:
								<input
									style={{ width: "100%", backgroundColor: inputBarBackgroundColor, color: inputBarTextColor }}
									type="text"
									value={inputLongitude}
									onChange={handleInputLongitudeChange}
									placeholder="Enter a number between -180 and 180 with up to 8 decimal places"
								/>
							</label>
							<br />
							<label>
								Latitude:
								<input
									className="input-style"
									style={{ width: "100%", backgroundColor: inputBarBackgroundColor, color: inputBarTextColor }}
									type="text"
									value={inputLatitude}
									onChange={handleInputLatitudeChange}
									placeholder="Enter a number between -90 and 90 with up to 8 decimal places"
								/>
							</label>
						</div>

						<div style={{ display: "flex", justifyContent: "space-around" }}>
							{inputLongitude === "" || inputLatitude === "" ? (
								<button
									type="submit"
									disabled
									style={{
										cursor: "not-allowed",
										...buttonStyle,
									}}
								>
									Submit / Soumettre
								</button>
							) : (
								<button
									type="submit"
									style={{
										...buttonStyle,
									}}
								>
									Submit / Soumettre
								</button>
							)}
							<button
								type="button"
								onClick={handleClear}
								style={{
									...buttonStyle,
								}}
							>
								Clear / Effacer
							</button>
							<button
								type="button"
								onClick={handleReset}
								style={{
									...buttonStyle,
								}}
							>
								Reset / Réinitialiser
							</button>
						</div>
					</form>
					{conversionResult !== "" && (
						<div>
							<p>
								Entered /Entré : {conversionResult} <br />
								Results / Résultats : {address}
							</p>
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default SingleLatLongInput
