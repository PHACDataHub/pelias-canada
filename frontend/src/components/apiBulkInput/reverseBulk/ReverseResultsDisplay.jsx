import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GcdsErrorMessage,
  GcdsText,
  GcdsHeading,
} from '@cdssnc/gcds-components-react';
import ReversePaginatedTable from '../../tables/ReverseDataTable';
import ReverseConfidenceTable from '../../tables/ReverseConfidenceTable';
import Loading from '../../Loading';
import RevMapping from './map/revMap';
import ReverseExportFiles from './ReverseExportFiles';

export default function ReverseResultsDisplay({
  filteredResults,
  itemsPerCall,
}) {
  const [apiResults, setApiResults] = useState([]);
  const [filteredApiResults, setFilteredApiResults] = useState([]); // Excludes single-result IDs
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [singleResultIDs, setSingleResultIDs] = useState([]); // Stores inputIDs with only 1 result
  const { t } = useTranslation();

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
      {loading && (
        <>
          <Loading />
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

      {filteredApiResults.length > 0 && (
        <>
          <GcdsText characterLimit="false">
            <i>{t('components.forwardBulk.callTimes.headerPara')}</i>
          </GcdsText>
          <GcdsHeading tag="h2">
            {t('components.forwardBulk.callTimes.header')}
          </GcdsHeading>
          <GcdsText>
            {t('components.forwardBulk.resultsTable.validRows')}
            {filteredResults.length}
          </GcdsText>
          <GcdsText>
            {t('components.forwardBulk.resultsTable.returnedRows')}:
            {filteredApiResults.length}
          </GcdsText>
          {singleResultIDs.length > 0 && (
            <div>
              <GcdsHeading tag="h3">
                {t('components.reverseBulk.singleResultID.header')}:
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
          <GcdsHeading tag="h3">
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
