import PropTypes from "prop-types"; // Import PropTypes

export default function PercentageCircle({ confidencePercentage }) {
  // Calculate the radius and circumference of the circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke-dashoffset to represent the percentage
  const strokeDashoffset = circumference * (1 - confidencePercentage);

  // Determine the color based on the confidencePercentage
  let color;
  if (confidencePercentage >= 0.99) {
    color = "green";
  } else if (confidencePercentage >= 0.80) {
    color = "lightgreen";
  } else if (confidencePercentage >= 0.50) {
    color = "yellow";
  } else if (confidencePercentage >= 0.30) {
    color = "orange";
  } else {
    color = "red";
  }

  // Format the center text
  const centerText = `${(confidencePercentage * 100).toFixed(1)}%`;

  return (
    <div>
      <svg className="percentage-circle" width="200" height="200">
        <circle
          className="percentage-circle-background"
          cx="100"
          cy="100" // Adjusted to center the circle vertically
          r={radius}
          stroke="#e6e6e6" // Background color
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          className="percentage-circle-progress"
          cx="100"
          cy="100" // Adjusted to center the circle vertically
          r={radius}
          style={{
            stroke: color, // Progress color based on confidencePercentage
            strokeWidth: "10",
            strokeLinecap: "round",
            fill: "transparent",
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
        <text x="100" y="100" textAnchor="middle" dy=".3em" fontSize="20px" fill="#000">
          {centerText}
        </text>
      </svg>
    </div>
  );
}

// Define prop types
PercentageCircle.propTypes = {
  confidencePercentage: PropTypes.number.isRequired,
};
