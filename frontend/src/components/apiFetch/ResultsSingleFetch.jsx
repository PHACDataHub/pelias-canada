import PropTypes from 'prop-types';
import {
  GcdsButton,
  GcdsDetails,
  GcdsGrid,
  GcdsHeading,
  GcdsText,
  GcdsNotice,
} from '@cdssnc/gcds-components-react';
import MapComponentOL from '../map/MapComponent';
import PercentageCircle from '../PercentageCircle';
import { copyToClipboard } from '../../assets/copyToClipboard';
import { useTranslation } from 'react-i18next';
import './ResultsMap.css';
import Colon from '../../ColonLang';
import NoResultsSingleFetch from './NoResultsSingleFetch';
import { useState } from 'react';

export default function SingleFetchResults({
  forwardResponse,
  buttonResponse,
  reverseResponse,
}) {
  const result = forwardResponse || buttonResponse || reverseResponse;
  const { t, i18n } = useTranslation();
  const [copyStatus, setCopyStatus] = useState({
    field: '', // e.g. 'address', 'latitude', 'longitude', etc.
    status: '', // 'success', 'error', or ''
  });

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

  const handleCopy = (text, field, errorKey, successKey) => {
    if (!result || !result.features || !result.features[0]) {
      setCopyStatus({ field, status: 'error' });
      return;
    }
    copyToClipboard(text, () => {
      setCopyStatus({ field, status: 'success' });

      // Clear notice after 30 seconds
      setTimeout(() => setCopyStatus({ field: '', status: '' }), 30000);
    });
  };

  const handleCopyAddress = () => {
    const text = result?.features?.[0]?.properties?.label;
    handleCopy(
      text,
      'address',
      'components.apiFetch.resultSingleFetch.error.addressUnavailable',
      'components.apiFetch.resultSingleFetch.success.addressCopied',
    );
  };

  const handleCopyLongitude = () => {
    const text = result?.features?.[0]?.geometry?.coordinates?.[0]?.toString();
    handleCopy(
      text,
      'longitude',
      'components.apiFetch.resultSingleFetch.error.longitudeUnavailable',
      'components.apiFetch.resultSingleFetch.success.longitudeCopied',
    );
  };
  const handleCopyLatitude = () => {
    const text = result?.features?.[0]?.geometry?.coordinates?.[1]?.toString();
    handleCopy(
      text,
      'latitude',
      'components.apiFetch.resultSingleFetch.error.latitudeUnavailable',
      'components.apiFetch.resultSingleFetch.success.latitudeCopied',
    );
  };

  const handleCopyLongitudeLatitude = () => {
    if (!result?.features?.[0]) {
      setCopyStatus({ field: 'longLat', status: 'error' });
      return;
    }
    const lat = result.features[0].geometry.coordinates[1];
    const lon = result.features[0].geometry.coordinates[0];
    const text = `${lon}, ${lat}`;
    handleCopy(
      text,
      'longLat',
      'components.apiFetch.resultSingleFetch.error.latLongUnavailable',
      'components.apiFetch.resultSingleFetch.success.longLatCopied',
    );
  };

  const handleCopyLatitudeLongitude = () => {
    if (!result?.features?.[0]) {
      setCopyStatus({ field: 'latLong', status: 'error' });
      return;
    }
    const lat = result.features[0].geometry.coordinates[1];
    const lon = result.features[0].geometry.coordinates[0];
    const text = `${lat}, ${lon}`;
    handleCopy(
      text,
      'latLong',
      'components.apiFetch.resultSingleFetch.error.latLongUnavailable',
      'components.apiFetch.resultSingleFetch.success.latLongCopied',
    );
  };

  function CopyNotice({ field, copyStatus, successKey, errorKey }) {
    if (copyStatus.field !== field) return null;

    const isSuccess = copyStatus.status === 'success';
    const isError = copyStatus.status === 'error';

    return (
      <>
        <div role="alert" className="sr-only">
          {isSuccess && t(successKey)}
          {isError && t(errorKey)}
        </div>

        {isSuccess && (
          <GcdsNotice
            type="success"
            noticeTitleTag="h4"
            lang={i18n.language}
            noticeTitle={t(successKey)}
          >
            <GcdsText>
              {t('components.apiFetch.resultSingleFetch.timeout')}
            </GcdsText>
          </GcdsNotice>
        )}

        {isError && (
          <GcdsNotice
            type="error"
            noticeTitleTag="h4"
            lang={i18n.language}
            noticeTitle={t(errorKey)}
          >
            <GcdsText>
              {t('components.apiFetch.resultSingleFetch.timeout')}
            </GcdsText>
          </GcdsNotice>
        )}
        <br />
      </>
    );
  }

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
              <GcdsText
                size="small"
                characterLimit="false"
                display="flex"
                marginTop="100"
                marginBottom="100"
              >
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
              </GcdsText>
              <GcdsText
                size="small"
                characterLimit="false"
                display="flex"
                marginTop="100"
                marginBottom="100"
              >
                <strong>
                  {t('components.apiFetch.resultSingleFetch.geoReturn')}
                  <Colon />
                </strong>
                {`${result.features[0].geometry.coordinates[0]}, ${result.features[0].geometry.coordinates[1]}`}
              </GcdsText>
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
                  <GcdsText
                    size="small"
                    characterLimit="false"
                    display="flex"
                    marginTop="100"
                    marginBottom="100"
                  >
                    {t('components.apiFetch.resultSingleFetch.confidence')}
                    <Colon />
                  </GcdsText>
                  {result.features[0]?.properties?.confidence !== undefined ? (
                    <PercentageCircle
                      confidencePercentage={
                        result.features[0].properties.confidence
                      }
                    />
                  ) : null}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <GcdsText
                    size="small"
                    characterLimit="false"
                    display="flex"
                    marginTop="100"
                    marginBottom="100"
                  >
                    <strong>
                      {t('components.apiFetch.resultSingleFetch.matchType')}
                      <Colon />
                    </strong>
                    {result.features[0].properties.match_type ||
                      t('components.apiFetch.resultSingleFetch.na')}
                  </GcdsText>
                  <GcdsText
                    size="small"
                    characterLimit="false"
                    display="flex"
                    marginTop="100"
                    marginBottom="100"
                  >
                    <strong>
                      {t('components.apiFetch.resultSingleFetch.accuracy')}
                      <Colon />
                    </strong>
                    {result.features[0].properties.accuracy}
                  </GcdsText>
                  <GcdsText
                    size="small"
                    characterLimit="false"
                    display="flex"
                    marginTop="100"
                    marginBottom="100"
                  >
                    <strong>
                      {t('components.apiFetch.resultSingleFetch.source')}
                      <Colon />
                    </strong>
                    {result.features[0].properties.source}
                  </GcdsText>
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
              <GcdsText
                size="small"
                characterLimit="false"
                display="flex"
                marginTop="300"
                marginBottom="100"
              >
                <strong>
                  {t('components.apiFetch.resultSingleFetch.dateTime')}
                  <Colon />
                </strong>
                {convertTimestamp(result.geocoding.timestamp)}
              </GcdsText>
            </div>

            {/* Address Start  */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                }}
              >
                <GcdsText
                  size="small"
                  characterLimit="false"
                  display="flex"
                  style={{ alignItems: 'center' }}
                  marginTop="100"
                  marginBottom="100"
                >
                  {t('components.apiFetch.resultSingleFetch.address')}
                  <Colon />
                  {result.features[0].properties.label}
                </GcdsText>

                <GcdsButton
                  buttonRole="secondary"
                  buttonId={`${t('copy')} ${t('components.apiFetch.resultSingleFetch.address')}`}
                  size="small"
                  name={`${t('copy')} ${t('components.apiFetch.resultSingleFetch.address')}`}
                  onClick={handleCopyAddress}
                >
                  {`${t('copy')} ${t('components.apiFetch.resultSingleFetch.address')}`}
                </GcdsButton>
              </div>
              <CopyNotice
                field="address"
                copyStatus={copyStatus}
                successKey="components.apiFetch.resultSingleFetch.success.addressCopied"
                errorKey="components.apiFetch.resultSingleFetch.error.addressUnavailable"
              />
            </div>
            {/* Address end  */}

            {/* Longitude Start  */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                }}
              >
                {/* text */}
                <GcdsText
                  size="small"
                  characterLimit="false"
                  display="flex"
                  marginTop="100"
                  marginBottom="100"
                >
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
                </GcdsText>
              </div>
              <CopyNotice
                field="longitude"
                copyStatus={copyStatus}
                successKey="components.apiFetch.resultSingleFetch.success.longitudeCopied"
                errorKey="components.apiFetch.resultSingleFetch.error.longitudeUnavailable"
              />
            </div>
            {/* Longitude end  */}

            {/* Latitude Start  */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                }}
              >
                {/* text */}
                <GcdsText
                  size="small"
                  characterLimit="false"
                  display="flex"
                  marginTop="100"
                  marginBottom="300"
                >
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
                </GcdsText>
              </div>
              <CopyNotice
                field="latitude"
                copyStatus={copyStatus}
                successKey="components.apiFetch.resultSingleFetch.success.latitudeCopied"
                errorKey="components.apiFetch.resultSingleFetch.error.latitudeUnavailable"
              />
            </div>
            {/* Latitude end  */}

            <GcdsDetails
              detailsTitle={`${t('components.apiFetch.resultSingleFetch.seeMoreOpts')}`}
            >
              {/* Longitude end  */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                  }}
                >
                  {/* text */}
                  <GcdsText
                    size="small"
                    characterLimit="false"
                    display="flex"
                    marginTop="100"
                    marginBottom="100"
                  >
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
                  </GcdsText>
                </div>

                <CopyNotice
                  field="longLat"
                  copyStatus={copyStatus}
                  successKey="components.apiFetch.resultSingleFetch.success.longLatCopied"
                  errorKey="components.apiFetch.resultSingleFetch.error.latLongUnavailable"
                />
              </div>
              {/* Longitude end  */}

              {/* Latitude Start  */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                  }}
                >
                  {/* text */}
                  <GcdsText
                    size="small"
                    characterLimit="false"
                    display="flex"
                    marginTop="100"
                    marginBottom="100"
                  >
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
                  </GcdsText>
                </div>
                <CopyNotice
                  field="latLong"
                  copyStatus={copyStatus}
                  successKey="components.apiFetch.resultSingleFetch.success.latLongCopied"
                  errorKey="components.apiFetch.resultSingleFetch.error.latLongUnavailable"
                />
              </div>
              {/* Latitude end  */}
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
