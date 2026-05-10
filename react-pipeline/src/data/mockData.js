export const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export const STAGE_PROBABILITY = {
  Prospecting:   0.1,
  Qualification: 0.25,
  Proposal:      0.45,
  Negotiation:   0.75,
  'Closed Won':  0.9,
  'Closed Lost': 0,
};

export const REPS = [
  { id: 'r1', name: 'Jordan Hayes',   region: 'NA',   quota: 500000 },
  { id: 'r2', name: 'Priya Nair',     region: 'APAC', quota: 380000 },
  { id: 'r3', name: 'Marcus Webb',    region: 'EMEA', quota: 420000 },
  { id: 'r4', name: 'Sofia Reyes',    region: 'LATAM',quota: 310000 },
  { id: 'r5', name: 'Ethan Cho',      region: 'NA',   quota: 480000 },
];

export const DEALS = [
  { id: 'd1',  title: 'Acme Corp — Platform',      repId: 'r1', stage: 'Negotiation',    value: 128000, createdAt: '2025-11-14', closedAt: null,        company: 'Acme Corp',      priority: 'high'   },
  { id: 'd2',  title: 'Globex — AI Suite',          repId: 'r2', stage: 'Proposal',       value: 94500,  createdAt: '2025-12-02', closedAt: null,        company: 'Globex',         priority: 'medium' },
  { id: 'd3',  title: 'Initech — Data Sync',        repId: 'r3', stage: 'Closed Won',     value: 62000,  createdAt: '2025-09-10', closedAt: '2026-01-18',company: 'Initech',        priority: 'low'    },
  { id: 'd4',  title: 'Umbrella — Analytics',       repId: 'r4', stage: 'Qualification',  value: 47000,  createdAt: '2026-01-05', closedAt: null,        company: 'Umbrella Inc',   priority: 'medium' },
  { id: 'd5',  title: 'Soylent — Intent Feed',      repId: 'r5', stage: 'Prospecting',    value: 21000,  createdAt: '2026-02-20', closedAt: null,        company: 'Soylent Co',     priority: 'low'    },
  { id: 'd6',  title: 'Cyberdyne — CRM Connector',  repId: 'r1', stage: 'Closed Lost',    value: 83000,  createdAt: '2025-10-30', closedAt: '2026-01-09',company: 'Cyberdyne',      priority: 'high'   },
  { id: 'd7',  title: 'Massive Dyn — Enrichment',   repId: 'r2', stage: 'Negotiation',    value: 155000, createdAt: '2025-12-19', closedAt: null,        company: 'Massive Dynamic',priority: 'high'   },
  { id: 'd8',  title: 'Oscorp — Segment Pro',       repId: 'r3', stage: 'Proposal',       value: 39000,  createdAt: '2026-01-28', closedAt: null,        company: 'Oscorp',         priority: 'medium' },
  { id: 'd9',  title: 'Waystar — Revenue Attr',     repId: 'r4', stage: 'Closed Won',     value: 112000, createdAt: '2025-08-17', closedAt: '2025-12-22',company: 'Waystar',        priority: 'high'   },
  { id: 'd10', title: 'Veridian — Outreach',        repId: 'r5', stage: 'Qualification',  value: 54000,  createdAt: '2026-02-10', closedAt: null,        company: 'Veridian Corp',  priority: 'low'    },
  { id: 'd11', title: 'Pied Piper — Platform',      repId: 'r1', stage: 'Proposal',       value: 76000,  createdAt: '2026-01-14', closedAt: null,        company: 'Pied Piper',     priority: 'medium' },
  { id: 'd12', title: 'Hooli — Data Layer',         repId: 'r2', stage: 'Closed Won',     value: 200000, createdAt: '2025-07-01', closedAt: '2025-11-30',company: 'Hooli',          priority: 'high'   },
  { id: 'd13', title: 'Vehement Cap — Signals',     repId: 'r3', stage: 'Prospecting',    value: 18500,  createdAt: '2026-03-01', closedAt: null,        company: 'Vehement Cap',   priority: 'low'    },
  { id: 'd14', title: 'Dunder Mifflin — Score',     repId: 'r4', stage: 'Closed Lost',    value: 30000,  createdAt: '2025-11-05', closedAt: '2026-02-01',company: 'Dunder Mifflin', priority: 'medium' },
  { id: 'd15', title: 'Sterling Cooper — Intent',   repId: 'r5', stage: 'Negotiation',    value: 91000,  createdAt: '2026-01-22', closedAt: null,        company: 'Sterling Cooper',priority: 'high'   },
  { id: 'd16', title: 'Bluth Co — Analytics',       repId: 'r1', stage: 'Qualification',  value: 44000,  createdAt: '2026-02-08', closedAt: null,        company: 'Bluth Company',  priority: 'medium' },
  { id: 'd17', title: 'Wernham Hogg — CRM',         repId: 'r2', stage: 'Proposal',       value: 68000,  createdAt: '2026-01-31', closedAt: null,        company: 'Wernham Hogg',   priority: 'low'    },
  { id: 'd18', title: 'Delos — Predictive',         repId: 'r3', stage: 'Closed Won',     value: 143000, createdAt: '2025-10-12', closedAt: '2026-03-05',company: 'Delos Inc',      priority: 'high'   },
  { id: 'd19', title: 'Omni Consumer — Segment',    repId: 'r4', stage: 'Prospecting',    value: 27000,  createdAt: '2026-03-10', closedAt: null,        company: 'Omni Consumer',  priority: 'low'    },
  { id: 'd20', title: 'Aperture — Attribution',     repId: 'r5', stage: 'Closed Won',     value: 87500,  createdAt: '2025-09-28', closedAt: '2026-01-14',company: 'Aperture Sci',   priority: 'medium' },
];

export const ACTIVITIES = [
  { id: 'a1',  dealId: 'd1',  type: 'call',    note: 'Discovery call — strong interest in AI features',        timestamp: '2026-05-07T09:15:00Z' },
  { id: 'a2',  dealId: 'd1',  type: 'email',   note: 'Sent pricing proposal deck',                              timestamp: '2026-05-06T14:30:00Z' },
  { id: 'a3',  dealId: 'd2',  type: 'meeting', note: 'Demo with VP of Sales — positive feedback',              timestamp: '2026-05-08T11:00:00Z' },
  { id: 'a4',  dealId: 'd3',  type: 'note',    note: 'Contract signed — onboarding scheduled for next week',   timestamp: '2026-01-18T16:45:00Z' },
  { id: 'a5',  dealId: 'd7',  type: 'call',    note: 'Legal review in progress, expecting sign-off by EOM',    timestamp: '2026-05-07T10:00:00Z' },
  { id: 'a6',  dealId: 'd9',  type: 'note',    note: 'Champion left the company — deal at risk',               timestamp: '2025-12-15T08:30:00Z' },
  { id: 'a7',  dealId: 'd11', type: 'email',   note: 'Follow-up on proposal — no response yet',                timestamp: '2026-05-05T13:00:00Z' },
  { id: 'a8',  dealId: 'd15', type: 'meeting', note: 'Final negotiation session — closing expected this week',  timestamp: '2026-05-08T15:30:00Z' },
  { id: 'a9',  dealId: 'd18', type: 'note',    note: 'Payment received — upsell opportunity identified',       timestamp: '2026-03-06T09:00:00Z' },
  { id: 'a10', dealId: 'd20', type: 'call',    note: 'QBR scheduled — expansion discussion pending',           timestamp: '2026-05-04T11:30:00Z' },
];

export function simulateFetch(data, delay = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}
