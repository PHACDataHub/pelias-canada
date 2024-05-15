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
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <GcdsHeader langHref="#" skipToHref="#"></GcdsHeader>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
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
