import './FlipCard.css'; // Import the CSS file for styles
import PropTypes from 'prop-types';

export default function FlipCard({
  frontText,
  backText,
  backColor,
  textColor,
  flipCardHeight,
  flipCardWidth,
}) {
  return (
    <div
      className="flip-card"
      tabIndex="0"
      aria-label="Flip card with information"
      style={{ height: flipCardHeight, width: flipCardWidth }}
    >
      <div
        className="flip-card-inner"
        style={{
          backgroundColor: backColor,
          color: textColor,
          borderRadius: '25px',
        }}
      >
        <div
          className="flip-card-front"
          style={{
            backgroundColor: backColor,
            color: textColor,
            borderRadius: '25px',
          }}
        >
          <h3>{frontText}</h3>
        </div>
        <div
          className="flip-card-back"
          style={{
            backgroundColor: backColor,
            color: textColor,
            borderRadius: '25px',
          }}
        >
          <h4>{frontText}</h4>
          <p>{backText}</p>
        </div>
      </div>
    </div>
  );
}

FlipCard.propTypes = {
  frontText: PropTypes.string,
  backText: PropTypes.string,
  backColor: PropTypes.string,
  textColor: PropTypes.string,
  flipCardHeight: PropTypes.string,
  flipCardWidth: PropTypes.string,
};
