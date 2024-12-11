/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import IntakeForwardFile from "./IntakeForwardBulk"
import ForwardCallAPIReturn from "./ForwardCallAPIReturn"
import GovTestForwardUploading from "./GcdsTestForward"

export default function ForwardBulk() {
	const [inputtedData, setInputtedData] = useState([]) // Lifted results state

	return (
		<>
			<h2>IntakeForwardFile</h2>
			<p>
				Make sure the column to transform is called <strong>inputID</strong>, and there is a column named <strong>physicalAddress</strong>.
			</p>
			<IntakeForwardFile setResults={setInputtedData} />

			{/* {inputtedData.length > 0 ? ( */}
				<>
					<hr /> 
					<ForwardCallAPIReturn results={inputtedData} />
				</>
			{/* ) : null} */}

			{/* <GovTestForwardUploading /> */}
		</>
	)
}
