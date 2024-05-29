import React, { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import '@cdssnc/gcds-components-react/gcds.css'
import {
  GcdsHeader,
  GcdsFooter,
  GcdsHeading,
} from '@cdssnc/gcds-components-react'
import Layout from './layout/layout'
import LandingPage from './pages/landingPage/Ladingpage'

function MainContent() {
  return (
    <>
      <LandingPage/>
    </>
  )
}

export default MainContent
