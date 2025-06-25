import { useState, useEffect } from 'react';
import {
  GcdsButton,
  GcdsDetails,
  GcdsHeading,
} from '@cdssnc/gcds-components-react';
import '@cdssnc/gcds-components-react/gcds.css';
import { copyToClipboard } from '../../assets/copyToClipboard.jsx';
import { useTranslation } from 'react-i18next';
import RZipDownload from '../../components/zipDowloads/RZipDownload.jsx';
import CopyNoticeApiPages from './copyNoticeApiPages.jsx'; // Notice component

export default function RShinyAPIPage() {
  const [rForwardCode, setRForwardCode] = useState('');
  const [rReverseCode, setRReverseCode] = useState('');

  const { t } = useTranslation();

  const [copyStatus, setCopyStatus] = useState({
    field: '',
    status: '',
  });

  const handleCopy = (text, field) => {
    if (!text) {
      setCopyStatus({ field, status: 'error' });
      return;
    }

    copyToClipboard(text, () => {
      setCopyStatus({ field, status: 'success' });

      setTimeout(() => {
        setCopyStatus({ field: '', status: '' });
      }, 30000); // clear after 30 seconds
    });
  };

  // Fetch forward R script
  useEffect(() => {
    const fetchRScript = async () => {
      try {
        const response = await fetch(
          '/codeZips/R/forwardGeocode_R_script_v1.r',
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        setRForwardCode(text);
      } catch (error) {
        console.error('Failed to fetch R forward script:', error);
      }
    };
    fetchRScript();
  }, []);

  // Fetch reverse R script
  useEffect(() => {
    const fetchRScript = async () => {
      try {
        const response = await fetch(
          '/codeZips/R/reverseGeocode_R_script_v1.r',
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        setRReverseCode(text);
      } catch (error) {
        console.error('Failed to fetch R reverse script:', error);
      }
    };
    fetchRScript();
  }, []);

  const handleCopyRForward = () => handleCopy(rForwardCode, 'forward');
  const handleCopyRReverse = () => handleCopy(rReverseCode, 'reverse');

  const codeBlockStyles = {
    marginTop: '20px',
    overflowWrap: 'break-word',
    overflowX: 'auto',
  };

  return (
    <>
      <GcdsHeading tag="h1" characterLimit="false">
        {t('pages.rshiny.title')}
      </GcdsHeading>
      <div style={{ overflow: 'auto' }}>
        <p>{t('pages.rshiny.rshinyParagraph')}</p>
      </div>

      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <RZipDownload />
        <br />

        <GcdsDetails detailsTitle={t('pages.rshiny.forwardRDetails')}>
          <div>
            <GcdsButton
              size="small"
              onClick={handleCopyRForward}
              aria-label={t('pages.rshiny.CopyForwardRCode')}
            >
              {t('copyCode')}
            </GcdsButton>
            <CopyNoticeApiPages
              field="forward"
              copyStatus={copyStatus}
              successKey="codeCopied"
              errorKey="codeUnavailable"
            />
          </div>
          <div>
            <pre style={codeBlockStyles}>
              <code
                style={codeBlockStyles}
                aria-label={t('pages.rshiny.forwardRCode')}
              >
                {rForwardCode}
              </code>
            </pre>
          </div>
        </GcdsDetails>

        <br />

        <GcdsDetails detailsTitle={t('pages.rshiny.reverseRDetails')}>
          <div>
            <GcdsButton
              size="small"
              onClick={handleCopyRReverse}
              aria-label={t('pages.rshiny.CopyReverseRCode')}
            >
              {t('copyCode')}
            </GcdsButton>
            <CopyNoticeApiPages
              field="reverse"
              copyStatus={copyStatus}
              successKey="codeCopied"
              errorKey="codeUnavailable"
            />
          </div>
          <pre style={codeBlockStyles}>
            <code
              style={codeBlockStyles}
              aria-label={t('pages.rshiny.reverseRCode')}
            >
              {rReverseCode}
            </code>
          </pre>
        </GcdsDetails>
      </div>
    </>
  );
}
