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

export default function ForwardCallAPIReturn({ results, sendFilteredResults }) {
  const [totalRowsSubmitted, setTotalRowsSubmitted] = useState(0);
  const [parsedResults, setParsedResults] = useState([]);
  const [inputtedResults, setInputtedResults] = useState([]);
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Only run if results are available and changed
    if (results && results.length > 0) {
      setTotalRowsSubmitted(results.length);
      setInputtedResults(results);

      // Parse each result to extract address components
      const breakdownResults = results.map((result) => {
        const addressComponents = parseAddress(result.physicalAddress);
        return { ...result, ...addressComponents };
      });

      setParsedResults(breakdownResults);

      // Filter out results where streetName is null
      const filteredResults = breakdownResults.filter(
        (parsedResult) => parsedResult.streetName !== null,
      );

      // Pass filtered results up to the parent
      sendFilteredResults(filteredResults);
    }
  }, [results, sendFilteredResults]);

  // Function to parse a physical address
  const parseAddress = (address) => {
    let cleanedAddress = address.replace(/"$/, '').trim();

    let apartment = null,
      streetNumber = null,
      streetName = null,
      region = null,
      province = null,
      postalCode = null;

    // Regex to extract postal code
    const postalRegex = /[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/;
    const postalMatch = cleanedAddress.match(postalRegex);
    if (postalMatch) {
      postalCode = postalMatch[0];
      cleanedAddress = cleanedAddress.replace(postalCode, '').trim();
    }

    // Regex for province and region (e.g., QC, ON)
    const provinceRegionRegex = /,\s*([^,]+),\s*([A-Za-z]{2})$/;
    const regionProvinceMatch = cleanedAddress.match(provinceRegionRegex);
    if (regionProvinceMatch) {
      region = regionProvinceMatch[1].trim();
      province = regionProvinceMatch[2].trim();
      cleanedAddress = cleanedAddress
        .replace(regionProvinceMatch[0], '')
        .trim();
    }

    // Handle special cases
    switch (true) {
      case cleanedAddress.startsWith('P.O. Box'):
      case cleanedAddress.startsWith('PO Box'):
      case cleanedAddress.startsWith('Box'):
        streetName = cleanedAddress.trim();
        cleanedAddress = '';
        break;
      case cleanedAddress.startsWith('RR#'):
      case cleanedAddress.startsWith('RR'):
        streetName = cleanedAddress.trim();
        cleanedAddress = '';
        break;
      case /^C\.P\./.test(cleanedAddress):
        streetName = cleanedAddress.trim();
        cleanedAddress = '';
        break;
      case /\b(North|South|East|West)\b/.test(cleanedAddress):
        streetName = cleanedAddress.trim();
        cleanedAddress = '';
        break;
      case /^\d+-\d+/.test(cleanedAddress): {
        const apartmentStreetRegex = /^(\d+)-(\d+)\s+(.+)/;
        const match = cleanedAddress.match(apartmentStreetRegex);
        if (match) {
          apartment = match[1].trim();
          streetNumber = match[2].trim();
          streetName = match[3].trim();
        }
        cleanedAddress = '';
        break;
      }
      case /\b(unité|apt|suite)\s+\d+/.test(cleanedAddress): {
        const unitRegex = /(unité|apt|suite)\s+(\d+)\s*,?\s*(.+)/i;
        const unitMatch = cleanedAddress.match(unitRegex);
        if (unitMatch) {
          apartment = unitMatch[2].trim();
          cleanedAddress = unitMatch[3].trim();
        }
        break;
      }
      case /Concession \d+/.test(cleanedAddress):
      case /Lot \d+/.test(cleanedAddress):
        streetName = cleanedAddress.trim();
        cleanedAddress = '';
        break;
    }

    // Extract street number and name if available
    const streetRegex = /^(\d+),?\s*(.*)/;
    const streetMatch = cleanedAddress.match(streetRegex);
    if (streetMatch) {
      streetNumber = streetMatch[1].trim();
      streetName = streetMatch[2].trim();
    }

    // Construct query string
    const query =
      `${streetNumber ? streetNumber : ''} ${streetName ? streetName : ''}, ${region ? region : ''}, ${province ? province : ''}`.trim();

    return {
      apartment: apartment || null,
      streetNumber: streetNumber || null,
      streetName: streetName || null,
      region: region || null,
      province: province || null,
      postalCode: postalCode || null,
      query,
    };
  };

  // Filter out the items where streetName is null
  const invalidResults = parsedResults.filter(
    (parsedResult) => parsedResult.streetName === null,
  );
  const validResults = parsedResults.filter(
    (parsedResult) => parsedResult.streetName !== null,
  );
  useEffect(() => {
    if (results.length > 0) {
      const timer = setTimeout(() => {
        const msg = t('components.submittedAnnouncement', {
          submitted: totalRowsSubmitted,
          valid: parsedResults.length,
          errors: invalidResults.length,
        });
        setAnnouncement(msg);
      }, 500); // 0.5 second delay

      return () => clearTimeout(timer); // clean up on unmount or change
    }
  }, [
    results,
    totalRowsSubmitted,
    parsedResults.length,
    invalidResults.length,
    t,
  ]);
  return (
    <>
      <GcdsHeading tag="h4" characterLimit="false">
        {t('components.forwardBulk.forwardCallAPIReturn.dataProcessingSummary')}
      </GcdsHeading>
      <GcdsText characterLimit="false">
        {t('components.forwardBulk.forwardCallAPIReturn.dataProcessingPara')}
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
        <div
          aria-live="assertive"
          style={{ position: 'absolute', left: '-9999px' }}
        >
          {announcement}
        </div>
        <GcdsText textRole="light" characterLimit="false">
          <strong>
            {t('components.forwardBulk.forwardCallAPIReturn.inputLength')}
            <Colon />
          </strong>
          {totalRowsSubmitted}
        </GcdsText>
        <GcdsText textRole="light" characterLimit="false">
          <strong>
            {t('components.forwardBulk.forwardCallAPIReturn.cleanedLength')}
            <Colon />
          </strong>
          {validResults.length}
        </GcdsText>
        <GcdsText textRole="light" characterLimit="false">
          <strong>
            {t('components.forwardBulk.forwardCallAPIReturn.errorLength')}
            <Colon />
          </strong>
          {invalidResults.length}
        </GcdsText>
      </div>

      {/* click to view inputted details */}
      <GcdsHeading tag="h4" characterLimit="false">
        {t('components.forwardBulk.forwardCallAPIReturn.dataRecievedDetails')}
      </GcdsHeading>
      <GcdsText characterLimit="false">
        {t(
          'components.forwardBulk.forwardCallAPIReturn.recievedDataJsonPreview',
        )}
      </GcdsText>
      <GcdsDetails
        detailsTitle={t(
          'components.forwardBulk.forwardCallAPIReturn.inputDataDetails',
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
        {t('components.forwardBulk.forwardCallAPIReturn.cleanDataPreview')}
      </GcdsText>
      <GcdsDetails
        detailsTitle={t(
          'components.forwardBulk.forwardCallAPIReturn.cleanDataDetails',
        )}
      >
        {validResults.length > 0 ? (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ height: '300px', overflow: 'scroll' }}>
              {validResults.map((parsedResult) => (
                <div key={parsedResult.inputID}>
                  <ul>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.inputId',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.inputID}
                    </li>

                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.physicalAddress',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.physicalAddress}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.apartment',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.apartment}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.streetNumber',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.streetNumber}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.streetName',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.streetName}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.region',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.region}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.province',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.province}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.postalCode',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.postalCode}
                    </li>
                    <li>
                      <strong>
                        {t(
                          'components.forwardBulk.forwardCallAPIReturn.previewData.query',
                        )}
                        <Colon />
                      </strong>
                      {parsedResult.query}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </GcdsDetails>

      {/* Display results where streetName is null */}
      {invalidResults.length > 0 && (
        <>
          <hr />
          <GcdsErrorMessage>
            {t('components.forwardBulk.forwardCallAPIReturn.errorPara')}
          </GcdsErrorMessage>
          <GcdsDetails
            detailsTitle={t(
              'components.forwardBulk.forwardCallAPIReturn.errorDataDetails',
            )}
          >
            {invalidResults.map((parsedResult) => (
              <GcdsText
                characterLimit="false"
                key={parsedResult.inputID}
              >{`Input ID: ${parsedResult.inputID}, Physical Address: ${parsedResult.physicalAddress}`}</GcdsText>
            ))}
          </GcdsDetails>
        </>
      )}
      <br />
    </>
  );
}

ForwardCallAPIReturn.propTypes = {
  results: PropTypes.array.isRequired,
  sendFilteredResults: PropTypes.func.isRequired,
};
