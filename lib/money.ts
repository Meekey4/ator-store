import type { Lang } from './i18n';
// Prices are stored in fils (1 BHD = 1000 fils).
export const bhd = (fils: number, l: Lang) => {
  const v = (fils / 1000).toFixed(3);
  return l === 'ar' ? `${v} د.ب` : `BD ${v}`;
};
