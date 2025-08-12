export const stats = { slimeKills: 0, fightsWon: 0, totalTicks: 0 };
export function getStat(key) {
  return Number(stats[key] || 0);
}
