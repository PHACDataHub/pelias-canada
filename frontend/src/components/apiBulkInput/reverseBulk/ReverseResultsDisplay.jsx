import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GcdsErrorMessage,
  GcdsText,
  GcdsHeading,
  GcdsNotice,
} from '@cdssnc/gcds-components-react';
import ReversePaginatedTable from '../../tables/ReverseDataTable';
import ReverseConfidenceTable from '../../tables/ReverseConfidenceTable';
import Loading from '../../Loading';
import RevMapping from './map/revMap';
import ReverseExportFiles from './ReverseExportFiles';
import Colon from '../../../ColonLang';

export default function ReverseResultsDisplay({
  filteredResults,
  itemsPerCall,
}) {
  const [apiResults, setApiResults] = useState([]);
  const [filteredApiResults, setFilteredApiResults] = useState([]); // Excludes single-result IDs
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [singleResultIDs, setSingleResultIDs] = useState([]); // Stores inputIDs with only 1 result
  const { t } = useTranslation();

  const timerRef = useRef(null); // Store interval reference

  const callEstTime = 0.3258;
  // Estimated API call time based on 0.3058 sec per call
  // added .02 per call for grace period
  const estimatedApiTime = (filteredResults.length * callEstTime).toFixed(2);
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time (in seconds)

  useEffect(() => {
    if (loading) {
      setElapsedTime(0); // Reset timer when loading starts
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 0.01); // Increment by 10ms (0.01 sec)
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current); // Stop timer when loading ends
      timerRef.current = null;
    }

    // Cleanup function to clear interval on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  useEffect(() => {
    if (filteredResults && filteredResults.length > 0) {
      setLoading(true);
      setErrors([]);
      setSingleResultIDs([]); // Reset single result tracker

      const fetchData = async () => {
        const newResults = [];
        const singleIDs = new Set(); // Use Set to track unique inputIDs with only 1 result

        for (const item of filteredResults) {
          const { ddLat, ddLong, inputID } = item;

          try {
            const url = `https://geocoder.alpha.phac.gc.ca/api/v1/reverse?point.lat=${ddLat}&point.lon=${ddLong}&size=${itemsPerCall}`;
            const response = await fetch(url, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (data && data.features) {
              if (data.features.length === 1) {
                singleIDs.add(inputID); // Track inputID if only 1 result
              } else {
                data.features.forEach((feature, index) => {
                  newResults.push({
                    inputID,
                    result: feature,
                    featureIndex: index,
                  });
                });
              }
            } else {
              newResults.push({ inputID, result: 'No results found' });
            }
          } catch (error) {
            console.error(`Error with reverse lookup for ${inputID}:`, error);
            newResults.push({ inputID, error: error.message });
            setErrors((prevErrors) => [...prevErrors, error.message]);
          }
        }

        setApiResults(newResults);
        setSingleResultIDs(Array.from(singleIDs)); // Convert Set to Array
        setFilteredApiResults(
          newResults.filter((item) => !singleIDs.has(item.inputID)),
        ); // Remove single-result inputIDs
        setLoading(false);
      };

      fetchData();
    }
  }, [filteredResults, itemsPerCall]);

  return (
    <div>
      <GcdsText characterLimit="false">
        <i>{t('components.forwardBulk.callTimes.headerPara')}</i>
      </GcdsText>
      <GcdsHeading tag="h2" characterLimit="false">
        {t('components.forwardBulk.callTimes.header')}
      </GcdsHeading>
      <GcdsNotice
        type="info"
        noticeTitleTag="h3"
        noticeTitle={t('timeEst')}
        characterLimit="false"
      >
        <GcdsText characterLimit="false">
          <i>
            {t('components.forwardBulk.callTimes.estSingle1')} {callEstTime}
            &nbsp;
            {t('components.forwardBulk.callTimes.estSingle2')}
          </i>
        </GcdsText>
        <GcdsText characterLimit="false">
          {t('components.forwardBulk.callTimes.estCallTime1')}
          {filteredResults.length}
          {t('components.forwardBulk.callTimes.estCallTime2')}
          <Colon />
          {estimatedApiTime}
          &nbsp;
          {t('components.forwardBulk.callTimes.seconds')}
        </GcdsText>
        <GcdsText characterLimit="false">
          {t('components.forwardBulk.callTimes.realTime')}
          <Colon />
          {elapsedTime.toFixed(1)}
          &nbsp;
          {t('components.forwardBulk.callTimes.seconds')}
        </GcdsText>
      </GcdsNotice>
      <br />
      {loading && (
        <>
          <Loading loading={loading} />
          <div className="sr-only" role="status" aria-live="assertive">
            {t('loading')}
          </div>
          <br />
        </>
      )}

      {errors.length > 0 && (
        <div role="alert" aria-live="assertive">
          <GcdsHeading tag="h3">{t('error')}</GcdsHeading>
          <ul role="list">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <GcdsText characterLimit="false">
        {t('components.forwardBulk.resultsTable.validRows')}
        <Colon />
        {filteredResults.length}
      </GcdsText>
      {filteredApiResults.length > 0 && (
        <>
          <GcdsText characterLimit="false">
            {t('components.forwardBulk.resultsTable.returnedRows')}
            <Colon />
            {filteredApiResults.length}
          </GcdsText>
          {singleResultIDs.length > 0 && (
            <div>
              <GcdsHeading tag="h3">
                {t('components.reverseBulk.singleResultID.header')}
                <Colon />
              </GcdsHeading>
              <ul>
                {singleResultIDs.map((id, index) => (
                  <li key={index}>{id}</li>
                ))}
              </ul>
              <GcdsErrorMessage>
                {t('components.reverseBulk.singleResultID.errorMess')}
              </GcdsErrorMessage>
            </div>
          )}
          <ReverseExportFiles filteredApiResults={filteredApiResults} />
          <RevMapping
            filteredApiResults={filteredApiResults}
            originalPoints={filteredResults}
          />
          <GcdsHeading tag="h3" characterLimit="false">
            {t(
              'components.forwardBulk.resultsTable.confidence.confidenceTableHeader',
            )}
          </GcdsHeading>
          <ReverseConfidenceTable apiResults={filteredApiResults} />
          <GcdsHeading tag="h3">
            {t('components.forwardBulk.resultsTable.previewResultsHeader')}
          </GcdsHeading>
          <ReversePaginatedTable apiResults={filteredApiResults} />
        </>
      )}
    </div>
  );
}
