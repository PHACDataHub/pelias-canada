import React, { useState, useEffect } from "react";

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
	displayStatusSingleAddress: boolean 
	fontFamily: string
	fontSize: string
	fontWeight: string
	formBackgroundColor: string
	inputBarBackgroundColor: string
	inputBarTextColor: string
}

function SingleAddressInput({ 	buttonBackgroundColor,
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
	displayStatusSingleAddress = true,
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
  const [inputText, setInputText] = useState("");
  const [originalURL, setOriginalURL] = useState("");
  const [conversionResult, setConversionResult] = useState("");
  const [latitudeResult, setLatitudeResult] = useState("");
  const [longitudeResult, setLongitudeResult] = useState("");
  const [isValid, setIsValid] = useState(true); // Track form validation result

  useEffect(() => {
    // Get the original URL when the component mounts
    const currentURL = `${window.location.origin}${window.location.pathname}`;
    setOriginalURL(currentURL);
  }, []);

  const updateURL = () => {
    const trimmedInputText = inputText.trim();
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("text", trimmedInputText);
    const newURL = `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`;
    window.history.replaceState(null, "", newURL);
  };
  

  const resetURL = () => {
    // Reset the URL to its original state
    window.history.replaceState(null, "", originalURL);
    setInputText(""); // Clear the input field when resetting the URL
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const AlphanumericValidator = ({ value }: { value: string }) => {
    const alphanumericValidation = /^[0-9a-zA-Z]+$/;
    // Remove multiple consecutive spaces and replace with a single space
    const trimmedValue = value.trim();
  
    if (trimmedValue !== "" && trimmedValue.split(" ").every(word => word.match(alphanumericValidation))) {
      return true;
    } else {
      if (trimmedValue === "") {
        alert("Input must contain at least one alphanumeric character.");
      } else if (!trimmedValue.split(" ").every(word => word.match(alphanumericValidation))) {
        alert("Only alphanumeric characters are allowed.");
      } else if (trimmedValue !== value) {
        alert("Input cannot start or end with spaces.");
      }
      return false;
    }
  };
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission and page reload

    if (AlphanumericValidator({ value: inputText })) {
      setIsValid(true); // Set isValid to true if validation passes
      setLatitudeResult("123456789");
      setLongitudeResult("123456789");
      setConversionResult(`${inputText}`); // Set the conversion result
      updateURL(); // Call the function to update the URL with the latest inputText
      setInputText(""); // Clear the input field
    } else {
      // Handle invalid input
      setIsValid(false); // Set isValid to false if validation fails. 
      // setInputText does not clear the input field
    }
  };

  const handleClearInput = () => {
    setInputText(""); // Clear the input field
  };

  return (
    <>
      {displayStatusSingleAddress && (
				<div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: formBackgroundColor, fontSize: fontSize, fontFamily: fontFamily, fontWeight: fontWeight }}>
            <p>Enter an address / Saisir une adresse :</p>
          <form onSubmit={handleSubmit}>
          <div style={{ margin: "5px" }}>
            <input type="text" placeholder="123 Fake Street" value={inputText} onChange={handleInputChange} style={{ width: "100%", backgroundColor: inputBarBackgroundColor, color: inputBarTextColor }} />
            
              </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
            {/* Submit button is disabled if value of inputText is empty */}
            {inputText === "" ? (
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
            {/* New button to clear the input field */}
            <button type="button" onClick={handleClearInput} style={{
									...buttonStyle,
								}}>
              Clear / Effacer 
            </button>
            <button
              type="button"
              style={{
                ...buttonStyle,
              }}
              onClick={() => {
                resetURL();
                setConversionResult("");
                setIsValid(true); // Reset isValid to true when Reset button is clicked
              }}
            >
              Reset / Réinitialiser
            </button>
            </div>
          </form>
          {/* Display the conversion result if it is not an empty string */}
          {isValid && conversionResult !== "" && (
            <p>
             Entered /Entré : {conversionResult} <br />
								Results / Résultats : <br /> latitude: {latitudeResult} <br /> longitude: {longitudeResult}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default SingleAddressInput;
