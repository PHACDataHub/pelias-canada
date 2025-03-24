import PropTypes from "prop-types";

export default function PercentageCircle({ confidencePercentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - confidencePercentage);

  // Define colors with sufficient contrast
  let color;
  if (confidencePercentage >= 0.99) {
    color = "#006400"; // Dark Green
  } else if (confidencePercentage >= 0.8) {
    color = "#389638"; // Forest Green
  } else if (confidencePercentage >= 0.5) {
    color = "#FFBF00"; // Dark Yellow (Amber)
  } else if (confidencePercentage >= 0.3) {
    color = "#FF8C00"; // Dark Orange
  } else {
    color = "#B22222"; // Firebrick Red
  }

  const centerText = `${(confidencePercentage * 100).toFixed(1)}%`;

  return (
    <div>
      <svg className="percentage-circle" width="120" height="120">
        <circle
          className="percentage-circle-background"
          cx="60"
          cy="60"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          className="percentage-circle-progress"
          cx="60"
          cy="60"
          r={radius}
          style={{
            stroke: color,
            strokeWidth: "10",
            strokeLinecap: "round",
            fill: "transparent",
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />

        <text
          x="60"
          y="60"
          textAnchor="middle"
          dy=".3em"
          fontSize="20px"
          fill="#000" // Ensure this text color contrasts with the background
        >
          {centerText}
        </text>
      </svg>
    </div>
  );
}

PercentageCircle.propTypes = {
  confidencePercentage: PropTypes.number.isRequired,
};
