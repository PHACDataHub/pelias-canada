import { useEffect, useState, useCallback, useRef } from 'react';
import { parse } from 'papaparse';
import {
  GcdsButton,
  GcdsHeading,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSticky, setIsSticky] = useState(true);
  const { t, i18n, ready } = useTranslation();

  const categoryHeadingRef = useRef(null);
  const liveRegionRef = useRef(null);
  const userSelected = useRef(false);

  const fetchFaqData = useCallback(async () => {
    setLoading(true);
    const fullLang = i18n.language;
    const shortLang = fullLang.split('-')[0];
    const filePath = `locales/${shortLang}/FAQ-${shortLang}.csv`;
    // console.log('Fetching FAQ CSV:', filePath);

    try {
      const response = await fetch(filePath);
      const text = await response.text();
      const parsed = parse(text, { header: true }).data;

      const groupedData = parsed.reduce((acc, item) => {
        const category = item.Categories?.trim();
        if (category) {
          acc[category] = acc[category] || [];
          acc[category].push(item);
        }
        return acc;
      }, {});

      setFaqData(groupedData);
      if (Object.keys(groupedData).length > 0) {
        setSelectedCategory(Object.keys(groupedData)[0]);
      }
    } catch (error) {
      console.error('Failed to load FAQ data:', error);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchFaqData();
    i18n.on('languageChanged', fetchFaqData);
    return () => {
      i18n.off('languageChanged', fetchFaqData);
    };
  }, [fetchFaqData, i18n]);

  useEffect(() => {
    const handleResize = () => {
      setIsSticky(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (userSelected.current && categoryHeadingRef.current) {
      categoryHeadingRef.current.focus();
      userSelected.current = false; // Reset the flag after use
    }

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent =
        i18n.language === 'en'
          ? `${selectedCategory} is now displayed`
          : `${selectedCategory} est maintenant affichée`;
    }
  }, [selectedCategory]);

  // Arrow key navigation between FAQ questions
  const handleKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    const headings = Array.from(
      document.querySelectorAll('.faq-content h4[tabindex="0"]'),
    );
    const index = headings.findIndex((el) => el === document.activeElement);

    if (e.key === 'ArrowDown' && index < headings.length - 1) {
      headings[index + 1].focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp' && index > 0) {
      headings[index - 1].focus();
      e.preventDefault();
    }
  };

  return (
    <>
      <GcdsHeading tag="h1" characterLimit="false">
        {t('pages.faq.title')}
      </GcdsHeading>
      {/* <p>{i18n.language} is the current language </p> */}
      <div
        className="faq-container"
        style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
      >
        {/* Side Menu */}
        <nav
          className="sideMenu"
          aria-label={t('tableOfContents')}
          style={{
            flex: '1 1 200px',
            position: isSticky ? 'sticky' : 'static',
            top: 'calc(10vh)',
            maxHeight: isSticky ? 'calc(100vh - 130px)' : 'calc(100vh + 180px)',
            overflowY: 'auto',
            padding: '5px 0px 0 30px',
          }}
        >
          {loading ? (
            <p aria-live="polite">{t('loading')}</p>
          ) : (
            <>
              <GcdsHeading tag="h2">{t('pages.faq.category')}</GcdsHeading>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {faqData &&
                  Object.keys(faqData).map((category) => (
                    <li key={category} style={{ marginBottom: '10px' }}>
                      <GcdsButton
                        buttonRole="primary"
                        size="small"
                        disabled={
                          selectedCategory === category ? true : undefined
                        }
                        onClick={() => {
                          userSelected.current = true;
                          setSelectedCategory(category);
                        }}
                        aria-current={
                          selectedCategory === category ? true : undefined
                        }
                      >
                        {category}
                      </GcdsButton>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </nav>

        {/* FAQ Content */}
        <div
          className="faq-content"
          style={{
            flex: '3 1 600px',
            paddingLeft: '25px',
            borderLeft: '1px solid #ccc',
          }}
        >
          {selectedCategory ? (
            <>
              <div
                ref={categoryHeadingRef}
                tabIndex={-1}
                aria-labelledby="category-heading"
              >
                <GcdsHeading tag="h3" id="category-heading">
                  {selectedCategory}
                </GcdsHeading>
              </div>

              {/* Screen reader live region */}
              <span
                ref={liveRegionRef}
                role="status"
                aria-live="polite"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                }}
              />

              <ul
                style={{ listStyle: 'none', padding: 0 }}
                onKeyDown={handleKeyDown}
              >
                {faqData[selectedCategory].map(
                  ({ Question, Answer }, index) => (
                    <li key={index} style={{ marginBottom: '20px' }}>
                      <GcdsHeading tag="h4" tabIndex={0}>
                        {Question}
                      </GcdsHeading>
                      <GcdsText style={{ margin: 0 }}>{Answer}</GcdsText>
                    </li>
                  ),
                )}
              </ul>
            </>
          ) : (
            <p>{t('selectCategory')}</p>
          )}
        </div>
      </div>
    </>
  );
}

{
  /* 
								announcement of category on selection
								<span
								role="status"
								aria-live="polite"
								tabIndex="-1"
								style={{
									position: "absolute",
									left: "-9999px",
									width: "1px",
									height: "1px",
									overflow: "hidden",
								}}
							>
								{i18n.language === "en" ?  (`${selectedCategory} is now displayed`) :(`${selectedCategory} est maintenant affichée`) }
								
							</span> */
}
