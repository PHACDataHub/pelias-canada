import { useState, useEffect } from 'react';
import {
  GcdsInput,
  GcdsTextarea,
  GcdsButton,
  GcdsHeading,
  GcdsSelect,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';
import Colon from '../../ColonLang';

export default function ContactUs() {
  const { t, i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = (data) => {
    const newErrors = {};
    if (!data.name.trim())
      newErrors.name = t('pages.contactUs.contactUsErrors.name');
    if (!data.email.trim())
      newErrors.email = t('pages.contactUs.contactUsErrors.email');
    else if (!isValidEmail(data.email))
      newErrors.email = t('pages.contactUs.contactUsErrors.email');
    if (!data.subject.trim())
      newErrors.subject = t('pages.contactUs.contactUsErrors.subject');
    if (!data.message.trim())
      newErrors.message = t('pages.contactUs.contactUsErrors.message');
    return newErrors;
  };

  const handleInputChange = (event) => {
    // Gcds components often send event.detail.value and event.target.name might be undefined,
    // so we need to handle both normal and custom event formats.

    // Get the field name - try event.target.name or event.currentTarget.name
    const name = event.target?.name || event.currentTarget?.name;

    // Get the value from event.detail.value (custom event) or event.target.value (normal)
    const value =
      event.detail?.value !== undefined
        ? event.detail.value
        : event.target?.value;

    if (!name) {
      console.warn(
        'handleInputChange: Could not determine input name from event',
        event,
      );
      return;
    }

    // Update form data state
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // console.log('Updated formData:', updated);
      return updated;
    });

    // Revalidate only if form has been submitted once (live validation after submit)
    if (hasSubmitted) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };

        // Validate the changed field only
        if (name === 'name') {
          if (!value.trim())
            newErrors.name = t('pages.contactUs.contactUsErrors.name');
          else delete newErrors.name;
        } else if (name === 'email') {
          if (!value.trim())
            newErrors.email = t('pages.contactUs.contactUsErrors.email');
          else if (!isValidEmail(value))
            newErrors.email = t('pages.contactUs.contactUsErrors.emailFormat');
          else delete newErrors.email;
        } else if (name === 'subject') {
          if (!value.trim())
            newErrors.subject = t('pages.contactUs.contactUsErrors.subject');
          else delete newErrors.subject;
        } else if (name === 'message') {
          if (!value.trim())
            newErrors.message = t('pages.contactUs.contactUsErrors.message');
          else delete newErrors.message;
        }

        // console.log('Live field validation errors:', newErrors);
        return newErrors;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get form values fresh from event.target elements
    const form = event.target;
    const latestFormData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    // error handling console logs
    // console.log('submit button clicked');
    // console.log('Form data on submit:', latestFormData);
    // console.log(errors);

    setFormData(latestFormData); // keep React state in sync

    const newErrors = validate(latestFormData);
    setErrors({});
    setErrors(newErrors);
    setHasSubmitted(true);

    if (Object.keys(newErrors).length === 0) {
      const mailtoLink = `mailto:Geordin.Raganold@hc-sc.gc.ca?subject=${encodeURIComponent(
        latestFormData.subject,
      )}&body=${encodeURIComponent(
        `${t('pages.contactUs.name')}: ${latestFormData.name}\n\n${t(
          'pages.contactUs.email',
        )}: ${latestFormData.email}\n\n${t(
          'pages.contactUs.subject.title',
        )}: ${latestFormData.subject}\n\n${t('pages.contactUs.message')}: ${latestFormData.message}`,
      )}`;

      window.location.href = mailtoLink;
      setSubmitted(true);
    }
  };

  // Clear form and validation on language change
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setSubmitted(false);
    setHasSubmitted(false);
    setErrors({});
  }, [i18n.language]);

  return (
    <>
      <GcdsHeading tag="h1">{t('pages.contactUs.title')}</GcdsHeading>

      {submitted ? (
        <div style={{ padding: '20px', marginTop: '20px' }}>
          <GcdsHeading tag="h2" characterLimit="false">
            {t('pages.contactUs.thankYou.title')}
          </GcdsHeading>
          <p>{t('pages.contactUs.thankYou.message')}</p>
        </div>
      ) : (
        <div>
          <GcdsText characterLimit="false">
            {t('pages.contactUs.subTitle')}
            <Colon />
            <a href="mailto:Geordin.Raganold@hc-sc.gc.ca">
              Geordin.Raganold@hc-sc.gc.ca
            </a>
            .
          </GcdsText>

          <hr style={{ margin: '50px 0' }} />

          <form onSubmit={handleSubmit} key={i18n.language}>
            <GcdsHeading tag="h2" characterLimit="false">
              {t('pages.contactUs.formTitle')}
            </GcdsHeading>

            <br />

            <GcdsInput
              key={`name-${errors.name || ''}`}
              label={t('pages.contactUs.name')}
              required
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onGcdsChange={handleInputChange}
              lang={i18n.language}
              validateOn="other"
              error-message={errors.name}
            />

            <GcdsInput
              key={`email-${errors.email || ''}`}
              label={t('pages.contactUs.email')}
              required
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onGcdsChange={handleInputChange}
              lang={i18n.language}
              validateOn="other"
              error-message={errors.email}
            />

            <GcdsSelect
              key={`subject-${errors.subject || ''}`}
              selectId="select-props"
              label={t('pages.contactUs.subject.title')}
              name="subject"
              hint={t('pages.contactUs.subject.hintMessage')}
              value={formData.subject}
              onGcdsChange={handleInputChange}
              required
              lang={i18n.language}
              validateOn="other"
              error-message={errors.subject}
              aria-label={t('pages.contactUs.subject.hintMessage')}
            >
              <option value="">
                {t('pages.contactUs.subject.selectOption')}
              </option>
              <option value={t('pages.contactUs.subject.feedback')}>
                {t('pages.contactUs.subject.feedback')}
              </option>
              <option value={t('pages.contactUs.subject.bug')}>
                {t('pages.contactUs.subject.bug')}
              </option>
              <option value={t('pages.contactUs.subject.helpOption')}>
                {t('pages.contactUs.subject.helpOption')}
              </option>
              <option value={t('pages.contactUs.subject.inquire')}>
                {t('pages.contactUs.subject.inquire')}
              </option>
              <option value={t('pages.contactUs.subject.followingUp')}>
                {t('pages.contactUs.subject.followingUp')}
              </option>
            </GcdsSelect>

            <GcdsTextarea
              key={`message-${errors.message || ''}`}
              label={t('pages.contactUs.message')}
              required
              id="message"
              name="message"
              value={formData.message}
              onGcdsChange={handleInputChange}
              lang={i18n.language}
              validateOn="other"
              error-message={errors.message}
            />

            <GcdsButton type="submit">
              {t('pages.contactUs.submitButton')}
            </GcdsButton>
          </form>
        </div>
      )}
    </>
  );
}
