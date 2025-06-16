import PropTypes from 'prop-types';

export default function PercentageCircle({ confidencePercentage }) {
  // Ensure confidencePercentage is a number between 0 and 100
  const normalized = Math.max(0, Math.min(confidencePercentage, 100));

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - normalized);

  let color;
  if (normalized >= 0.99) {
    color = '#006400'; // Dark Green
  } else if (normalized >= 0.8) {
    color = '#389638'; // Forest Green
  } else if (normalized >= 0.5) {
    color = '#D1A500'; // Amber D1A500
  } else if (normalized >= 0.3) {
    color = '#CC7000'; // Dark Orange CC7000
  } else {
    color = '#B22222'; // Firebrick Red
  }

  const centerText = `${Math.round(confidencePercentage * 100)}%`;

  return (
    <div>
      <svg className="percentage-circle" width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
          style={{
            filter: 'drop-shadow(0px 0px 2px  rgba(0, 0, 0, 0.3))',
          }}
        />

        <text
          x="60"
          y="60"
          textAnchor="middle"
          dy=".3em"
          fontSize="20px"
          fill="#000"
          fontWeight="bold"
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
