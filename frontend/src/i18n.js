import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    load: 'languageOnly', // 'en-US' → 'en'
    supportedLngs: ['en', 'fr'],

    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage'],
      lookupWhitelist: ['en', 'fr'], // normalize variants like 'en-US'
    },

    react: {
      useSuspense: false,
    },

    debug: false,
  })
  .then(() => {
    const normalizedLang = i18n.language?.split('-')[0] || 'en';

    // Normalize language if it's a variant (e.g. en-US → en)
    if (normalizedLang !== i18n.language) {
      i18n.changeLanguage(normalizedLang);
    }

    // Optional: force toggle to ensure clean language load
    i18n.changeLanguage('fr')
      .then(() => i18n.changeLanguage('en'))
      .then(() => i18n.changeLanguage(normalizedLang));
  });

export default i18n;
