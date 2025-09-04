import { useTranslation as useI18nTranslation } from 'react-i18next';
import { syncWithAuthLanguage } from '@/i18n/config';
import { useEffect } from 'react';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  useEffect(() => {
    // Sync with auth language on component mount
    syncWithAuthLanguage();
  }, []);
  
  return {
    t,
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language,
    isReady: i18n.isInitialized
  };
};