import CryptoJS from 'crypto-js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { GcdsButton } from '@cdssnc/gcds-components-react';

export default function ForwardExportFiles({ apiResults }) {
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
        '80-99': 0,
        '50-80': 0,
        '30-50': 0,
        '0-30': 0,
      };

      // Process data to count confidence ranges
      apiResults.forEach((result) => {
        const confidenceValue =
          result?.result?.features?.[0]?.properties?.confidence;
        if (confidenceValue !== undefined) {
          const confidence = confidenceValue * 100;
          if (confidence === 100) {
            confidenceCounts['100']++;
          } else if (confidence >= 80) {
            confidenceCounts['80-99']++;
          } else if (confidence >= 50) {
            confidenceCounts['50-80']++;
          } else if (confidence >= 30) {
            confidenceCounts['30-50']++;
          } else {
            confidenceCounts['0-30']++;
          }
        }
      });

      // Generate checksum
      const content = apiResults
        .map((result) => result?.result?.geocoding?.query?.text)
        .join(',');
      const checksum = CryptoJS.MD5(content).toString(CryptoJS.enc.Hex);

      // Create metadata
      const initialMetadata = {
        epochTimestamp,
        checksum,
        timestamp: new Date().toISOString(),
        coordinateSystem: 'WGS 1984',
        accurateMatchScores: confidenceCounts,
        totalRowsProcessed: apiResults.length,
      };

      // Set the metadata state
      setMetadata(initialMetadata);
    };

    // Generate the initial metadata
    generateInitialMetadata();
  }, [apiResults]); // Runs once when apiResults is available

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    const headers = t('components.forwardBulk.forwardExportFiles.csvHeaders');

    const rows = data.map((result, index) => {
      const confidenceValue =
        result?.result?.features?.[0]?.properties?.confidence;
      const confidence =
        confidenceValue !== undefined ? confidenceValue * 100 : 'N/A';

      const rowData = [
        index + 1 || 'N/A', // Index
        `"${result?.result?.geocoding?.query?.text || 'N/A'}"`, // Query (wrapped in quotes)
        result?.result?.features?.[0]?.geometry?.coordinates?.[1] ?? 'N/A', // Latitude
        result?.result?.features?.[0]?.geometry?.coordinates?.[0] ?? 'N/A', // Longitude
        confidence !== 'N/A' ? `${confidence}%` : 'N/A', // Confidence
        result?.result?.features?.[0]?.properties?.match_type || 'N/A', // Match Type
        result?.result?.features?.[0]?.properties?.accuracy || 'N/A', // Accuracy
      ];
      return rowData.join(',');
    });

    return `\uFEFF${headers}\n${rows.join('\n')}`; // Add UTF-8 BOM for proper encoding
  };

  const convertToGeoJSON = (data) => {
    const features = data.map((result) => {
      const confidenceValue =
        result?.result?.features?.[0]?.properties?.confidence;
      const confidence =
        confidenceValue !== undefined ? confidenceValue * 100 : null;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            result?.result?.features?.[0]?.geometry?.coordinates?.[0] ?? null, // Longitude
            result?.result?.features?.[0]?.geometry?.coordinates?.[1] ?? null, // Latitude
          ],
        },
        properties: {
          query: result?.result?.geocoding?.query?.text || 'N/A',
          confidence: confidence,
          matchType:
            result?.result?.features?.[0]?.properties?.match_type || 'N/A',
          accuracy:
            result?.result?.features?.[0]?.properties?.accuracy || 'N/A',
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features: features,
    };
  };

  const handleExportCSV = async () => {
    if (!apiResults || apiResults.length === 0) {
      alert(t('components.forwardBulk.forwardExportFiles.notDataAvail'));

      return;
    }

    if (!metadata) {
      alert(t('components.forwardBulk.forwardExportFiles.metaNotAvail'));
      return;
    }

    // Convert to CSV
    const csvContent = convertToCSV(apiResults);

    const zip = new JSZip();
    zip.file(`data_${metadata.epochTimestamp}.csv`, csvContent);
    zip.file(`${metadata.epochTimestamp}_checksum.md5`, metadata.checksum);
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `data_${metadata.epochTimestamp}_csvData.zip`);
  };

  const handleExportGeoJSON = async () => {
    if (!apiResults || apiResults.length === 0) {
      alert(t('components.forwardBulk.forwardExportFiles.notDataAvail'));
      return;
    }

    if (!metadata) {
      alert(t('components.forwardBulk.forwardExportFiles.metaNotAvail'));
      return;
    }

    // Convert to GeoJSON
    const geoJSONContent = JSON.stringify(
      convertToGeoJSON(apiResults),
      null,
      2,
    );

    const zip = new JSZip();
    zip.file(`data_${metadata.epochTimestamp}.geojson`, geoJSONContent);
    zip.file(`${metadata.epochTimestamp}_checksum.md5`, metadata.checksum);
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `data_${metadata.epochTimestamp}_geojsonFile.zip`);
  };

  return (
    <div>
      <GcdsButton
        onGcdsClick={handleExportCSV}
        buttonId={t(
          'components.forwardBulk.forwardExportFiles.exportDataCSVId',
        )}
        name={t('components.forwardBulk.forwardExportFiles.exportDataCSV')}
      >
        {t('components.forwardBulk.forwardExportFiles.exportDataCSV')}
      </GcdsButton>
      <br />
      <br />
      <GcdsButton
        onGcdsClick={handleExportGeoJSON}
        buttonId={t(
          'components.forwardBulk.forwardExportFiles.exportDataGeoJSONId',
        )}
        name={t('components.forwardBulk.forwardExportFiles.exportDataGeoJSON')}
      >
        {t('components.forwardBulk.forwardExportFiles.exportDataGeoJSON')}
      </GcdsButton>
    </div>
  );
}
