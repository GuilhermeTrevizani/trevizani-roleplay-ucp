import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationPortugueseBrazil from './languages/pt-BR.json';
import translationEnglishUnitedStates from './languages/en-US.json';

export const stringFormat = (str: string, ...args: any[]) =>
  str.replace(/{(\d+)}/g, (match, index) => args[index] || '');

const resources = {
  'pt-BR': {
    translation: translationPortugueseBrazil,
  },
  'en-US': {
    translation: translationEnglishUnitedStates
  }
}

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: process.env.REACT_APP_LANGUAGE
  });

export default i18next;