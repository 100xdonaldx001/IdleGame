import {data} from './data.js';

export function buyItem(key) {
  const entry = data.market[key];
  if (!entry || entry.stock <= 0) return;
  if (data.gold < entry.price) return;
  data.gold -= entry.price;
  data.inventory[key] = (data.inventory[key] || 0) + 1;
  entry.stock--;
}

export function sellItem(key) {
  if ((data.inventory[key] || 0) <= 0) return;
  const entry = data.market[key];
  if (!entry) return;
  data.gold += entry.price;
  data.inventory[key]--;
  entry.stock++;
}

export function updateMarketPrices() {
  Object.values(data.market).forEach(it => {
    const delta = Math.random() < 0.5 ? -1 : 1;
    it.price = Math.max(1, it.price + delta);
  });
}
