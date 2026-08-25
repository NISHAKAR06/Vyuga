import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';

export type TranslationKeys = typeof en;

export const translations: Record<'en' | 'ta' | 'hi', TranslationKeys> = {
  en,
  ta: ta as TranslationKeys,
  hi: hi as TranslationKeys,
};
