import {VERSION} from '../constants.js';
import {el} from '../utils.js';
import {t, getLang, setLang} from '../i18n.js';

export function renderSettingsFooter() {
  el('#version').textContent = 'v' + VERSION;
  el('#saveInfo').textContent = t('loaded');
  const sel = el('#optLanguage');
  if (sel && !sel.dataset.init) {
    sel.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = 'en';
    opt.textContent = t('language_en');
    sel.appendChild(opt);
    sel.value = getLang();
    sel.addEventListener('change', e => setLang(e.target.value));
    sel.dataset.init = '1';
  }
}

