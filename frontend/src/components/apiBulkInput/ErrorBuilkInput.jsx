import { Link } from "react-router-dom"
import "./ErrorBulkInput.css"
import PropTypes from "prop-types" // Import PropTypes

const ErrorBulkInput = ({ refreshLink }) => {
	ErrorBulkInput.propTypes = {
		refreshLink: PropTypes.string.isRequired, // Define propTypes for refreshLink
	}
	const handleReset = () => {
		// Example: Handle reset logic
		window.location.reload()
	}

	return (
		<div className="error-container">
			<div className="error-box">
				<h4>Error</h4>
				<p>
					An error has occurred.{" "}
					<Link to={refreshLink} onClick={handleReset}>
						Click here
					</Link>{" "}
					to try again.
				</p>
				<p>
					<Link to="/geocoding-explanation">Click here</Link> for more information about the Pelias Geocoder Results.
				</p>
				<p>
					<Link to="/frequently-asked-questions">Click here</Link> to view the Frequently Asked Questions.
				</p>
			</div>
		</div>
	)
}
ErrorBulkInput.propTypes = {
	refreshLink: PropTypes.string.isRequired, // Define propTypes for refreshLink
}

export default ErrorBulkInput
