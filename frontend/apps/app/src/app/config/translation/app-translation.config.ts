export const APP_TRANSLATION_CONFIG = {
  languages: [
    {
      enabled: true,
      default: true,
      key: 'es',
      flag: 'es',
      iconName: 'cif-es',
      name: 'Español',
      dateFormat: 'DD/MM/YYYY',
      textDirection: 'ltr',
    },
    {
      enabled: false,
      default: true,
      key: 'en',
      flag: 'en',
      iconName: 'cif-gb',
      name: 'English',
      dateFormat: 'YYYY-MM-DD',
      textDirection: 'ltr',
    },
    {
      enabled: false,
      default: false,
      key: 'sa',
      flag: 'sa',
      iconName: 'cif-sa',
      name: 'Arabian',
      dateFormat: 'DD/MM/YYYY',
      textDirection: 'rtl',
    },
  ],
};
