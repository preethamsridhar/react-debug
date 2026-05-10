// Simulates network latency. Each call independently delays.
export function simulateFetch(data, delay = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay));
}

export const TENANTS = [
  { id: 't1', name: 'Acme Corp',        plan: 'enterprise', seats: 240, region: 'us-east-1', logo: 'https://picsum.photos/seed/acme/64/64'    },
  { id: 't2', name: 'Globex',           plan: 'growth',     seats: 80,  region: 'eu-west-1', logo: 'https://picsum.photos/seed/globex/64/64'   },
  { id: 't3', name: 'Initech',          plan: 'starter',    seats: 20,  region: 'us-west-2', logo: 'https://picsum.photos/seed/initech/64/64'  },
  { id: 't4', name: 'Massive Dynamic',  plan: 'enterprise', seats: 510, region: 'ap-south-1',logo: 'https://picsum.photos/seed/massdyn/64/64'  },
  { id: 't5', name: 'Umbrella Inc',     plan: 'growth',     seats: 130, region: 'us-east-1', logo: 'https://picsum.photos/seed/umbrella/64/64' },
  { id: 't6', name: 'Pied Piper',       plan: 'starter',    seats: 12,  region: 'us-west-2', logo: 'https://picsum.photos/seed/piedpiper/64/64'},
  { id: 't7', name: 'Hooli',            plan: 'enterprise', seats: 900, region: 'us-east-1', logo: 'https://picsum.photos/seed/hooli/64/64'    },
  { id: 't8', name: 'Delos Inc',        plan: 'growth',     seats: 200, region: 'eu-west-1', logo: 'https://picsum.photos/seed/delos/64/64'    },
];

export const USERS_BY_TENANT = {
  t1: Array.from({ length: 12 }, (_, i) => ({ id: `t1-u${i}`, name: `Acme User ${i+1}`,    role: i === 0 ? 'admin' : 'member', email: `user${i+1}@acme.com`,    lastSeen: new Date(Date.now() - i * 3_600_000).toISOString() })),
  t2: Array.from({ length: 6  }, (_, i) => ({ id: `t2-u${i}`, name: `Globex User ${i+1}`,  role: i === 0 ? 'admin' : 'member', email: `user${i+1}@globex.com`,  lastSeen: new Date(Date.now() - i * 7_200_000).toISOString() })),
  t3: Array.from({ length: 3  }, (_, i) => ({ id: `t3-u${i}`, name: `Initech User ${i+1}`, role: 'member',                     email: `user${i+1}@initech.com`, lastSeen: new Date(Date.now() - i * 86_400_000).toISOString() })),
  t4: Array.from({ length: 20 }, (_, i) => ({ id: `t4-u${i}`, name: `MassD User ${i+1}`,   role: i < 2  ? 'admin' : 'member', email: `user${i+1}@massd.com`,   lastSeen: new Date(Date.now() - i * 1_800_000).toISOString() })),
  t5: Array.from({ length: 8  }, (_, i) => ({ id: `t5-u${i}`, name: `Umbrella User ${i+1}`,role: i === 0 ? 'admin' : 'member', email: `user${i+1}@umbrella.com`,lastSeen: new Date(Date.now() - i * 5_400_000).toISOString() })),
  t6: Array.from({ length: 3  }, (_, i) => ({ id: `t6-u${i}`, name: `PiedP User ${i+1}`,   role: 'member',                     email: `user${i+1}@piedpiper.com`,lastSeen: new Date(Date.now() - i * 3_600_000).toISOString() })),
  t7: Array.from({ length: 25 }, (_, i) => ({ id: `t7-u${i}`, name: `Hooli User ${i+1}`,   role: i < 3  ? 'admin' : 'member', email: `user${i+1}@hooli.com`,   lastSeen: new Date(Date.now() - i * 900_000).toISOString()   })),
  t8: Array.from({ length: 10 }, (_, i) => ({ id: `t8-u${i}`, name: `Delos User ${i+1}`,   role: i === 0 ? 'admin' : 'member', email: `user${i+1}@delos.com`,   lastSeen: new Date(Date.now() - i * 2_700_000).toISOString() })),
};

export const METRICS_BY_TENANT = {
  t1: { mau: 198, apiCalls: 4_820_000, storageGB: 128, errorRate: 0.012, p99LatencyMs: 340 },
  t2: { mau: 71,  apiCalls: 980_000,   storageGB: 22,  errorRate: 0.031, p99LatencyMs: 520 },
  t3: { mau: 18,  apiCalls: 120_000,   storageGB: 4,   errorRate: 0.005, p99LatencyMs: 190 },
  t4: { mau: 472, apiCalls: 12_100_000,storageGB: 890, errorRate: 0.008, p99LatencyMs: 280 },
  t5: { mau: 115, apiCalls: 2_300_000, storageGB: 61,  errorRate: 0.019, p99LatencyMs: 410 },
  t6: { mau: 10,  apiCalls: 44_000,    storageGB: 1,   errorRate: 0.002, p99LatencyMs: 150 },
  t7: { mau: 830, apiCalls: 31_400_000,storageGB: 2100,errorRate: 0.006, p99LatencyMs: 220 },
  t8: { mau: 177, apiCalls: 3_600_000, storageGB: 98,  errorRate: 0.024, p99LatencyMs: 370 },
};

export const AUDIT_LOGS_BY_TENANT = {
  t1: Array.from({ length: 30 }, (_, i) => ({ id: `t1-log${i}`, action: ['login','api_call','export','settings_change','user_invite'][i%5], userId: `t1-u${i%12}`, ts: new Date(Date.now() - i * 120_000).toISOString() })),
  t4: Array.from({ length: 50 }, (_, i) => ({ id: `t4-log${i}`, action: ['login','api_call','export','settings_change','user_invite'][i%5], userId: `t4-u${i%20}`, ts: new Date(Date.now() - i * 60_000).toISOString()  })),
  t7: Array.from({ length: 80 }, (_, i) => ({ id: `t7-log${i}`, action: ['login','api_call','export','settings_change','user_invite'][i%5], userId: `t7-u${i%25}`, ts: new Date(Date.now() - i * 30_000).toISOString()  })),
};

export const ASSETS_BY_TENANT = {
  t1: Array.from({ length: 16 }, (_, i) => ({ id: `t1-img${i}`, url: `https://picsum.photos/seed/t1img${i}/400/300`, label: `Asset ${i+1}`, size: Math.round(80 + Math.random() * 400) })),
  t4: Array.from({ length: 16 }, (_, i) => ({ id: `t4-img${i}`, url: `https://picsum.photos/seed/t4img${i}/400/300`, label: `Asset ${i+1}`, size: Math.round(80 + Math.random() * 400) })),
  t7: Array.from({ length: 16 }, (_, i) => ({ id: `t7-img${i}`, url: `https://picsum.photos/seed/t7img${i}/400/300`, label: `Asset ${i+1}`, size: Math.round(80 + Math.random() * 400) })),
};
