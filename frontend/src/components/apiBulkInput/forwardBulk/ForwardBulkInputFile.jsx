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
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Colon from '../../../ColonLang';

const ForwardBulkInputFile = forwardRef(({ setResults }, ref) => {
  const { t, i18n } = useTranslation();
  const [results, setInputtedResults] = useState([]); // State for internal results
  const [error, setError] = useState(null); // To store error messages
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

    reader.readAsText(selectedFile);
  };

  const processCSV = (data) => {
    try {
      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const headers = lines[0]
        .split(',')
        .map((header) => header.trim().toLowerCase());

      // Check if required columns exist
      const inputIdIndex = headers.indexOf('inputid');
      const addressIndex = headers.indexOf('physicaladdress');

      if (inputIdIndex === -1 || addressIndex === -1) {
        throw new Error(
          'components.forwardBulk.inputUpload.errors.missingColumns',
        );
      }

      const processedResults = [];
      const errors = [];

      // Process each line in the CSV file (skip the header)
      lines.slice(1).forEach((line, index) => {
        try {
          const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); // Improved CSV parsing
          if (!cols) return;

          const inputID = cols[inputIdIndex]?.trim().replace(/^"|"$/g, '');
          const physicalAddress = cols[addressIndex]
            ?.trim()
            .replace(/^"|"$/g, '');

          // Check for missing fields
          if (!inputID || !physicalAddress) {
            errors.push(
              `Line ${index + 2}: ${t('components.forwardBulk.inputUpload.errors.missingFields')}`,
            );
          } else {
            processedResults.push({ inputID, physicalAddress });
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
    setInputtedResults([]); // Clear results
    setResults([]); // Clear passing results to parent
    setFileName(''); // Clear file name
    setError(null); // Clear errors
    setSubmitted(false);
    setIsFileUploaded(false); // Reset file uploaded state
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
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
            {t('components.forwardBulk.inputUpload.displayFileName')}
            <Colon />
            {fileName}
          </GcdsHeading>
        </>
      )}
    </div>
  );
});
ForwardBulkInputFile.propTypes = {
  setResults: PropTypes.func.isRequired, // Validate setResults as a function
};

export default ForwardBulkInputFile;
