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
      {/* end Heading H1 */}

      {/* start Body content */}
      <GcdsContainer 
        size="xl" 
        centered 
        padding="500" 
        color="black" 
        style={{
          minHeight: '100%',
        }}
      >
        {children}
      </GcdsContainer>
      {/* end Body content */}

      {/* date-modified (YYYY-MM-DD) */}
      <GcdsDateModified>2024-05-29</GcdsDateModified>
      <GcdsFooter 
        style={{
          marginTop: 'auto'
        }}
        contextualHeading="Contextual navigation" 
      >
      </GcdsFooter>
    </>
  )
}
  
