import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'; // Add this import

i18n
  .use(HttpBackend)
  .use(LanguageDetector) // Use the language detector
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: false,
    },
    debug: false, // Enable debug mode to see more detailed logs
  });

export default i18n;
