import {TICK_MS} from './constants.js';
import {data, nodes, skillModules} from './data.js';
import {stats} from './stats.js';
import {mul} from './helpers.js';
import {helpers} from './progress.js';
import {craftingTick} from './crafting.js';
import {combatTick, drawArena} from './combat.js';
import {checkAchievements} from './achievementCheck.js';
import {save} from './persistence.js';
import {renderStats, renderOverview, renderInventory, renderSkills, renderFarm, renderMarket} from './render.js';
import {el, randInt} from './utils.js';
import {updateMarketPrices} from './market.js';

export function tick(dt) {
  stats.totalTicks++;
  const skill = data.activeSkill; const taskKey = data.skills[skill].task; const node = nodes[skill].find(n => n.key === taskKey);
  if (node) {
    data.skills[skill]._prog = (data.skills[skill]._prog || 0) + dt * (mul.globalSpeed() * mul.skillSpeed(skill) * mul.equipSpeed(skill));
    let need = Array.isArray(node.time) ? data.skills[skill]._need || randInt(node.time[0], node.time[1]) : node.time;
    if (Array.isArray(node.time)) data.skills[skill]._need = need;
    if (data.skills[skill]._prog >= need) {
      data.skills[skill]._prog -= need;
      data.skills[skill]._need = null;
      skillModules[skill].perform(data, node, helpers);
      need = Array.isArray(node.time) ? data.skills[skill]._need || randInt(node.time[0], node.time[1]) : node.time;
      if (Array.isArray(node.time)) data.skills[skill]._need = need;
    }
    const eta = Math.ceil((need - (data.skills[skill]._prog || 0)) / 1000);
    el('#taskETA').textContent = `${skill}: ${node.name} · ${eta}s`;
  } else {
    el('#taskETA').textContent = '—';
  }

  const farm = data.skills.Farming;
  if (farm && farm.plots) {
    farm.plots.forEach(plot => {
      if (!plot.task) return;
      const fNode = nodes.Farming.find(n => n.key === plot.task);
      if (!fNode) return;
      plot._prog = (plot._prog || 0) + dt * (mul.globalSpeed() * mul.skillSpeed('Farming'));
      let need = Array.isArray(fNode.time) ? plot._need || randInt(fNode.time[0], fNode.time[1]) : fNode.time;
      if (Array.isArray(fNode.time)) plot._need = need;
      if (plot._prog >= need) {
        plot._prog -= need;
        plot._need = null;
        skillModules.Farming.perform(data, fNode, helpers);
        need = Array.isArray(fNode.time) ? plot._need || randInt(fNode.time[0], fNode.time[1]) : fNode.time;
        if (Array.isArray(fNode.time)) plot._need = need;
      }
    });
  }

  craftingTick(dt);
  combatTick(dt);
  checkAchievements();

  if (data.meta.debug) { el('#tickInfo').textContent = `t=${stats.totalTicks} q=${data.craftingQueue.length}`; }
  if (data.meta.autosave && stats.totalTicks % Math.floor(30000 / TICK_MS) === 0) save();
  if (stats.totalTicks % Math.floor(2000 / TICK_MS) === 0) {
    renderStats();
    renderOverview();
    renderInventory();
    renderSkills();
  }
  if (stats.totalTicks % Math.floor(1000 / TICK_MS) === 0) {
    renderFarm();
  }
  if (stats.totalTicks % Math.floor(10000 / TICK_MS) === 0) {
    updateMarketPrices();
    renderMarket();
  }
}

let accum = 0; let lastTime = performance.now();
export function loop(now) {
  const dt = now - lastTime; lastTime = now; accum += dt; while (accum >= TICK_MS) { tick(TICK_MS); accum -= TICK_MS; }
  drawArena();
  requestAnimationFrame(loop);
}
