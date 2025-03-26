import { useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  GcdsButton,
  GcdsHeading,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import ReverseBulkInputFile from './ReverseBulkInputFile';
// import ForwardCallAPIReturn from "./ForwardCallAPIReturn"
// import FilteredResultsDisplay from "./FilteredResultsDisplay"
import { useTranslation } from 'react-i18next';
import ReverseCallAPIReturn from './ReverseCallAPIReturn';
import ReturnAmountSelector from './ReturnAmountSelector';
import ReverseResultsDisplay from './ReverseResultsDisplay';

export default function ReverseBulk() {
  const [inputtedData, setInputtedData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [continueStatus, setContinueStatus] = useState(false);
  const childRef = useRef(null);
  const { t } = useTranslation();

  // Const to control the amount returned from API Call -> use state change to match default from ReturnAmountSelector component
  const [itemsPerCall, setItemsPerCall] = useState(5);

  const handleReset = () => {
    setInputtedData([]);
    setFilteredResults([]);
    setContinueStatus(false);
    if (childRef.current) {
      childRef.current.reset();
    }
  };

  const handleButtonClick = () => {
    setContinueStatus(true);
    // Wait for state update and then scroll into view
    setTimeout(() => {
      const element = document.getElementById('results');
      if (element) {
        const yOffset = -50; // Scroll 20px above the element
        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  };

  const handleFilteredResults = useCallback((filteredData) => {
    setFilteredResults(filteredData);
  }, []);

  return (
    <>
      {!continueStatus && (
        <>
          <GcdsHeading tag="h2" characterLimit="false" id="input">
            {t('pages.reverseBulk.inputUpload')}{' '}
          </GcdsHeading>
          <ReverseBulkInputFile ref={childRef} setResults={setInputtedData} />
          {inputtedData.length > 0 && (
            <>
              <GcdsButton
                onClick={handleReset}
                buttonId={t('components.forwardBulk.inputUpload.reset')}
                name={t('components.forwardBulk.inputUpload.reset')}
              >
                {t('components.forwardBulk.inputUpload.reset')}
              </GcdsButton>
              <hr />
              <ReverseCallAPIReturn
                results={inputtedData}
                sendFilteredResults={handleFilteredResults}
              />
              <GcdsText characterLimit="false">
                {t('components.forwardBulk.inputUpload.continuePara')}{' '}
              </GcdsText>
              <ReturnAmountSelector onChange={setItemsPerCall} />
              <GcdsButton
                buttonId={t('components.forwardBulk.inputUpload.continue')}
                name={t('components.forwardBulk.inputUpload.continue')}
                onClick={handleButtonClick}
              >
                {t('components.forwardBulk.inputUpload.continue')}
              </GcdsButton>
            </>
          )}
          <br />
          {continueStatus && (
            <GcdsButton
              buttonId={t('components.forwardBulk.inputUpload.reset')}
              name={t('components.forwardBulk.inputUpload.reset')}
              onClick={handleReset}
            >
              {t('components.forwardBulk.inputUpload.reset')}
            </GcdsButton>
          )}
        </>
      )}
      <br />

      {filteredResults.length > 0 && continueStatus && (
        <ReverseResultsDisplay
          filteredResults={filteredResults}
          itemsPerCall={itemsPerCall}
        />
      )}
    </>
  );
}
