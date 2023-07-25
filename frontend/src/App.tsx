import React from "react"

import "./App.css"
import TestPage from "./components/addressConverter/testpage"
import SingleAddressInput from "./components/singleInputs/Address/addressInput"
import SingleLatLongInput from "./components/singleInputs/LongLat/longLartInput"


function App() {
	return (
		<>
			<br />
			<br />
			<SingleAddressInput
				buttonBackgroundColor={""}
				buttonBorderColor={""}
				buttonBorderRadius={""}
				buttonBorderStyle={""}
				buttonBorderWidth={""}
				buttonBoxShadow={""}
				buttonDisplay={""}
				buttonFontSize={""}
				buttonFontWeight={""}
				buttonPadding={""}
				buttonTextAlign={"center"}
				buttonTextColor={""}
				buttonTextTransform={"initial"}
				buttonTransition={""}
				displayStatusSingleAddress={false}
				fontFamily={""}
				fontSize={""}
				fontWeight={""}
				formBackgroundColor={""}
				inputBarBackgroundColor={""}
				inputBarTextColor={""}
			/>
			<br />

			<SingleLatLongInput
				displayStatusSingleLatLong={false}
				formBackgroundColor={""}
				inputBarBackgroundColor={""}
				inputBarTextColor={""}
				fontSize={""}
				fontFamily={""}
				fontWeight={""}
				buttonTextColor={""}
				buttonFontSize={""}
				buttonFontWeight={""}
				buttonBackgroundColor={""}
				buttonPadding={""}
				buttonBorderWidth={""}
				buttonBorderStyle={""}
				buttonBorderColor={""}
				buttonBorderRadius={""}
				buttonBoxShadow={""}
				buttonTextAlign={"center"}
				buttonTextTransform={"initial"}
				buttonDisplay={""}
				buttonTransition={""}
			/>

			<br/>
			<TestPage/>
		</>
	)
}

export default App
