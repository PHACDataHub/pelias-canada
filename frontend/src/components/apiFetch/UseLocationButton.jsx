import {
  GcdsButton,
  GcdsErrorMessage,
  GcdsHeading,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';

export default function UseLocationButton({ ButtonResponseData }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setError('');
  }, [i18n.language]);

  const getLocation = async () => {
    setError('');
    setResult(null);

    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: 'geolocation',
        });
        if (permissionStatus.state === 'denied') {
          const errorMessage = t(
            'components.apiFetch.useLocationButton.error.permissionDenied',
          );
          setError(errorMessage);
          toast.error(
            t(
              'components.apiFetch.useLocationButton.error.permissionDeniedToast',
            ),
          );
          return;
        }
      } catch (err) {
        console.error('Permission query error:', err);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setError(t('components.apiFetch.useLocationButton.error.geoGet'));
    }
  };

  const showPosition = (position) => {
    sendRequest(position.coords.latitude, position.coords.longitude);
  };

  const sendRequest = (latitude, longitude) => {
    setLoading(true);

    setTimeout(() => {
      const url = `https://geocoder.alpha.phac.gc.ca/api/v1/reverse?point.lat=${latitude}&point.lon=${longitude}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          const resultData =
            data.features?.length > 0
              ? { ...data, coordinates: data.features[0].geometry.coordinates }
              : { ...data };
          setResult(resultData);
          ButtonResponseData(resultData);
        })
        .catch((err) => {
          console.error('Error:', err);
          toast.error(
            t('components.apiFetch.useLocationButton.error.unknownError'),
          );
          setLoading(false);
        });
    }, 100); // Delay by 200 milliseconds
  };

  const showError = (error) => {
    setLoading(false);
    let errorMessage = '';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = t(
          'components.apiFetch.useLocationButton.error.permissionDenied',
        );
        toast.error(
          t(
            'components.apiFetch.useLocationButton.error.permissionDeniedToast',
          ),
        );
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = t(
          'components.apiFetch.useLocationButton.error.positionUnavailable',
        );
        break;
      case error.TIMEOUT:
        errorMessage = t('components.apiFetch.useLocationButton.error.timeout');
        break;
      default:
        errorMessage = t(
          'components.apiFetch.useLocationButton.error.unknownError',
        );
    }
    setError(errorMessage);
  };

  return (
    <div
      style={{
        display: 'flex',
        placeItems: 'center',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <GcdsHeading tag="h3" characterLimit="false">
        {/* {t("components.apiFetch.useLocationButton.header")} */}
        {t('components.apiFetch.useLocationButton.header')}
      </GcdsHeading>
      <GcdsText style={{ textAlign: 'center', padding: '0 15px' }}>
        <em>{t('components.apiFetch.useLocationButton.warning')}</em>
      </GcdsText>
      <div>
        {error === '' ? (
          ''
        ) : (
          <GcdsErrorMessage messageId={error}>{error}</GcdsErrorMessage>
        )}
        <GcdsButton
          onClick={getLocation}
          buttonId={t('components.apiFetch.useLocationButton.getLocationID')}
          name={t('components.apiFetch.useLocationButton.getLocation')}
        >
          {t('components.apiFetch.useLocationButton.getLocation')}
        </GcdsButton>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-9999px' }}
      >
        {loading && t('loading')}
        {result && t('components.apiFetch.forwardSingleFetch.complete')}
      </div>

      {loading && <Loading loading={loading} />}
    </div>
  );
}

UseLocationButton.propTypes = {
  ButtonResponseData: PropTypes.func.isRequired,
};
