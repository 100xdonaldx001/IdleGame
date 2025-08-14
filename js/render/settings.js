import {VERSION} from '../constants.js';
import {data, skills} from '../data.js';
import {el} from '../utils.js';

export function renderSettingsFooter() {
  el('#version').textContent = 'v' + VERSION;
  el('#saveInfo').textContent = 'Loaded';
  const cont = el('#optOfflineSkills');
  if (cont) {
    cont.innerHTML = '';
    const sel = new Set(data.meta.offlineSkills || []);
    skills.forEach(s => {
      const lbl = document.createElement('label');
      lbl.style.marginRight = '6px';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = s;
      cb.className = 'optOfflineSkill';
      cb.checked = sel.has(s);
      lbl.append(cb, ' ' + s);
      cont.appendChild(lbl);
    });
  }
}

