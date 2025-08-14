import en from './i18n/en.js';

const dictionaries = {en};
let currentLang = 'en';
let dict = en;

export function t(key, ...args) {
  let str = dict[key] || key;
  args.forEach((a, i) => str = str.replace(`{${i}}`, a));
  return str;
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (key) el.innerHTML = t(key);
  });
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    if (key) el.title = t(key);
  });
}

export function setLang(lang) {
  currentLang = dictionaries[lang] ? lang : 'en';
  dict = dictionaries[currentLang];
  localStorage.setItem('lang', currentLang);
  applyI18n();
}

export function getLang() {
  return currentLang;
}

export function initI18n() {
  const stored = localStorage.getItem('lang');
  if (stored && dictionaries[stored]) currentLang = stored;
  dict = dictionaries[currentLang];
}
