import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GcdsDetails,
  GcdsErrorMessage,
  GcdsHeading,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';
import Colon from '../../../ColonLang';

export default function ReverseCallAPIReturn({ results, sendFilteredResults }) {
  const [totalRowsSubmitted, setTotalRowsSubmitted] = useState(0);
  const [parsedResults, setParsedResults] = useState([]);
  const [inputtedResults, setInputtedResults] = useState([]);
  const [invalidResults, setInvalidResults] = useState([]);
  const { t } = useTranslation();

  const LAT_MIN = 41.679999;
  const LAT_MAX = 83.113336;
  const LONG_MIN = -141.001087;
  const LONG_MAX = -52.622111;

  useEffect(() => {
    if (results && results.length > 0) {
      setTotalRowsSubmitted(results.length);
      setInputtedResults(results);

      const validResults = [];
      const invalidResultsList = [];

      results.forEach((result) => {
        const isValid =
          result.ddLat >= LAT_MIN &&
          result.ddLat <= LAT_MAX &&
          result.ddLong >= LONG_MIN &&
          result.ddLong <= LONG_MAX;

        if (isValid) {
          validResults.push({
            inputID: result.inputID,
            ddLat: result.ddLat,
            ddLong: result.ddLong,
          });
        } else {
          invalidResultsList.push(result);
        }
      });

      setParsedResults(validResults);
      setInvalidResults(invalidResultsList);
      sendFilteredResults(validResults);
    }
  }, [results, sendFilteredResults]);

  return (
    <>
      <GcdsHeading tag="h4">
        {t('components.reverseBulk.reverseCallAPIReturn.dataProcessingSummary')}
      </GcdsHeading>
      <GcdsText characterLimit="false">
        {t('components.reverseBulk.reverseCallAPIReturn.dataProcessingPara')}
      </GcdsText>

      <div
        className="summary-container"
        style={{
          background: '#26374a',
          padding: '12px',
          borderRadius: '6px',
          marginTop: '10px',
          color: '#FFFFFF',
        }}
      >
        <GcdsText textRole="light">
          <strong>
            {t('components.reverseBulk.reverseCallAPIReturn.inputLength')}
            <Colon />
          </strong>
          {totalRowsSubmitted}
        </GcdsText>
        <GcdsText textRole="light">
          <strong>
            {t('components.forwardBulk.forwardCallAPIReturn.cleanedLength')}
            <Colon />
          </strong>
          {parsedResults.length}
        </GcdsText>
        <GcdsText textRole="light">
          <strong>
            {t('components.forwardBulk.forwardCallAPIReturn.errorLength')}
            <Colon />
          </strong>
          {invalidResults.length}
        </GcdsText>
      </div>

      <GcdsHeading tag="h4">
        {t('components.reverseBulk.reverseCallAPIReturn.dataReceivedDetails')}
      </GcdsHeading>
      <GcdsDetails
        detailsTitle={t(
          'components.reverseBulk.reverseCallAPIReturn.inputDataDetails',
        )}
      >
        {inputtedResults.length > 0 && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ height: '300px', overflow: 'scroll' }}>
              <GcdsText characterLimit="false">
                <pre>{JSON.stringify(inputtedResults, null, 2)}</pre>
              </GcdsText>
            </div>
          </div>
        )}
      </GcdsDetails>
      <hr></hr>
      <GcdsText characterLimit="false">
        {t('components.reverseBulk.reverseCallAPIReturn.cleanDataPreview')}
      </GcdsText>
      <GcdsDetails
        detailsTitle={t(
          'components.reverseBulk.reverseCallAPIReturn.cleanDataDetails',
        )}
      >
        {parsedResults.length > 0 ? (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ height: '300px', overflow: 'scroll' }}>
              {parsedResults.map((parsedResult) => (
                <div key={parsedResult.inputID}>
                  <ul>
                    <li>
                      <strong>
                        {t(
                          'components.reverseBulk.reverseCallAPIReturn.previewData.inputId',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.inputID}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.reverseBulk.reverseCallAPIReturn.previewData.ddLat',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.ddLat}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.reverseBulk.reverseCallAPIReturn.previewData.ddLong',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.ddLong}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </GcdsDetails>

      {invalidResults.length > 0 && (
        <>
          <hr />
          <GcdsErrorMessage>
            {t('components.reverseBulk.reverseCallAPIReturn.errorPara')}
          </GcdsErrorMessage>
          <GcdsDetails
            detailsTitle={t(
              'components.reverseBulk.reverseCallAPIReturn.errorDataDetails',
            )}
          >
            {invalidResults.length > 0 ? (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ height: '300px', overflow: 'scroll' }}>
                  <GcdsText characterLimit="false">
                    <pre>{JSON.stringify(invalidResults, null, 2)}</pre>
                  </GcdsText>
                </div>
              </div>
            ) : null}
          </GcdsDetails>
        </>
      )}
      <br />
    </>
  );
}

ReverseCallAPIReturn.propTypes = {
  results: PropTypes.array.isRequired,
  sendFilteredResults: PropTypes.func.isRequired,
};
