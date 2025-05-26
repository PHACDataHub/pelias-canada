import { Outlet, useLocation } from 'react-router-dom';
import {
  GcdsHeader,
  GcdsContainer,
  GcdsFooter,
  GcdsTopNav,
  GcdsNavLink,
  GcdsNavGroup,
  GcdsLangToggle,
  GcdsBreadcrumbsItem,
  GcdsBreadcrumbs,
} from '@cdssnc/gcds-components-react';
import '@cdssnc/gcds-components-react/gcds.css';
import './Layout.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const [announcement, setAnnouncement] = useState(''); // State for announcements
  const location = useLocation();

  // Set the document title dynamically
  useEffect(() => {
    // You can define the titles for different routes here
    const routeTitles = {
      '/': t('menu.home'),
      '/reverse-geocoding-bulk': t('pages.reverseBulk.title'),
      '/bulk-address-geocoding': t(
        'pages.forwardBulk.BulkGeocodingInput.title',
      ),
      '/r-api': t('pages.rshiny.title'),
      '/python-api': t('pages.python.title'),
      '/frequently-asked-questions': t('pages.faq.title'),
      '/geocoding-results-explanation': t('pages.geocodingExplanation.title'),
      '/contact-us': t('pages.contactUs.title'),
    };

    // Set the title based on the current path
    const currentTitle =
      routeTitles[location.pathname] + ' - Pelias.ca' || 'Pelias.ca';
    document.title = currentTitle;

    // Delay added to allow i18N to translate first before announcing
    const timer = setTimeout(() => {
      setAnnouncement(currentTitle);
    }, 200); // Adjust delay here

    // Clear timeout if component unmounts or announcement changes
    return () => clearTimeout(timer);
  }, [location.pathname, t]);

  const contextualLinks = {
    [t('footer.resultsExplained')]: '/geocoding-results-explanation',
    [t('footer.faq')]: '/frequently-asked-questions',
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toast.dismiss();
    setAnnouncement(
      `${lng === 'fr' ? 'La langue a été changée en français' : 'The language has been changed to English'}`,
    ); // Update announcement
  };

  return (
    <>
      <GcdsHeader
        langHref={i18n.language}
        signatureHasLink="false"
        lang={i18n.language}
        style={{ fontSize: '20px' }}
      >
        <div slot="menu">
          <GcdsTopNav
            label={t('menu.navBar')}
            alignment="right"
            lang={i18n.language}
          >
            <GcdsNavLink href="/" slot="home">
              Pelias
            </GcdsNavLink>
            <GcdsNavGroup
              openTrigger={t('menu.bulkFile')}
              menuLabel={t('menu.bulkFile')}
            >
              <GcdsNavLink
                href="/reverse-geocoding-bulk"
                current={
                  location.pathname === '/reverse-geocoding-bulk'
                    ? true
                    : undefined
                }
              >
                {t('menu.reverseBulkFile')}
              </GcdsNavLink>
              <GcdsNavLink
                href="/bulk-address-geocoding"
                current={
                  location.pathname === '/bulk-address-geocoding'
                    ? true
                    : undefined
                }
              >
                {t('menu.addressBulkFile')}
              </GcdsNavLink>
            </GcdsNavGroup>
            <GcdsNavGroup
              openTrigger={t('menu.developers')}
              menuLabel={t('menu.developers')}
            >
              <GcdsNavLink
                href="/r-api"
                current={location.pathname === '/r-api' ? true : undefined}
              >
                R Api
              </GcdsNavLink>
              <GcdsNavLink
                href="/python-api"
                current={location.pathname === '/python-api' ? true : undefined}
              >
                Python Api
              </GcdsNavLink>
            </GcdsNavGroup>
            <GcdsNavLink
              href="/contact-us"
              current={location.pathname === '/contact-us' ? true : undefined}
            >
              {t('menu.contactUs')}
            </GcdsNavLink>
          </GcdsTopNav>
        </div>
        <div slot="breadcrumb">
          {location.pathname === '/' ? null : (
            <GcdsBreadcrumbs>
              <GcdsBreadcrumbsItem href="/">Pelias</GcdsBreadcrumbsItem>
            </GcdsBreadcrumbs>
          )}
        </div>
        <div
          slot="skip-to-nav"
          style={{
            textAlign: 'center',
            top: '10px',
            left: 0,
            width: '100%',
            zIndex: 3,
          }}
        >
          <a
            className="skip-to-content-link"
            href="#main-content"
            aria-label={t('menu.skipNav')}
          >
            {t('menu.skipNav')}
          </a>
        </div>
        <div slot="toggle">
          <GcdsLangToggle
            href="#"
            lang={i18n.language}
            onClick={(event) => {
              event.preventDefault();
              changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
            }}
          ></GcdsLangToggle>
        </div>
      </GcdsHeader>

      <GcdsContainer
        size={location.pathname === '/' ? 'full' : 'xl'}
        centered
        color="black"
        style={{ flexGrow: '1' }}
        main-container
        id="main-content"
      >
        <Outlet />
      </GcdsContainer>

      {/* Announce the language change */}
      <span
        role="status"
        aria-live="polite"
        tabIndex="-1"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcement}
      </span>

      <GcdsFooter
        lang={i18n.language}
        display="full"
        contextualHeading={t('footer.additionalNav')}
        contextualLinks={contextualLinks}
        style={{ paddingTop: '50px' }}
      />
      <ToastContainer position="top-right" autoClose={false} theme="dark" />
    </>
  );
}
