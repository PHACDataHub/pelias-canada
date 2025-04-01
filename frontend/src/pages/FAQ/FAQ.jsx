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
  const { i18n, t } = useTranslation();
  const categoryHeadingRef = useRef(null); // Ref for the heading

  const fetchFaqData = useCallback(async () => {
    setLoading(true);
    // Fix for puppeteer that subs "en-US" for "en"
    const fullLang = i18n.language; // e.g., "en-US"
    const shortLang = fullLang.split('-')[0]; // extract just "en"
  
    const filePath = `locales/${shortLang}/FAQ-${shortLang}.csv`;

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

  // Focus the heading when a new category is selected
  useEffect(() => {
    if (categoryHeadingRef.current) {
      categoryHeadingRef.current.focus();
    }
  }, [selectedCategory]);

  return (
    <>
      <GcdsHeading tag="h1" characterLimit="false">
        {t('pages.faq.title')}
      </GcdsHeading>

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
                          selectedCategory === category ? 'true' : undefined
                        }
                        onClick={() => setSelectedCategory(category)}
                        aria-current={
                          selectedCategory === category ? 'true' : undefined
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
              <GcdsHeading
                tag="h3"
                tabIndex="-1" // Makes it focusable for programmatic focus
                ref={categoryHeadingRef} // Attach ref
              >
                {selectedCategory}
                {/* 
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
								
							</span> */}
              </GcdsHeading>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {faqData[selectedCategory].map(
                  ({ Question, Answer }, index) => (
                    <li key={index} style={{ marginBottom: '20px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {Question}
                      </div>
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
