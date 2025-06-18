import { GcdsText, GcdsNotice } from '@cdssnc/gcds-components-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function CopyNoticeApiPages({
  field,
  copyStatus,
  successKey,
  errorKey,
}) {
  const { t, i18n } = useTranslation();

  if (copyStatus.field !== field) return null;

  const status = copyStatus.status;

  if (status === 'success') {
    return (
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
    );
  }

  if (status === 'error') {
    return (
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
    );
  }

  return null;
}

CopyNoticeApiPages.propTypes = {
  field: PropTypes.string.isRequired,
  copyStatus: PropTypes.shape({
    field: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  successKey: PropTypes.string.isRequired,
  errorKey: PropTypes.string.isRequired,
};
