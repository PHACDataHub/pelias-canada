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
           
      <GcdsHeader skipToHref="#" 
        style={{
          backgroundColor: '#f1f2f3',
      }}>
      </GcdsHeader>

      
      <h1
        style={{
          color: 'white',
          padding: '15px 0px',
          display: 'flex',
          marginTop: '-15px',
          flexDirection: 'column',
          textAlign: 'center',
          backgroundColor: '#33465c',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '28px',
        }}
      >
        {' '}
        Geocoder
      </h1>

      <main style={{
        height: '100vh',
        width: '1920px',
      }}
      >

      </main>
      <GcdsFooter
        display="compact"
        contextualHeading="Government of Canada"
        contextualLinks='{ "About": "#", "Features": "#", "Information": "#" }'
      ></GcdsFooter>
    </>
  );
}

export default MainContent;
