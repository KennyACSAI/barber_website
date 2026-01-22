import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import it from './locales/it.json';

const savedLanguage = localStorage.getItem('language') || 'it';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it }
    },
    lng: savedLanguage,
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
