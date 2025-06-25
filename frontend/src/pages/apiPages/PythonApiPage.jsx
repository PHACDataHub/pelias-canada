import { useState, useEffect } from 'react';
import {
  GcdsButton,
  GcdsDetails,
  GcdsHeading,
} from '@cdssnc/gcds-components-react';
import '@cdssnc/gcds-components-react/gcds.css';
import { copyToClipboard } from '../../assets/copyToClipboard.jsx';
import { useTranslation } from 'react-i18next';
import PythonZipDownload from '../../components/zipDowloads/PythonZipDownload.jsx';
import CopyNoticeApiPages from './copyNoticeApiPages.jsx';

export default function PythonAPIPage() {
  const [pythonForwardCode, setPythonForwardCode] = useState('');
  const [pythonReverseCode, setPythonReverseCode] = useState('');

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
      }, 30000); // 30 seconds
    });
  };

  const handleCopyPythonForward = () =>
    handleCopy(pythonForwardCode, 'forward');
  const handleCopyPythonReverse = () =>
    handleCopy(pythonReverseCode, 'reverse');

  const { t } = useTranslation();

  useEffect(() => {
    const fetchRScript = async () => {
      try {
        const response = await fetch(
          '/codeZips/Python/batch_forwardGeocoder_Pelias_v4.py',
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        setPythonForwardCode(text);
      } catch (error) {
        console.error('Failed to fetch Python script:', error);
      }
    };

    fetchRScript();
  }, []);

  useEffect(() => {
    const fetchRScript = async () => {
      try {
        const response = await fetch(
          '/codeZips/Python/batch_reverseGeocoder_Pelias_v4.py',
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        setPythonReverseCode(text);
      } catch (error) {
        console.error('Failed to fetch Python script:', error);
      }
    };

    fetchRScript();
  }, []);

  const codeBlockStyles = {
    marginTop: '20px',
    overflowWrap: 'break-word',
    overflowX: 'auto',
  };

  return (
    <>
      <GcdsHeading tag="h1" characterLimit="false">
        {t('pages.python.title')}
      </GcdsHeading>
      <div style={{ overflow: 'auto' }}>
        <p>{t('pages.python.pythonParagraph')}</p>
      </div>
      <PythonZipDownload />
      <br />

      <GcdsDetails detailsTitle={t('pages.python.forwardPythonDetails')}>
        <div>
          <GcdsButton
            size="small"
            onClick={handleCopyPythonForward}
            aria-label={t('pages.python.CopyForwardPythonCode')}
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
              aria-label={t('pages.python.forwardPythonCode')}
            >
              {pythonForwardCode}
            </code>
          </pre>
        </div>
      </GcdsDetails>
      <br />
      <GcdsDetails detailsTitle={t('pages.python.reversePythonDetails')}>
        <div>
          <GcdsButton
            size="small"
            onClick={handleCopyPythonReverse}
            aria-label={t('pages.python.CopyReversePythonCode')}
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
            aria-label={t('pages.python.reversePythonCode')}
          >
            {pythonReverseCode}
          </code>
        </pre>
      </GcdsDetails>
    </>
  );
}
