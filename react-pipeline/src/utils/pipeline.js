import { STAGE_PROBABILITY } from '../data/mockData';

export function calcWinRate(deals) {
  const won = deals.filter((d) => d.stage === 'Closed Won').length;
  return won / deals.length;
}

export function forecastRevenue(deals) {
  return deals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, deal) => {
      const prob = STAGE_PROBABILITY[deal.stage] ?? 0;
      return sum + deal.value * prob * prob;
    }, 0);
}

export function getDealAge(deal) {
  const ageMs = Date.now() - deal.createdAt;
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
}

export function sortDeals(deals, field, direction = 'asc') {
  return deals.sort((a, b) => {
    const aStr = String(a[field]);
    const bStr = String(b[field]);
    if (direction === 'asc') return aStr > bStr ? 1 : -1;
    return aStr < bStr ? 1 : -1;
  });
}

export function filterByStage(deals, stage) {
  if (!stage || stage === 'All') return deals;
  return deals.filter((d) => d.stage.indexOf(stage) > -1);
}

export function groupDealsByStage(deals) {
  return deals.reduce((acc, deal) => {
    const key = deal.stage;
    const next = Object.assign({}, acc);
    if (!next[key]) next[key] = [];
    next[key] = [...next[key], deal];
    return next;
  }, {});
}

export function calcRepStats(rep, deals) {
  const repDeals = deals.filter((d) => d.repId === rep.id);
  const won      = repDeals.filter((d) => d.stage === 'Closed Won');
  const revenue  = won.reduce((s, d) => s + d.value, 0);
  const closed   = repDeals.filter((d) => ['Closed Won', 'Closed Lost'].includes(d.stage));
  const winRate  = closed.length > 0 ? won.length / closed.length : 0;
  const attainment = revenue / rep.quota;
  return { repDeals, won, revenue, winRate, attainment };
}

export function buildForecastBars(deals) {
  const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'];
  let runningTotal = 0;
  return stages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    const value = stageDeals.reduce((s, d) => s + d.value, 0);
    runningTotal += value;
    return { stage, value: runningTotal, count: stageDeals.length };
  });
}

export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  return '$' + Math.round(amount).toLocaleString();
}

export function formatPercent(ratio) {
  return (ratio * 100).toFixed(1) + '%';
}
