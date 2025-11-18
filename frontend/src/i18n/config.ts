export const i18nConfig = {
    fallbackLng: 'uk',
    supportedLngs: ['uk', 'en', 'fr'],
    detection: {
      order: ['localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  };  