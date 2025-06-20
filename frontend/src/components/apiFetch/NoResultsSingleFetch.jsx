import { GcdsText, GcdsNotice } from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';

export default function NoResultsSingleFetch() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <div role="alert" className="sr-only">
        {t(
          'components.apiFetch.resultSingleFetch.error.noticeText.explanationIntro',
        )}
      </div>
      <GcdsNotice
        type="warning"
        noticeTitleTag="h2"
        noticeTitle={t('components.apiFetch.resultSingleFetch.error.noResults')}
        lang={i18n.language}
      >
        <GcdsText characterLimit="false">
          {t(
            'components.apiFetch.resultSingleFetch.error.noticeText.noResults',
          )}
        </GcdsText>
        <ul>
          <li>
            {t(
              'components.apiFetch.resultSingleFetch.error.noticeText.inWater',
            )}
          </li>
          <li>
            {t(
              'components.apiFetch.resultSingleFetch.error.noticeText.notInCanada',
            )}
          </li>
          <li>
            {t(
              'components.apiFetch.resultSingleFetch.error.noticeText.noNearbyAddress',
            )}
          </li>
          <li>
            {t(
              'components.apiFetch.resultSingleFetch.error.noticeText.notSpecificEnough',
            )}
          </li>
          <li>
            {t(
              'components.apiFetch.resultSingleFetch.error.noticeText.wrongCoordinateSystem',
            )}
          </li>
        </ul>
        <GcdsText size="small" characterLimit="false">
          <em>
            {t(
              'components.apiFetch.resultSingleFetch.error.noticeText.introWithFallback',
            )}
          </em>
        </GcdsText>
      </GcdsNotice>
    </>
  );
}
