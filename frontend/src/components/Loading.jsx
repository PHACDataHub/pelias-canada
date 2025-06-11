import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Loading({ loading }) {
  const { t } = useTranslation();
  const hasMounted = useRef(false);
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // skip initial render
    }

    if (loading) {
      setAnnounce(t('loading'));
    } else {
      setAnnounce(t('complete'));
    }
  }, [loading, t]);

  return (
    <div>
      <style>
        {`
          .loader {
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid blue;
            border-bottom: 16px solid blue;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            margin-top: 10px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {loading && (
        <>
          <div className="loader" aria-hidden="true"></div>
          <p>{t('loading')}</p>
        </>
      )}
      <div className="sr-only" role="status" aria-live="assertive">
        {announce}
      </div>
    </div>
  );
}
