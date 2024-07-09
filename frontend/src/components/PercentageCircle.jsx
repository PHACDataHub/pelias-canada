
import PropTypes from 'prop-types'; // Import PropTypes

export default function PercentageCircle({ confidencePercentage }) {
  // Calculate the radius and circumference of the circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke-dashoffset to represent the percentage
  const strokeDashoffset = circumference * (1 - confidencePercentage);

  // Determine the color based on the confidencePercentage
  let color;
  if (confidencePercentage < 0.5) {
    color = '#ff0000'; // Red for percentages below 50%
  } else if (confidencePercentage <= 0.8) {
    color = '#ffff00'; // Yellow for percentages between 51% and 80%
  } else {
    color = '#00ff00'; // Green for percentages above 80%
  }

  // Format the center text
  const centerText = `${(confidencePercentage * 100).toFixed(1)}%`;

  return (
    <svg className="percentage-circle" width="200" height="200">
      <circle
        className="percentage-circle-background"
        cx="75"
        cy="75"
        r={radius}
        stroke="#e6e6e6" // Background color
        strokeWidth="10"
        fill="transparent"
      />
      <circle
        className="percentage-circle-progress"
        cx="75"
        cy="75"
        r={radius}
        style={{
          stroke: color, // Progress color based on confidencePercentage
          strokeWidth: '10',
          strokeLinecap: 'round',
          fill: 'transparent',
          strokeDasharray: circumference,
          strokeDashoffset: strokeDashoffset,
        }}
      />
      <text
        x="75"
        y="75"
        textAnchor="middle"
        dy=".3em"
        fontSize="20px"
        fill="#000"
      >
        {centerText}
      </text>
    </svg>
  );
}

// Define prop types
PercentageCircle.propTypes = {
  confidencePercentage: PropTypes.number.isRequired,
};
