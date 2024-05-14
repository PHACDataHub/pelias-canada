import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import '@cdssnc/gcds-components-react/gcds.css';
import {
  GcdsHeader,
  GcdsFooter,
  GcdsHeading,
} from '@cdssnc/gcds-components-react';

function MainContent() {
  useEffect(() => {
    document.body.style.backgroundColor = 'white'; // Ensures the background color is white when the component mounts
    return () => {
      document.body.style.backgroundColor = ''; // Resets the background color on unmount
    };
  }, []);

  return (
    <>
      <GcdsHeader langHref="#" skipToHref="#"></GcdsHeader>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centers children horizontally in the container
          justifyContent: 'center', // Centers children vertically in the container
          height: '100vh', // Takes up at least the full height of the viewport
          textAlign: 'center', // Ensures text within children is also centered
        }}
      >
        <GcdsHeading
          tag="h2"
          style={{
            color: 'black',
            margin: '20px 0',
            marginRight: '810px',
            marginLeft: '810px',
          }}
        >
          {' '}
          Pelias Geocoder
        </GcdsHeading>
        {/* Any additional content would go here */}
      </div>

      <GcdsFooter
        display="compact"
        contextualHeading="Government of Canada"
        contextualLinks='{ "About": "#", "Features": "#", "Information": "#" }'
      ></GcdsFooter>
    </>
  );
}

export default MainContent;
