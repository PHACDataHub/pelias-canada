/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GcdsButton, GcdsDetails, GcdsErrorMessage, GcdsText } from "@cdssnc/gcds-components-react";

export default function ForwardCallAPIReturn({ results, sendFilteredResults }) {
  const [totalRowsSubmitted, setTotalRowsSubmitted] = useState(0);
  const [parsedResults, setParsedResults] = useState([]);
  const [inputtedResults, setInputtedResults] = useState([]);

  useEffect(() => {
    // Only run if results are available and changed
    if (results && results.length > 0) {
      setTotalRowsSubmitted(results.length);
      setInputtedResults(results);

      // Parse each result to extract address components
      const breakdownResults = results.map(result => {
        const addressComponents = parseAddress(result.physicalAddress);
        return { ...result, ...addressComponents };
      });

      setParsedResults(breakdownResults);

      // Filter out results where streetName is null
      const filteredResults = breakdownResults.filter(parsedResult => parsedResult.streetName !== null);

      // Pass filtered results up to the parent
      sendFilteredResults(filteredResults);
    }
  }, [results, sendFilteredResults]);

  // Function to parse a physical address
  const parseAddress = address => {
    let cleanedAddress = address.replace(/"$/, "").trim();

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
      cleanedAddress = cleanedAddress.replace(postalCode, "").trim();
    }

    // Regex for province and region (e.g., QC, ON)
    const provinceRegionRegex = /,\s*([^,]+),\s*([A-Za-z]{2})$/;
    const regionProvinceMatch = cleanedAddress.match(provinceRegionRegex);
    if (regionProvinceMatch) {
      region = regionProvinceMatch[1].trim();
      province = regionProvinceMatch[2].trim();
      cleanedAddress = cleanedAddress.replace(regionProvinceMatch[0], "").trim();
    }

    // Handle special cases
    switch (true) {
      case cleanedAddress.startsWith("P.O. Box"):
      case cleanedAddress.startsWith("PO Box"):
      case cleanedAddress.startsWith("Box"):
        streetName = cleanedAddress.trim();
        cleanedAddress = "";
        break;
      case cleanedAddress.startsWith("RR#"):
      case cleanedAddress.startsWith("RR"):
        streetName = cleanedAddress.trim();
        cleanedAddress = "";
        break;
      case /^C\.P\./.test(cleanedAddress):
        streetName = cleanedAddress.trim();
        cleanedAddress = "";
        break;
      case /\b(North|South|East|West)\b/.test(cleanedAddress):
        streetName = cleanedAddress.trim();
        cleanedAddress = "";
        break;
      case /^\d+-\d+/.test(cleanedAddress): {
        const apartmentStreetRegex = /^(\d+)-(\d+)\s+(.+)/;
        const match = cleanedAddress.match(apartmentStreetRegex);
        if (match) {
          apartment = match[1].trim();
          streetNumber = match[2].trim();
          streetName = match[3].trim();
        }
        cleanedAddress = "";
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
        cleanedAddress = "";
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
    const query = `${streetNumber ? streetNumber : ""} ${streetName ? streetName : ""}, ${region ? region : ""}, ${province ? province : ""}`.trim();

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
  const invalidResults = parsedResults.filter(parsedResult => parsedResult.streetName === null);
  const validResults = parsedResults.filter(parsedResult => parsedResult.streetName !== null);

  return (
    <>
      <p>Input length: {totalRowsSubmitted}</p>
      <p>Cleaned length: {validResults.length}</p>
      <p>Number of errors: {invalidResults.length}</p>

      <GcdsDetails detailsTitle="click to view inputted details">
        {inputtedResults.length > 0 && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ height: "300px", overflow: "scroll" }}>
              <GcdsText>
                <pre>{JSON.stringify(inputtedResults, null, 2)}</pre>
              </GcdsText>
            </div>
          </div>
        )}
      </GcdsDetails>

      <GcdsDetails detailsTitle="click to preview cleaned data">
        {validResults.length > 0 ? (
          <div style={{ overflow: "hidden" }}>
            <div style={{ height: "300px", overflow: "scroll" }}>
              {validResults.map(parsedResult => (
                <div key={parsedResult.inputID}>
                  <ul>
                    <li>
                      <strong>Input ID:</strong> {parsedResult.inputID}
                    </li>
                    <li>
                      <strong>Physical Address:</strong> {parsedResult.physicalAddress}
                    </li>
                    <li>
                      <strong>Apartment:</strong> {parsedResult.apartment}
                    </li>
                    <li>
                      <strong>Street Number:</strong> {parsedResult.streetNumber}
                    </li>
                    <li>
                      <strong>Street Name:</strong> {parsedResult.streetName}
                    </li>
                    <li>
                      <strong>Region:</strong> {parsedResult.region}
                    </li>
                    <li>
                      <strong>Province:</strong> {parsedResult.province}
                    </li>
                    <li>
                      <strong>Postal Code:</strong> {parsedResult.postalCode}
                    </li>
                    <li>
                      <strong>Query:</strong> {parsedResult.query}
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
          <p>Addresses with errors that will not be included:</p>
          <GcdsErrorMessage>data cleaning error - likely due to unit number or inaccurate address</GcdsErrorMessage>
          <p>Before continuing, please review the addresses below as they will NOT be included in the next part of the process.</p>
          <GcdsDetails detailsTitle="click to preview errors">
            {invalidResults.map(parsedResult => (
              <GcdsText key={parsedResult.inputID}>{`Input ID: ${parsedResult.inputID}, Physical Address: ${parsedResult.physicalAddress}`}</GcdsText>
            ))}
          </GcdsDetails>
        </>
      )}
    </>
  );
}

ForwardCallAPIReturn.propTypes = {
  results: PropTypes.array.isRequired,
  sendFilteredResults: PropTypes.func.isRequired,
};
