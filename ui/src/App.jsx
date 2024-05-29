import React, { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import '@cdssnc/gcds-components-react/gcds.css'
import {
  GcdsHeader,
  GcdsFooter,
  GcdsHeading,
} from '@cdssnc/gcds-components-react'
import Layout from './layout/layout'

function MainContent() {
  return (
    <>
         <Layout > 
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

      <main
        id="main-content"
        style={{
          height: '100vh',
        }}
      ></main>
     
</Layout>
    </>
  )
}

export default MainContent
