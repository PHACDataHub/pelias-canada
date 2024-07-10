import { GcdsContainer, GcdsFooter } from "@cdssnc/gcds-components-react"
import { NavLink } from "react-router-dom"
import "./TopNav.css"

// THis is a temporary component
export default function Footer() {
	return (
		<>
			<div style={{ backgroundColor: "rgb(38, 55, 74)", color: "white", margin: "0", padding: "0" }}>
				<GcdsContainer size="xl" centered padding="200">
					<p>Contextual navigation</p>
					<div style={{ display: "flex", w: "100%", paddingTop: "0px", gap: "5%" }} className="body">
						<NavLink to="/geocoding-explanation" style={{ color: "white" }}>
							Geocoding Results Explanation
						</NavLink>
						<NavLink to="/frequently-asked-questions" style={{ color: "white" }}>
							Frequently Asked Questions
						</NavLink>
					</div>
				</GcdsContainer>

				<GcdsFooter
				// contextualHeading="Pelias Geocoder "
				// contextualLinks='{ "Geocoding Results Explanation": "/geocoding-explanation", "Frequently Asked Questions": "/frequently-asked-questions" }'
				/>
			</div>
		</>
	)
}
