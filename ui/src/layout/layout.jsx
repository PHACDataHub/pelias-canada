import {
  GcdsHeader,
  GcdsDateModified,
  GcdsFooter,
  GcdsContainer,
  GcdsHeading,
  GcdsTopNav,
  GcdsNavGroup,
  GcdsNavLink,
} from '@cdssnc/gcds-components-react'
import '@cdssnc/gcds-components-react/gcds.css' // Import the CSS file if necessary
import {dateModified} from "../assets/updateDateModified"


export default function Layout({ children }) {
  return (
    <>
      <GcdsHeader
        // langHref="#"
        skipToHref="#"
        padding="150px"
      >
        {/* 
        Skip Nav for Accesssibility to be added at a later date
        <div slot="skip-to-nav"></div> 
        */}

        {/* start Menu */}
        <div slot="menu">
          <GcdsTopNav label="Top navigation" alignment="right">
            <GcdsNavLink href="#home" slot="home">
              Geocoder
            </GcdsNavLink>
            <GcdsNavLink href="#">What is Geocoder</GcdsNavLink>

            <GcdsNavGroup openTrigger="API Features" menuLabel="API Features">
              <GcdsNavLink href="#">
                How to use our API
              </GcdsNavLink>
              <GcdsNavLink href="#">Rshiny API</GcdsNavLink>
              <GcdsNavLink href="#">Python API</GcdsNavLink>
            </GcdsNavGroup>
            <GcdsNavLink href="#">Bulk File Input</GcdsNavLink>
          </GcdsTopNav>
        </div>
        {/* end Menu */}

      </GcdsHeader>
      {/* start Heading H1 */}
      <GcdsContainer size="xl" centered>
      </GcdsContainer>
      {/* end Heading H1 */}

      {/* start Body content */}
      <GcdsContainer
        size="xl"
        centered
        color="black"
        style={{
          boxSizing: 'border-box',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
        }}
      >
        {children}
      </GcdsContainer>
      {/* end Body content */}

      {/* date-modified (YYYY-MM-DD) */}
      <GcdsDateModified>2024-05-30
 


      </GcdsDateModified>
      <GcdsFooter
        style={{
          flexGrow: '0',
          flexShrink: '0',
        }}
        contextualHeading="Contextual navigation"
      ></GcdsFooter>
    </>
  )
}
