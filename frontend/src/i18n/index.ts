import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import uk from './locales/uk';
import { i18nConfig } from './config'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    resources: {
      en,
      uk,
    },
  });

export default i18n;