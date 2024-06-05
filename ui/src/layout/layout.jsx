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
            <GcdsNavLink href="/" slot="home">
              Geocoder
            </GcdsNavLink>
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
          flexGrow: '1',
        }}
      >
        {children}
      </GcdsContainer>
      {/* end Body content */}

      <GcdsFooter
        contextualHeading="Contextual navigation"
      ></GcdsFooter>
    </>
  )
}
