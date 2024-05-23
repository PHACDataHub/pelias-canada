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

      <div style={{
          backgroundColor: '#f1f2f3',
          marginTop:'-20px',
        }}
      >
        <GcdsHeader langHref="#" skipToHref="#">
        </GcdsHeader>
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: '-15px',
          flexDirection: 'column',
          textAlign: 'center',
          backgroundColor: '#33465c',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <GcdsHeading
          tag="h2"
          style={{
            marginRight: '810px',
            marginLeft: '810px',
            color: 'white',
            display: 'flex',
            marginTop: '-25px'
          }}
        >
          {' '}
          Geocoder
        </GcdsHeading>
      </div>

      <div style={{
        height: '100vh',
      }}
      >

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
