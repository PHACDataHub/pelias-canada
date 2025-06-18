import PropTypes from 'prop-types';
import {
  GcdsButton,
  GcdsDetails,
  GcdsGrid,
  GcdsHeading,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import MapComponentOL from '../map/MapComponent';
import PercentageCircle from '../PercentageCircle';
import { copyToClipboard } from '../../assets/copyToClipboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import './ResultsMap.css';
import Colon from '../../ColonLang';
import NoResultsSingleFetch from './NoResultsSingleFetch';

export default function SingleFetchResults({
  forwardResponse,
  buttonResponse,
  reverseResponse,
}) {
  const result = forwardResponse || buttonResponse || reverseResponse;
  const { t } = useTranslation();

  const convertTimestamp = (epoch) => {
    const date = new Date(epoch);
    const dateString = date.toLocaleDateString('en-CA'); // 'en-CA' gives us the YYYY/MM/DD format
    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    return `${dateString} ${timeString}`;
  };

  const handleCopyAddress = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error(
        t('components.apiFetch.resultSingleFetch.error.addressUnavailable'),
      );
      return;
    }
    copyToClipboard(result.features[0].properties.label.toString(), () => {
      toast.success(
        t('components.apiFetch.resultSingleFetch.success.addressCopied'),
      );
    });
  };

  const handleCopyLatitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error(
        t('components.apiFetch.resultSingleFetch.error.latitudeUnavailable'),
      );
      return;
    }
    copyToClipboard(
      result.features[0].geometry.coordinates[1].toString(),
      () => {
        toast.success(
          t('components.apiFetch.resultSingleFetch.success.latitudeCopied'),
        );
      },
    );
  };

  const handleCopyLongitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error(
        t('components.apiFetch.resultSingleFetch.error.longitudeUnavailable'),
      );
      return;
    }
    copyToClipboard(
      result.features[0].geometry.coordinates[0].toString(),
      () => {
        toast.success(
          t('components.apiFetch.resultSingleFetch.success.longitudeCopied'),
        );
      },
    );
  };

  const handleCopyLatitudeLongitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error(
        t('components.apiFetch.resultSingleFetch.error.latLongUnavailable'),
      );
      return;
    }
    const latitude = result.features[0].geometry.coordinates[1];
    const longitude = result.features[0].geometry.coordinates[0];
    const latLong = `${latitude}, ${longitude}`;
    copyToClipboard(latLong, () => {
      toast.success(
        t('components.apiFetch.resultSingleFetch.success.latLongCopied'),
      );
    });
  };

  const handleCopyLongitudeLatitude = () => {
    if (!result || !result.features || !result.features[0]) {
      toast.error(
        t('components.apiFetch.resultSingleFetch.error.latLongUnavailable'),
      );
      return;
    }
    const latitude = result.features[0].geometry.coordinates[1];
    const longitude = result.features[0].geometry.coordinates[0];
    const longLat = `${longitude}, ${latitude}`;
    copyToClipboard(longLat, () => {
      toast.success(
        t('components.apiFetch.resultSingleFetch.success.longLatCopied'),
      );
    });
  };

  return (
    <div>
      {/* 
      Uncomment for debugging if responses are not working as intended:
      <p>forwardResponse Response: {JSON.stringify(forwardResponse)}</p>
      <p>buttonResponse Response: {JSON.stringify(buttonResponse)}</p>
      <p>reverseResponse Response: {JSON.stringify(reverseResponse)}</p>
      */}

      {result && result.features && result.features[0] ? (
        <>
          <div role="alert" className="sr-only">
            {t('components.apiFetch.resultSingleFetch.successfulCall')}
          </div>
          <div>
            <GcdsHeading tag="h2" characterLimit="false">
              {t('components.forwardBulk.mapReady.resultsHeader')}
            </GcdsHeading>
            <div style={{ border: '1px solid black', padding: '4px' }}>
              <GcdsHeading tag="h3" characterLimit="false">
                {t('components.apiFetch.resultSingleFetch.infoReturn')}
                <Colon />
              </GcdsHeading>
              <p>
                <strong>
                  {t('components.apiFetch.resultSingleFetch.addressReturn')}
                  <Colon />
                </strong>
                {result.features[0].properties.housenumber !== undefined
                  ? ` ${result.features[0].properties.housenumber + ' '}`
                  : null}
                {result.features[0].properties.street !== undefined
                  ? `${result.features[0].properties.street + ', '}`
                  : null}
                {`${result.features[0].properties.locality}, ${result.features[0].properties.region}`}
              </p>
              <p>
                <strong>
                  {t('components.apiFetch.resultSingleFetch.geoReturn')}
                  <Colon />
                </strong>
                {`${result.features[0].geometry.coordinates[0]}, ${result.features[0].geometry.coordinates[1]}`}
              </p>
              <GcdsGrid
                columns="repeat(auto-fit, minmax(50px, 250px))"
                justifyContent="space-evenly"
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p>
                    {t('components.apiFetch.resultSingleFetch.confidence')}
                    <Colon />
                  </p>
                  {result.features[0]?.properties?.confidence !== undefined ? (
                    <PercentageCircle
                      confidencePercentage={
                        result.features[0].properties.confidence
                      }
                    />
                  ) : null}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p>
                    <strong>
                      {t('components.apiFetch.resultSingleFetch.matchType')}
                      <Colon />
                    </strong>
                    {result.features[0].properties.match_type ||
                      t('components.apiFetch.resultSingleFetch.na')}
                  </p>
                  <p>
                    <strong>
                      {t('components.apiFetch.resultSingleFetch.accuracy')}
                      <Colon />
                    </strong>
                    {result.features[0].properties.accuracy}
                  </p>
                  <p>
                    <strong>
                      {t('components.apiFetch.resultSingleFetch.source')}
                      <Colon />
                    </strong>
                    {result.features[0].properties.source}
                  </p>
                </div>
              </GcdsGrid>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '11px',
                }}
              >
                <i>
                  {t('components.apiFetch.resultSingleFetch.infoVersion')} v
                  {result.geocoding.version}
                </i>
              </div>
            </div>
            <div>
              <p>
                <strong>
                  {t('components.apiFetch.resultSingleFetch.dateTime')}
                  <Colon />
                </strong>
                {convertTimestamp(result.geocoding.timestamp)}
              </p>
            </div>
            <p>
              {t('components.apiFetch.resultSingleFetch.address')}
              <Colon />
              {result.features[0].properties.label}
              <GcdsButton
                buttonRole="secondary"
                buttonId={`${t('copy')} ${t('components.apiFetch.resultSingleFetch.address')}`}
                size="small"
                name={`${t('copy')} ${t('components.apiFetch.resultSingleFetch.address')}`}
                style={{ marginLeft: '10px' }}
                onClick={handleCopyAddress}
              >
                {`${t('copy')} ${t('components.apiFetch.resultSingleFetch.address')}`}
              </GcdsButton>
            </p>
            <p>
              {t('components.apiFetch.resultSingleFetch.longitude')}
              <Colon />
              {result.features[0].geometry.coordinates[0]}
              <GcdsButton
                buttonRole="secondary"
                buttonId={`${t('copy')} Longitude`}
                size="small"
                name={`${t('copy')} Longitude`}
                style={{ marginLeft: '10px' }}
                onClick={handleCopyLongitude}
              >
                {t('copy')}&nbsp;
                {t('components.apiFetch.resultSingleFetch.longitude')}
              </GcdsButton>
            </p>

            <p>
              {t('components.apiFetch.resultSingleFetch.latitude')}
              <Colon />
              {result.features[0].geometry.coordinates[1]}
              <GcdsButton
                buttonRole="secondary"
                buttonId={`${t('copy')} Latitude`}
                size="small"
                name={`${t('copy')} Latitude`}
                style={{ marginLeft: '10px' }}
                onClick={handleCopyLatitude}
              >
                {t('copy')}&nbsp;
                {t('components.apiFetch.resultSingleFetch.latitude')}
              </GcdsButton>
            </p>

            <GcdsDetails
              detailsTitle={`${t('components.apiFetch.resultSingleFetch.seeMoreOpts')}`}
            >
              <p style={{ fontSize: '16px' }}>
                {t('components.apiFetch.resultSingleFetch.longlat')}
                <Colon />
                {result.features[0].geometry.coordinates[0]},
                {result.features[0].geometry.coordinates[1]}
                <GcdsButton
                  buttonRole="secondary"
                  buttonId={`${t('copy')} Longitude Latitude`}
                  size="small"
                  name={`${t('copy')} Longitude Latitude`}
                  style={{ marginLeft: '10px' }}
                  onClick={handleCopyLongitudeLatitude}
                >
                  {`${t('copy')} Longitude Latitude`}
                </GcdsButton>
              </p>

              <p style={{ fontSize: '16px' }}>
                {t('components.apiFetch.resultSingleFetch.latlong')}
                <Colon />
                {result.features[0].geometry.coordinates[1]},
                {result.features[0].geometry.coordinates[0]}
                <GcdsButton
                  buttonRole="secondary"
                  buttonId={`${t('copy')} Latitude Longitude`}
                  size="small"
                  name={`${t('copy')} Latitude Longitude`}
                  style={{ marginLeft: '10px' }}
                  onClick={handleCopyLatitudeLongitude}
                >
                  {`${t('copy')} Latitude Longitude`}
                </GcdsButton>
              </p>
            </GcdsDetails>

            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              <>
                {result?.features?.length > 0 ? (
                  <MapComponentOL
                    mapContentJSON={[
                      `${result.features[0].geometry.coordinates[0]},${result.features[0].geometry.coordinates[1]},${result.features[0].properties.confidence * 100}`,
                    ]}
                  />
                ) : (
                  <NoResultsSingleFetch />
                )}
              </>
            </div>
          </div>
        </>
      ) : null}
      {result && (!result.features || result.features.length === 0) && (
        <>
          <br />
          <NoResultsSingleFetch />
        </>
      )}
    </div>
  );
}

SingleFetchResults.propTypes = {
  forwardResponse: PropTypes.any,
  buttonResponse: PropTypes.any,
  reverseResponse: PropTypes.any,
};
