import {VERSION} from '../constants.js';
import {el} from '../utils.js';

export function renderSettingsFooter() {
  el('#version').textContent = 'v' + VERSION;
  el('#saveInfo').textContent = 'Loaded';
}

