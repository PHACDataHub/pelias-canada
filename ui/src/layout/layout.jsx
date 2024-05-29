import {
  GcdsHeader,
  GcdsDateModified,
  GcdsFooter,
  GcdsContainer,
  GcdsHeading,
} from '@cdssnc/gcds-components-react'
import '@cdssnc/gcds-components-react/gcds.css' // Import the CSS file if necessary

export default function Layout({ children }) {
  return (
    <>
      <GcdsHeader></GcdsHeader>
      {/* start Heading H1 */}
      <GcdsContainer size="xl" centered>
        <GcdsHeading tag="h1" marginTop="50" marginBottom="0">
          Geocoder
        </GcdsHeading>
      </GcdsContainer>
      {/* en Heading H1 */}

      {/* start Body content */}
      <GcdsContainer size="xl" centered padding="400" minH="75%" color="black">
        {children}
      </GcdsContainer>
      {/* end Body content */}

      {/* date-modified (YYYY-MM-DD) */}
      <GcdsDateModified>2024-05-29</GcdsDateModified>
      <GcdsFooter
        contextualHeading="Contextual navigation"
        //   contextualLinks='{ "": "#", "Features": "#", "Activity on GC Notify": "#" }'
      ></GcdsFooter>
    </>
  )
}
