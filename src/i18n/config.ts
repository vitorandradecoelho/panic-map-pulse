import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguage } from '@/services/auth';

// Import translations
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import esMX from './locales/es-MX.json';

// Language mapping
const languageMap: Record<string, string> = {
  'pt-BR': 'pt',
  'pt': 'pt',
  'en': 'en',
  'en-US': 'en',
  'es': 'es',
  'es-CL': 'es',
  'es-MX': 'es-MX',
  'español': 'es',
  'español-MX': 'es-MX',
  'english': 'en',
  'português': 'pt'
};

// Get the current language from the auth service or fallback to localStorage/browser
const getCurrentLanguage = (): string => {
  try {
    // First try to get from auth service
    const authLanguage = getLanguage();
    if (authLanguage && languageMap[authLanguage]) {
      return languageMap[authLanguage];
    }
    
    // Then try localStorage
    const savedLang = localStorage.getItem('i18n-language');
    if (savedLang && languageMap[savedLang]) {
      return languageMap[savedLang];
    }
    
    // Finally try browser language
    const browserLang = navigator.language;
    if (browserLang && languageMap[browserLang]) {
      return languageMap[browserLang];
    }
    
    return 'pt'; // fallback to Portuguese
  } catch {
    return 'pt'; // fallback to Portuguese
  }
};

// Resources object
const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  'es-MX': { translation: esMX }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getCurrentLanguage(),
    fallbackLng: 'pt',
    
    interpolation: {
      escapeValue: false
    },
    
    // Optional: Add debug in development
    debug: process.env.NODE_ENV === 'development'
  });

// Function to change language dynamically
export const changeLanguage = (language: string) => {
  const mappedLanguage = languageMap[language] || languageMap[language.toLowerCase()] || 'pt';
  localStorage.setItem('i18n-language', language);
  i18n.changeLanguage(mappedLanguage);
};

export const getSupportedLanguages = () => ({
  português: "Português (Brasil)",
  english: "English", 
  español: "Español (Chile)",
  "español-MX": "Español (México)"
});

// Update language when auth service provides a new language
export const syncWithAuthLanguage = () => {
  try {
    const authLanguage = getLanguage();
    if (authLanguage && languageMap[authLanguage] && i18n.language !== languageMap[authLanguage]) {
      i18n.changeLanguage(languageMap[authLanguage]);
    }
  } catch {
    // Auth service not available yet
  }
};

export default i18n;