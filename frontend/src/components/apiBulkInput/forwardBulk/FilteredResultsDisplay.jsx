/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import Loading from "../../Loading";
import { useTranslation } from "react-i18next";
import ConfidenceTable from "../../tables/ConfidenceTable";
import PaginatedTable from "../../tables/dataTable";

function FilteredResultsDisplay({ filteredResults, triggerApiCall }) {
  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]); // Track individual errors
  const { t } = useTranslation();

  const fetchWithRetry = async (item, maxRetries = 3) => {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch(
          `https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(item.query)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for query: ${item.query}`);
        }

        const data = await response.json();
        return { ...item, apiData: data }; // Return successfully fetched item
      } catch (err) {
        attempts++;
        if (attempts >= maxRetries) {
          return { error: true, query: item.query, errorMessage: err.message };
        }
      }
    }
  };

  const fetchWithRateLimit = async (items, limit = 20) => {
    const results = [];
    const errorsList = [];
    let i = 0;

    while (i < items.length) {
      const batch = items.slice(i, i + limit).map(async (item) => {
        const result = await fetchWithRetry(item); // Fetch with retry
        if (result.error) {
          errorsList.push({ query: result.query, error: result.errorMessage });
          return null; // Return null for failed items
        }
        return result;
      });

      const batchResults = await Promise.all(batch);
      results.push(...batchResults.filter((result) => result !== null)); // Exclude failed items
      i += limit; // Move to the next batch
    }

    return { results, errors: errorsList };
  };

  useEffect(() => {
    if (!triggerApiCall) return; // Wait for the trigger

    const fetchApiResults = async () => {
      setLoading(true);
      setErrors([]); // Reset errors on new API call

      try {
        const { results, errors } = await fetchWithRateLimit(filteredResults, 10); // Adjust limit as needed
        setApiResults(results);
        setErrors(errors); // Save the list of errors
      } catch (err) {
        // In case of unexpected errors
        setErrors([{ query: "General error", error: err.message }]);
      } finally {
        setLoading(false);
      }
    };

    fetchApiResults();
  }, [filteredResults, triggerApiCall]); // Only run when `triggerApiCall` changes to true

  if (loading) {
    return (
      <div>
        <Loading />
        {t("components.forwardBulk.loading")}
      </div>
    );
  }

  return (
    <div>
      <GcdsHeading tag="h2">apiResultsTitle</GcdsHeading>
      <p>.rowsSub : {filteredResults.length}</p>
      <p>rowsReturned : {apiResults.length}</p>

      {/* Display errors if any */}
      {errors.length > 0 && (
        <div>
          <GcdsHeading tag="h3">Errors</GcdsHeading>
          <ul>
            {errors.map((err, index) => (
              <li key={index}>
                Query: {err.query}, Error: {err.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <GcdsHeading tag="h3">results confidence</GcdsHeading>
      {/* Only render ConfidenceTable if apiResults have been successfully fetched */}
      {apiResults.length > 0 ? (
        <ConfidenceTable data={apiResults} />
      ) : (
        <p>noApiResults</p> // Provide fallback message
      )}

      <GcdsHeading tag="h3">results preview</GcdsHeading>
      {apiResults.length > 0 ? (
        <PaginatedTable apiResults={apiResults} />
      ) : (
        <p>noApiResults</p> // Provide fallback message
      )}
    </div>
  );
}

export default FilteredResultsDisplay;
