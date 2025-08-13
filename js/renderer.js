const renderers = [];

export function registerRenderer(fn) {
  renderers.push(fn);
}

export function renderAll() {
  for (const fn of renderers) fn();
}

import './render/stats.js';
import './render/skills.js';
import './render/overview.js';
import './render/inventory.js';
import './render/equipment.js';
import './render/farm.js';
import './render/upgrades.js';
import './render/achievements.js';
import './render/combat.js';
