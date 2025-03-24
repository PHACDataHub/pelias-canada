import { useEffect, useState } from 'react';
import {
  GcdsButton,
  GcdsHeading,
  GcdsInput,
} from '@cdssnc/gcds-components-react';
import '@cdssnc/gcds-components-react/gcds.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';

ForwardSinglefetch.propTypes = {
  onResponseData: PropTypes.func.isRequired,
};

export default function ForwardSinglefetch({ onResponseData }) {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    province: '',
  });

  const [errors, setErrors] = useState({
    address: '',
    city: '',
    province: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null); // State to store the API response

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validate the current field only
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim()
        ? ''
        : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
    }));
  };

  // Validate form data
  // eslint-disable-next-line no-unused-vars
  const validateForm = () => {
    const newErrors = {};
    if (!formData.address) {
      newErrors.address = t(
        'components.apiFetch.forwardSingleFetch.alerts.address',
      );
    }
    if (!formData.city) {
      newErrors.city = t('components.apiFetch.forwardSingleFetch.alerts.city');
    }
    if (!formData.province) {
      newErrors.province = t(
        'components.apiFetch.forwardSingleFetch.alerts.province',
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Address parsing function with fallback
  const extractApartmentNumber = (address) => {
    const aptPattern1 = /\b\d+\s*-\s*\d+\b/; // Matches patterns like 711 - 3100
    const aptPattern2 = /\b\d+\b/; // Matches standalone numbers like 120

    let match = address.match(aptPattern1);
    let apartmentNumber = '';
    let unitNumber = '';
    let mainAddress = address.trim();
    let streetAddress = '';

    if (match) {
      apartmentNumber = match[0];
      const parts = apartmentNumber.split('-').map((part) => part.trim());
      mainAddress = mainAddress.replace(apartmentNumber, '').trim();
      streetAddress = `${parts[1]} ${mainAddress}`.trim();
      apartmentNumber = {
        firstPart: parts[0],
        secondPart: parts[1],
      };
      unitNumber = parts[0];
    } else {
      match = address.match(aptPattern2);
      if (match) {
        apartmentNumber = match[0];
        mainAddress = mainAddress.replace(apartmentNumber, '').trim();
        streetAddress = `${apartmentNumber} ${mainAddress}`.trim();
        apartmentNumber = {
          firstPart: apartmentNumber,
          secondPart: '',
        };
        unitNumber = apartmentNumber.secondPart;
      }
    }

    // Ensure there is a streetAddress even if there's no apartment number
    streetAddress = streetAddress || mainAddress;
    return { streetAddress, apartmentNumber, unitNumber };
  };

  // Submit form with address validation and API request
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields at once
    const newErrors = {
      address: formData.address.trim()
        ? ''
        : t('components.apiFetch.forwardSingleFetch.alerts.address'),
      city: formData.city.trim()
        ? ''
        : t('components.apiFetch.forwardSingleFetch.alerts.city'),
      province: formData.province.trim()
        ? ''
        : t('components.apiFetch.forwardSingleFetch.alerts.province'),
    };

    setErrors(newErrors);

    // Display toasts only for newly detected errors
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key] && !errors[key]) {
        return;
      }
    });

    // Prevent submission if any errors exist
    if (Object.values(newErrors).some((error) => error)) return;

    const fullAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.province.trim()}`;
    sendRequest(fullAddress);
  };

  // Send request to geocoder API
  const sendRequest = (fullAddress) => {
    setLoading(true);

    const { streetAddress, apartmentNumber, unitNumber } =
      extractApartmentNumber(fullAddress);

    // If no street address is found, use the full address as fallback
    if (!streetAddress) {
      console.warn('No street address found. Using full address:', fullAddress);
    }

    // Fallback URL if no specific street address found
    const url = `https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(streetAddress || fullAddress)}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setResponseData(data);

        // Ensure there are features and check if place_type exists
        if (data.features && data.features.length > 0) {
          const firstFeature = data.features[0];

          // Ensure place_type is an array before calling includes()
          if (
            Array.isArray(firstFeature.place_type) &&
            (firstFeature.place_type.includes('region') ||
              firstFeature.place_type.includes('locality'))
          ) {
            toast.warn(
              t('components.apiFetch.forwardSingleFetch.alerts.moreSpecific'),
            );
          } else {
            const result = {
              ...data,
              apartmentNumber,
              unitNumber,
            };
            onResponseData(result);
          }
        } else {
          toast.error(
            t('components.apiFetch.forwardSingleFetch.alerts.noResults'),
          );
        }
      })

      .catch((error) => {
        console.error('Error:', error);
        toast.error(
          `${t('components.apiFetch.forwardSingleFetch.alerts.error')} ${error}`,
        );
        setLoading(false);
      });
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      address: '',
      city: '',
      province: '',
    });
    setErrors({
      address: '',
      city: '',
      province: '',
    });
    toast.info(t('components.apiFetch.forwardSingleFetch.alerts.formReset'));
  };

  // Reset form when the language changes
  useEffect(() => {
    setFormData({
      address: '',
      city: '',
      province: '',
    });
    setErrors({
      address: '',
      city: '',
      province: '',
    });
  }, [i18n.language]);

  return (
    <div>
      <GcdsHeading tag="h3" characterLimit="false">
        {t('components.apiFetch.forwardSingleFetch.inputHeader')}
      </GcdsHeading>
      <form onSubmit={handleSubmit} key={i18n.language}>
        <br />
        <GcdsInput
          label={t('components.apiFetch.forwardSingleFetch.address')}
          required
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onGcdsChange={handleInputChange}
          lang={i18n.language}
          errorMessage={errors.address}
        />
        <GcdsInput
          label={t('components.apiFetch.forwardSingleFetch.city')}
          required
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onGcdsChange={handleInputChange}
          lang={i18n.language}
          errorMessage={errors.city}
        />
        <GcdsInput
          label={t('components.apiFetch.forwardSingleFetch.province')}
          required
          type="text"
          id="province"
          name="province"
          value={formData.province}
          onGcdsChange={handleInputChange}
          lang={i18n.language}
          errorMessage={errors.province}
        />
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
          }}
        >
          <div>
            <GcdsButton
              type="submit"
              buttonId={t('components.apiFetch.forwardSingleFetch.search')}
              name={t('components.apiFetch.forwardSingleFetch.search')}
            >
              {t('components.apiFetch.forwardSingleFetch.search')}
            </GcdsButton>
          </div>
          <div>
            <GcdsButton
              type="button"
              onClick={handleReset}
              variant="secondary"
              buttonId={t('components.apiFetch.forwardSingleFetch.reset')}
              name={t('components.apiFetch.forwardSingleFetch.reset')}
            >
              {t('components.apiFetch.forwardSingleFetch.reset')}
            </GcdsButton>
          </div>
        </div>
      </form>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-9999px' }}
      >
        {loading && t('loading')}
        {!loading &&
          responseData &&
          t('components.apiFetch.forwardSingleFetch.complete')}
      </div>
      {loading === true ? <Loading /> : null}
      {responseData === true ? 'responseData' : null}
      {/* <pre> 
				{JSON.stringify(responseData, null, 2
					
				)}
			</pre> */}
    </div>
  );
}
