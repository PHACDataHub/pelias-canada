/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { GcdsHeading } from "@cdssnc/gcds-components-react";
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
    for (let attempts = 0; attempts < maxRetries; attempts++) {
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
        if (attempts === maxRetries - 1) {
          return { error: true, query: item.query, errorMessage: err.message };
        }
      }
    }
  };

  const fetchAllConcurrently = async (items, limit = 20) => {
    const results = [];
    const errorsList = [];
    const executing = new Set(); // Track active promises

    for (const item of items) {
      const promise = fetchWithRetry(item).then((result) => {
        if (result.error) {
          errorsList.push({ query: result.query, error: result.errorMessage });
        } else {
          results.push(result);
        }
      });

      executing.add(promise);

      // If we hit the concurrency limit, wait for one promise to complete
      if (executing.size >= limit) {
        await Promise.race(executing);
        executing.delete(promise);
      }
    }

    // Wait for remaining promises
    await Promise.all(executing);

    return { results, errors: errorsList };
  };

  useEffect(() => {
    if (!triggerApiCall) return;

    const fetchApiResults = async () => {
      setLoading(true);
      setErrors([]);

      try {
        const { results, errors } = await fetchAllConcurrently(filteredResults, 20); // Adjust concurrency limit
        setApiResults(results);
        setErrors(errors);
      } catch (err) {
        setErrors([{ query: "General error", error: err.message }]);
      } finally {
        setLoading(false);
      }
    };

    fetchApiResults();
  }, [filteredResults, triggerApiCall]);

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
                Query: {err.query}, Error: {err.errorMessage}
              </li>
            ))}
          </ul>
        </div>
      )}

      <GcdsHeading tag="h3">results confidence</GcdsHeading>
      {apiResults.length > 0 ? (
        <ConfidenceTable data={apiResults} />
      ) : (
        <p>noApiResults</p>
      )}

      <GcdsHeading tag="h3">results preview</GcdsHeading>
      {apiResults.length > 0 ? (
        <PaginatedTable apiResults={apiResults} />
      ) : (
        <p>noApiResults</p>
      )}
    </div>
  );
}

export default FilteredResultsDisplay;
