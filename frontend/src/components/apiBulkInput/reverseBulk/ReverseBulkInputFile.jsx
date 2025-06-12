import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import 'leaflet/dist/leaflet.css';
import {
  GcdsButton,
  GcdsHeading,
  GcdsFileUploader,
} from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const ReverseBulkInputFile = forwardRef(({ setResults }, ref) => {
  const { t, i18n } = useTranslation();
  const [results, setInputtedResults] = useState([]);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setIsFileUploaded(true);
      setFileName(file.name || '');
      setError(null);
      setSelectedFile(file); // store the file
    } else {
      setIsFileUploaded(false);
      setSelectedFile(null);
    }
  };

  const handleFileUpload = () => {
    setSubmitted(true);

    if (!selectedFile) {
      setError('components.reverseBulk.inputUpload.errors.uploadFileMissing');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let csvData = e.target.result;
        csvData = csvData.replace(/("\s*\n\s*")/g, ' '); // Replace newline within quotes with a space
        processCSV(csvData);
      } catch (err) {
        console.error('File reading error:', err);
        setError('components.reverseBulk.inputUpload.errors.fileReadError');
      }
    };

    reader.onerror = () => {
      setError('components.reverseBulk.inputUpload.errors.fileReadFailure');
    };

    reader.readAsText(selectedFile);
  };

  const processCSV = (data) => {
    try {
      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const headers = lines[0]
        .split(',')
        .map((header) => header.trim().toLowerCase());

      const inputIdIndex = headers.indexOf('inputid');
      const latIndex = headers.indexOf('ddlat');
      const longIndex = headers.indexOf('ddlong');

      if (inputIdIndex === -1 || latIndex === -1 || longIndex === -1) {
        throw new Error(
          'components.reverseBulk.inputUpload.errors.missingColumns',
        );
      }

      const processedResults = [];
      const errors = [];

      lines.slice(1).forEach((line, index) => {
        try {
          const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
          if (!cols) return;

          const inputID = cols[inputIdIndex]?.trim().replace(/^"|"$/g, '');
          const ddLat = cols[latIndex]?.trim().replace(/^"|"$/g, '');
          const ddLong = cols[longIndex]?.trim().replace(/^"|"$/g, '');

          if (!inputID || !ddLat || !ddLong) {
            errors.push(
              `Line ${index + 2}: ${t('components.reverseBulk.inputUpload.errors.fileReadError')}`,
            );
          } else {
            processedResults.push({ inputID, ddLat, ddLong });
          }
        } catch (err) {
          errors.push(
            `Line ${index + 2}: ${t('components.reverseBulk.inputUpload.errors.processingError', { errorMessage: err.message })}`,
          );
          console.error(`Error processing line ${index + 2}:`, err);
        }
      });

      if (errors.length > 0) {
        setError(errors.join('\n'));
      } else {
        setResults(processedResults);
        setInputtedResults(processedResults);
      }
    } catch (err) {
      setError('components.reverseBulk.inputUpload.errors.missingColumns');
      console.error('CSV processing error:', err);
    }
  };

  const handleReset = () => {
    setInputtedResults([]);
    setResults([]);
    setFileName('');
    setError(null);
    setIsFileUploaded(false);
    setSubmitted(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
  }));

  useEffect(() => {
    if (!selectedFile && error) {
      setError(null);
    }
  }, [i18n.language]);

  return (
    <div>
      <div style={{ overflow: 'auto' }}>
        <fieldset>
          <legend>{t('components.forwardBulk.inputUpload.title')}</legend>
          <GcdsFileUploader
            accept=".csv"
            label={t('components.forwardBulk.inputUpload.label')}
            hint={t('components.forwardBulk.inputUpload.hint')}
            uploaderId={t('components.forwardBulk.inputUpload.titleID')}
            name={t('components.forwardBulk.inputUpload.title')}
            ref={fileInputRef}
            onGcdsChange={handleFileChange}
            errorMessage={submitted && error ? t(error) : ''} // Display error message here
            onGcdsRemoveFile={handleReset}
            lang={i18n.language}
            // required
          />
          <div
            role="alert"
            aria-live="assertive"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              margin: '-1px',
              border: '0',
              padding: '0',
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              whiteSpace: 'nowrap',
            }}
          >
            {submitted && error ? t(error) : ''}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '185px',
              paddingTop: '20px',
            }}
          >
            <GcdsButton size="small" onClick={handleFileUpload}>
              {t('components.forwardBulk.inputUpload.submit')}
            </GcdsButton>
          </div>
        </fieldset>
      </div>
      {results.length > 0 && (
        <>
          <GcdsHeading tag="h3" characterLimit="false">
            {t('components.forwardBulk.inputUpload.displayFileName')}:{fileName}
          </GcdsHeading>
        </>
      )}
    </div>
  );
});

ReverseBulkInputFile.propTypes = {
  setResults: PropTypes.func.isRequired,
};

export default ReverseBulkInputFile;
