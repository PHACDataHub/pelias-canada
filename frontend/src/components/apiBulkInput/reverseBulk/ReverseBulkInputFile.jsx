import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
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
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsFileUploaded(true);
      setFileName(file.name || '');
      setError(null);
    } else {
      setIsFileUploaded(false);
    }
  };

  const handleFileUpload = () => {
    const file = fileInputRef.current?.files?.[0] || null;
    if (!file) {
      setError('components.forwardBulk.inputUpload.errors.uploadFileMissing');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let csvData = e.target.result;
        csvData = csvData.replace(/("\s*\n\s*")/g, ' ');
        processCSV(csvData);
      } catch (err) {
        console.error('File reading error:', err);
        setError('components.forwardBulk.inputUpload.errors.fileReadError');
      }
    };

    reader.onerror = () => {
      setError('components.forwardBulk.inputUpload.errors.fileReadFailure');
    };

    reader.readAsText(file);
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
          'components.forwardBulk.inputUpload.errors.missingColumns',
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
              `Line ${index + 2}: ${t('components.forwardBulk.inputUpload.errors.missingFields')}`,
            );
          } else {
            processedResults.push({ inputID, ddLat, ddLong });
          }
        } catch (err) {
          errors.push(
            `Line ${index + 2}: ${t('components.forwardBulk.inputUpload.errors.processingError', { errorMessage: err.message })}`,
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
      setError('components.forwardBulk.inputUpload.errors.missingColumns');
      console.error('CSV processing error:', err);
    }
  };

  const handleReset = () => {
    setInputtedResults([]);
    setResults([]);
    setFileName('');
    setError(null);
    setIsFileUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
  }));

  return (
    <div>
      <div style={{ overflow: 'auto' }}>
        <fieldset>
          <legend>{t('components.forwardBulk.inputUpload.title')}</legend>
          <GcdsFileUploader
            accept=".csv"
            label={t('components.forwardBulk.inputUpload.label')}
            hint={t('components.forwardBulk.inputUpload.hint')}
            uploaderId={t('components.forwardBulk.inputUpload.title')}
            name={t('components.forwardBulk.inputUpload.title')}
            ref={fileInputRef}
            onGcdsChange={handleFileChange}
            errorMessage={error ? t(error) : ''}
            onGcdsRemoveFile={handleReset}
            lang={i18n.language}
            required
          />

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
            {t('components.forwardBulk.inputUpload.displayFileName')}:
            {fileName}
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
