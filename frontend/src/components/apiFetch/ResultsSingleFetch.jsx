import PropTypes from 'prop-types';
import { GcdsButton, GcdsDetails } from '@cdssnc/gcds-components-react';
import MapComponentOL from '../MapComponent';
import PercentageCircle from '../PercentageCircle';
import { copyToClipboard } from '../../assets/copyToClipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SingleFetchResults({ forwardResponse, buttonResponse, reverseResponse }) {
  const result = forwardResponse || buttonResponse || reverseResponse;

  const convertTimestamp = (epoch) => {
    const date = new Date(epoch);
    const dateString = date.toLocaleDateString('en-CA'); // 'en-CA' gives us the YYYY/MM/DD format
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    return `${dateString} ${timeString}`;
  };

  const handleCopyAddress = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error('Address information is not available.');
      return;
    }
    copyToClipboard(result.features[0].properties.label.toString(), () => {
      toast.success('Address copied to clipboard!');
    });
  };

  const handleCopyLatitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error('Latitude information is not available.');
      return;
    }
    copyToClipboard(result.features[0].geometry.coordinates[1].toString(), () => {
      toast.success('Latitude copied to clipboard!');
    });
  };

  const handleCopyLongitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error('Longitude information is not available.');
      return;
    }
    copyToClipboard(result.features[0].geometry.coordinates[0].toString(), () => {
      toast.success('Longitude copied to clipboard!');
    });
  };

  const handleCopyLatitudeLongitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error('Latitude and Longitude information is not available.');
      return;
    }
    const latitude = result.features[0].geometry.coordinates[1];
    const longitude = result.features[0].geometry.coordinates[0];
    const latLong = `${latitude}, ${longitude}`;
    copyToClipboard(latLong, () => {
      toast.success('Latitude and Longitude copied to clipboard!');
    });
  };

  const handleCopyLongitudeLatitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error('Latitude and Longitude information is not available.');
      return;
    }
    const latitude = result.features[0].geometry.coordinates[1];
    const longitude = result.features[0].geometry.coordinates[0];
    const longLat = `${longitude}, ${latitude}`;
    copyToClipboard(longLat, () => {
      toast.success('Longitude and Latitude copied to clipboard!');
    });
  };

  return (
    <div>
      {/* 
      Uncomment for debugging if responses are not working as intended:
      <p>forwardResponse Response: {JSON.stringify(forwardResponse)}</p>
      <p>buttonResponse Response: {JSON.stringify(buttonResponse)}</p>
      <p>reverseResponse Response: {JSON.stringify(reverseResponse)}</p>
      */}

      {result && result.features && result.features[0] && (
        <div>
          <h2>Information returned:</h2>
          <div style={{ border: '1px solid black', padding: '4px' }}>
            <div>
              {/* 
              Conditional rendering logic can be added here if needed.
              Example:
              {returnAddress.toLowerCase() === result.geocoding.query.text.toLowerCase() ? (
                <h3>Accuracy information</h3>
              ) : (
                <>
                  <div style={{ padding: "20px", backgroundColor: "#f44336", color: "white", marginBottom: "15px" }}>
                    <strong>The input address and return address do not match exactly. This may result in inaccurate results.</strong>
                    For more accurate results, please check the following:
                    <ul>
                      <li>Is the <strong><i>Address</i></strong> correct?</li>
                      <li>Is the <strong><i>Street Type</i></strong> in short form?</li>
                      <li>Is the <strong><i>Street Direction</i></strong> in short form?</li>
                      <li>Is the <strong><i>City</i></strong> correct?</li>
                      <li>Is the <strong><i>Province</i></strong> correct?</li>
                    </ul>
                  </div>
                  <h3>Accuracy information</h3>
                </>
              )}
              */}
              <h3>Accuracy information</h3>
            </div>
            <div>
              <p>
                Address returned for:{' '}
                {`${result.features[0].properties.housenumber} ${result.features[0].properties.street}, ${result.features[0].properties.locality}, ${result.features[0].properties.region}`}
              </p>
              <p>
                Geolocation returned for (longitude, latitude): {`${result.features[0].geometry.coordinates[0]}, ${result.features[0].geometry.coordinates[1]}`}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <div>
                <p>Call Confidence</p>
                <PercentageCircle confidencePercentage={result.features[0].properties.confidence} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p>
                  <strong>Match Type:</strong> {result.features[0].properties.match_type}
                </p>
                <p>
                  <strong>Accuracy:</strong> {result.features[0].properties.accuracy}
                </p>
                <p>
                  <strong>Source:</strong> {result.features[0].properties.source}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '10px' }}>
              <i>Information provided by Pelias Geocoder v{result.geocoding.version}</i>
            </div>
          </div>
          <h4> </h4>
          <div>
            <p>
              <strong>Date and Time (YYYY-MM-DD HH:MM:SS AM/PM): </strong> {convertTimestamp(result.geocoding.timestamp)}
            </p>
          </div>
          <p>
            Address: {result.features[0].properties.label}
            <GcdsButton
              buttonRole="secondary"
              buttonId="Copy Longitude"
              size="small"
              name="Copy Longitude"
              style={{ marginLeft: '10px' }}
              onClick={handleCopyAddress}
            >
              Copy
            </GcdsButton>
          </p>
          <p>
            Longitude: {result.features[0].geometry.coordinates[0]}
            <GcdsButton
              buttonRole="secondary"
              buttonId="Copy Longitude"
              size="small"
              name="Copy Longitude"
              style={{ marginLeft: '10px' }}
              onClick={handleCopyLongitude}
            >
              Copy
            </GcdsButton>
          </p>

          <p>
            Latitude: {result.features[0].geometry.coordinates[1]}
            <GcdsButton
              buttonRole="secondary"
              buttonId="Copy Latitude"
              size="small"
              name="Copy Latitude"
              style={{ marginLeft: '10px' }}
              onClick={handleCopyLatitude}
            >
              Copy
            </GcdsButton>
          </p>

          <GcdsDetails detailsTitle="See more options">
            <p style={{ fontSize: '16px' }}>
              Longitude, Latitude: {result.features[0].geometry.coordinates[0]}, {result.features[0].geometry.coordinates[1]}
              <GcdsButton
                buttonRole="secondary"
                buttonId="Copy Longitude Latitude"
                size="small"
                name="Copy Longitude Latitude"
                style={{ marginLeft: '10px' }}
                onClick={handleCopyLongitudeLatitude}
              >
                Copy
              </GcdsButton>
            </p>

            <p style={{ fontSize: '16px' }}>
              Latitude, Longitude: {result.features[0].geometry.coordinates[1]}, {result.features[0].geometry.coordinates[0]}
              <GcdsButton
                buttonRole="secondary"
                buttonId="Copy Latitude Longitude"
                size="small"
                name="Copy Latitude Longitude"
                style={{ marginLeft: '10px' }}
                onClick={handleCopyLatitudeLongitude}
              >
                Copy
              </GcdsButton>
            </p>
          </GcdsDetails>

          <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <GcdsDetails detailsTitle="View the Map">
              <MapComponentOL
                mapContentJSON={[`${result.features[0].geometry.coordinates[0]},${result.features[0].geometry.coordinates[1]},${result.features[0].properties.confidence * 100}`]}
              />
            </GcdsDetails>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

// PropTypes validation
SingleFetchResults.propTypes = {
  forwardResponse: PropTypes.func.isRequired,
  buttonResponse: PropTypes.func.isRequired,
  reverseResponse: PropTypes.func.isRequired,
};
