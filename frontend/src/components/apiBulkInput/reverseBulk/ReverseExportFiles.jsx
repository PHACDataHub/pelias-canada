import CryptoJS from "crypto-js";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { GcdsButton } from "@cdssnc/gcds-components-react";

export default function reverseExportFiles({ filteredApiResults }) {
  const { t } = useTranslation();

  // State to store metadata (epoch, checksum, and timestamp)
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    // This function runs when the component is mounted to generate metadata
    const generateInitialMetadata = () => {
      // Get the current epoch timestamp (Unix timestamp)
      const epochTimestamp = Math.floor(Date.now() / 1000);

      // Initialize confidence count buckets
      const confidenceCounts = {
        100: 0,
        "80-99": 0,
        "50-80": 0,
        "30-50": 0,
        "0-30": 0,
      };

      // Process data to count confidence ranges
      filteredApiResults.forEach((result) => {
        const confidenceValue = result?.features?.[0]?.properties?.confidence;
        if (confidenceValue !== undefined) {
          const confidence = confidenceValue * 100;
          if (confidence === 100) {
            confidenceCounts["100"]++;
          } else if (confidence >= 80) {
            confidenceCounts["80-99"]++;
          } else if (confidence >= 50) {
            confidenceCounts["50-80"]++;
          } else if (confidence >= 30) {
            confidenceCounts["30-50"]++;
          } else {
            confidenceCounts["0-30"]++;
          }
        }
      });

      // Generate checksum
      const content = filteredApiResults
        .map((result) => result?.result?.geocoding?.query?.text)
        .join(",");
      const checksum = CryptoJS.MD5(content).toString(CryptoJS.enc.Hex);

      // Create metadata
      const initialMetadata = {
        epochTimestamp,
        checksum,
        timestamp: new Date().toISOString(),
        coordinateSystem: "WGS 1984",
        accurateMatchScores: confidenceCounts,
        totalRowsProcessed: filteredApiResults.length,
      };

      // Set the metadata state
      setMetadata(initialMetadata);
    };

    // Generate the initial metadata
    generateInitialMetadata();
  }, [filteredApiResults]); // Runs once when filteredApiResults is available

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const headers = t("components.reverseBulk.reverseExportFiles.csvHeaders");

    const rows = data.map((result, index) => {
      const confidenceValue = result?.result?.properties?.confidence;
      const confidence =
        confidenceValue !== undefined ? confidenceValue * 100 : "N/A";

      const rowData = [
        result.inputID || "N/A", // Index
        result.featureIndex + 1 || "N/A",
        `"${result?.result?.properties?.label || "N/A" || "N/A"}"`, // Query (wrapped in quotes)
        result?.result?.geometry?.coordinates?.[1] ?? "N/A", // Latitude
        result?.result?.geometry?.coordinates?.[0] ?? "N/A", // Longitude
        confidence !== "N/A" ? `${confidence}%` : "N/A", // Confidence
        result?.result?.properties?.distance || "N/A", // Match Type
        result?.result?.properties?.accuracy || "N/A", // Accuracy
      ];
      return rowData.join(",");
    });

    return `\uFEFF${headers}\n${rows.join("\n")}`; // Add UTF-8 BOM for proper encoding
  };

  const convertToGeoJSON = (data) => {
    const features = data.map((result) => {
      const confidenceValue =
        result?.result?.features?.[0]?.properties?.confidence;
      const confidence =
        confidenceValue !== undefined ? confidenceValue * 100 : null;

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            result?.result?.geometry?.coordinates?.[0] ?? null, // Longitude
            result?.result?.geometry?.coordinates?.[1] ?? null, // Latitude
          ],
        },
        properties: {
          query: result?.result?.properties?.label || "N/A",
          confidence: confidence,
          matchType: result?.result?.properties?.distance || "N/A",
          accuracy: result?.result?.properties?.accuracy || "N/A",
        },
      };
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  };

  const handleExportCSV = async () => {
    if (!filteredApiResults || filteredApiResults.length === 0) {
      alert(t("components.reverseBulk.reverseExportFiles.notDataAvail"));

      return;
    }

    if (!metadata) {
      alert(t("components.reverseBulk.reverseExportFiles.metaNotAvail"));
      return;
    }

    // Convert to CSV
    const csvContent = convertToCSV(filteredApiResults);

    const zip = new JSZip();
    zip.file(`data_${metadata.epochTimestamp}.csv`, csvContent);
    zip.file(`${metadata.epochTimestamp}_checksum.md5`, metadata.checksum);
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `data_${metadata.epochTimestamp}_csvData.zip`);
  };

  const handleExportGeoJSON = async () => {
    if (!filteredApiResults || filteredApiResults.length === 0) {
      alert(t("components.reverseBulk.reverseExportFiles.notDataAvail"));
      return;
    }

    if (!metadata) {
      alert(t("components.reverseBulk.reverseExportFiles.metaNotAvail"));
      return;
    }

    // Convert to GeoJSON
    const geoJSONContent = JSON.stringify(
      convertToGeoJSON(filteredApiResults),
      null,
      2,
    );

    const zip = new JSZip();
    zip.file(`data_${metadata.epochTimestamp}.geojson`, geoJSONContent);
    zip.file(`${metadata.epochTimestamp}_checksum.md5`, metadata.checksum);
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `data_${metadata.epochTimestamp}_geojsonFile.zip`);
  };

  return (
    <div>
      <GcdsButton
        onGcdsClick={handleExportCSV}
        buttonId={t(
          "components.reverseBulk.reverseExportFiles.exportDataCSVId",
        )}
        name={t("components.reverseBulk.reverseExportFiles.exportDataCSV")}
      >
        {t("components.reverseBulk.reverseExportFiles.exportDataCSV")}
      </GcdsButton>
      <br />
      <br />
      <GcdsButton
        onGcdsClick={handleExportGeoJSON}
        buttonId={t(
          "components.reverseBulk.reverseExportFiles.exportDataGeoJSONId",
        )}
        name={t("components.reverseBulk.reverseExportFiles.exportDataGeoJSON")}
      >
        {t("components.reverseBulk.reverseExportFiles.exportDataGeoJSON")}
      </GcdsButton>
    </div>
  );
}
