import { GcdsHeading, GcdsText } from '@cdssnc/gcds-components-react';
import { useTranslation } from 'react-i18next';
import IntakeForwardBulk from '../../components/apiBulkInput/forwardBulk/IntakeForwardBulk';

export default function ForwardBulkInput() {
  const { t } = useTranslation();

  return (
    <>
      <GcdsHeading tag="h1">
        {t('pages.forwardBulk.BulkGeocodingInput.title')}
      </GcdsHeading>
      <div>
        <section aria-labelledby="what-is-the-bulk-upload">
          <GcdsHeading
            tag="h2"
            characterLimit="false"
            id="what-is-the-bulk-upload"
          >
            {t('pages.forwardBulk.BulkGeocodingInput.subTitle')}
          </GcdsHeading>
          <GcdsText characterLimit="false">
            {t('pages.forwardBulk.BulkGeocodingInput.description')}
          </GcdsText>
        </section>

        <section aria-labelledby="how-to-use-bulk-input">
          <GcdsHeading
            tag="h3"
            characterLimit="false"
            id="how-to-use-bulk-input"
          >
            {t('pages.forwardBulk.HowToUseBulkInput.title')}
          </GcdsHeading>
          <GcdsText characterLimit="false">
            <i>
              {t('pages.forwardBulk.HowToUseBulkInput.steps.fileRequirement')}
            </i>
          </GcdsText>
          <GcdsText characterLimit="false">
            <ol>
              <li>
                {t(
                  'pages.forwardBulk.HowToUseBulkInput.steps.columnRequirement1',
                )}
                <strong> inputID</strong>
                {t(
                  'pages.forwardBulk.HowToUseBulkInput.steps.columnRequirement2',
                )}
                <strong>physicalAddress</strong>.
              </li>
              <li>
                {t('pages.forwardBulk.HowToUseBulkInput.steps.dataPreparation')}
              </li>
              <li>
                {t('pages.forwardBulk.HowToUseBulkInput.steps.dataSubmission')}
              </li>
              <li>
                {t('pages.forwardBulk.HowToUseBulkInput.steps.apiResponse')}
              </li>
              <li>
                {t('pages.forwardBulk.HowToUseBulkInput.steps.exportOption')}
              </li>
            </ol>
          </GcdsText>
        </section>
      </div>

      <div id="BulkInput">
        <IntakeForwardBulk />
      </div>
    </>
  );
}
