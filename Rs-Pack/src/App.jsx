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
        marginTop: '-20px',
      }}
      >        
        <GcdsHeader langHref="#" skipToHref="#" 
          style={{
            backgroundColor: '#f1f2f3',
            marginTop:'-20px',
        }}>
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
        <h2
          style={{
            color: 'white',
            display: 'flex',
            padding: '5px 0px',
          }}
        >
          {' '}
          Geocoder
        </h2>
      </div>

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
