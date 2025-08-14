import {data} from './data.js';

export function listItem(key, price) {
  if ((data.inventory[key] || 0) <= 0) return;
  const entry = data.market[key];
  if (!entry) return;
  const base = entry.base || 1;
  price = Math.max(1, Math.floor(price));
  if (price > base * 100) return;
  data.inventory[key]--;
  data.marketQueue.push({key, price, base});
}

export function processMarket() {
  if (!data.marketQueue.length) return;
  const listing = data.marketQueue[0];
  const chance = Math.min(1, listing.base / listing.price);
  if (Math.random() < chance) {
    data.gold += listing.price;
    data.marketQueue.shift();
  }
}

