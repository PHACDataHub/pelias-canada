import { useState, useEffect, useRef } from 'react';
import {
  GcdsHeading,
  GcdsNotice,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import Loading from '../../Loading';
import { useTranslation } from 'react-i18next';
import ConfidenceTable from '../../tables/ConfidenceTable';
import PaginatedTable from '../../tables/dataTable';
import Mapping from './map/forwardmap';
import ForwardExportFiles from './ForwardExportFiles';
import Colon from '../../../ColonLang';

export default function FilteredResultsDisplay({
  filteredResults,
  triggerApiCall,
}) {
  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time (in seconds)
  const timerRef = useRef(null); // Store interval reference
  const { t } = useTranslation();
  const callEstTime = 0.3258;

  // Estimated API call time based on 0.3058 sec per call
  // added .02 per call for grace period
  const estimatedApiTime = (filteredResults.length * callEstTime).toFixed(2);

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

      const fetchData = async () => {
        const newResults = [];
        for (const item of filteredResults) {
          try {
            const response = await fetch(
              `https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(item.query)}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              },
            );
            const data = await response.json();
            newResults.push({ inputID: item.inputID, result: data });
          } catch (error) {
            console.error(item.query, error);
            newResults.push({ inputID: item.inputID, error: error.message });
            setErrors((prevErrors) => [...prevErrors, error.message]);
          }
        }
        setApiResults(newResults);
        setLoading(false);
      };

      fetchData();
    }
  }, [filteredResults]);

  return (
    <>
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
          {elapsedTime.toFixed(1)}&nbsp;
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
          <GcdsHeading tag="h3" characterLimit="false">
            {t('error')}
          </GcdsHeading>
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

      {apiResults.length > 0 && (
        <>
          <GcdsText characterLimit="false">
            {t('components.forwardBulk.resultsTable.returnedRows')}
            <Colon />
            {apiResults.length}
          </GcdsText>
          <ForwardExportFiles apiResults={apiResults} />
          <Mapping apiResults={apiResults} />
          <GcdsHeading tag="h3" characterLimit="false">
            {t(
              'components.forwardBulk.resultsTable.confidence.confidenceTableHeader',
            )}
          </GcdsHeading>
          <ConfidenceTable apiResults={apiResults} />
          <GcdsHeading tag="h3" characterLimit="false">
            {t('components.forwardBulk.resultsTable.previewResultsHeader')}
          </GcdsHeading>
          <PaginatedTable apiResults={apiResults} />
          <br />
        </>
      )}
    </>
  );
}
