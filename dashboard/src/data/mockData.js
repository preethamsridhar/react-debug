// Mock dataset: Accounts / Leads for a B2B CRM

export const USERS = [
  { id: 1,  name: 'Alice Johnson',    email: 'alice@acme.com',        role: 'admin',   department: 'Engineering',  salary: 142000, score: 92, active: true,  joinDate: '2021-03-15', region: 'NA' },
  { id: 2,  name: 'Bob Smith',        email: 'bob@globex.com',         role: 'user',    department: 'Marketing',    salary: 88000,  score: 74, active: true,  joinDate: '2020-07-22', region: 'EMEA' },
  { id: 3,  name: 'Carol White',      email: 'carol@initech.com',      role: 'manager', department: 'Sales',        salary: 115000, score: 88, active: false, joinDate: '2019-11-01', region: 'APAC' },
  { id: 4,  name: 'David Lee',        email: 'david@umbrella.com',     role: 'user',    department: 'Engineering',  salary: 130000, score: 65, active: true,  joinDate: '2022-01-10', region: 'NA' },
  { id: 5,  name: 'Eva Martinez',     email: 'eva@soylent.com',        role: 'user',    department: 'HR',           salary: 72000,  score: 80, active: true,  joinDate: '2021-06-30', region: 'LATAM' },
  { id: 6,  name: 'Frank Thomas',     email: 'frank@acme.com',         role: 'manager', department: 'Engineering',  salary: 160000, score: 95, active: true,  joinDate: '2018-04-20', region: 'NA' },
  { id: 7,  name: 'Grace Kim',        email: 'grace@globex.com',       role: 'user',    department: 'Marketing',    salary: 91000,  score: 70, active: false, joinDate: '2020-09-14', region: 'APAC' },
  { id: 8,  name: 'Henry Brown',      email: 'henry@initech.com',      role: 'admin',   department: 'IT',           salary: 105000, score: 85, active: true,  joinDate: '2017-02-28', region: 'EMEA' },
  { id: 9,  name: 'Iris Wilson',      email: 'iris@umbrella.com',      role: 'user',    department: 'Sales',        salary: 78000,  score: 60, active: true,  joinDate: '2023-03-05', region: 'NA' },
  { id: 10, name: 'James Davis',      email: 'james@soylent.com',      role: 'user',    department: 'Finance',      salary: 95000,  score: 77, active: true,  joinDate: '2022-08-18', region: 'EMEA' },
  { id: 11, name: 'Karen Taylor',     email: 'karen@acme.com',         role: 'manager', department: 'Sales',        salary: 125000, score: 91, active: true,  joinDate: '2019-05-09', region: 'NA' },
  { id: 12, name: 'Liam Anderson',    email: 'liam@globex.com',        role: 'user',    department: 'Engineering',  salary: 138000, score: 83, active: false, joinDate: '2021-12-01', region: 'NA' },
  { id: 13, name: 'Mia Jackson',      email: 'mia@initech.com',        role: 'user',    department: 'Marketing',    salary: 84000,  score: 69, active: true,  joinDate: '2020-02-14', region: 'LATAM' },
  { id: 14, name: 'Noah Harris',      email: 'noah@umbrella.com',      role: 'user',    department: 'HR',           salary: 67000,  score: 55, active: true,  joinDate: '2023-07-22', region: 'APAC' },
  { id: 15, name: 'Olivia Clark',     email: 'olivia@soylent.com',     role: 'admin',   department: 'Engineering',  salary: 148000, score: 98, active: true,  joinDate: '2016-10-30', region: 'NA' },
  { id: 16, name: 'Paul Lewis',       email: 'paul@acme.com',          role: 'user',    department: 'Finance',      salary: 89000,  score: 72, active: false, joinDate: '2021-04-17', region: 'EMEA' },
  { id: 17, name: 'Quinn Walker',     email: 'quinn@globex.com',       role: 'user',    department: 'Sales',        salary: 76000,  score: 66, active: true,  joinDate: '2022-11-03', region: 'NA' },
  { id: 18, name: 'Rachel Hall',      email: 'rachel@initech.com',     role: 'manager', department: 'Marketing',    salary: 118000, score: 87, active: true,  joinDate: '2019-08-25', region: 'APAC' },
  { id: 19, name: 'Sam Young',        email: 'sam@umbrella.com',       role: 'user',    department: 'Engineering',  salary: 133000, score: 79, active: true,  joinDate: '2020-03-11', region: 'EMEA' },
  { id: 20, name: 'Tina Allen',       email: 'tina@soylent.com',       role: 'user',    department: 'IT',           salary: 99000,  score: 73, active: false, joinDate: '2022-06-08', region: 'LATAM' },
  { id: 21, name: 'Uma Scott',        email: 'uma@acme.com',           role: 'user',    department: 'HR',           salary: 70000,  score: 62, active: true,  joinDate: '2023-01-19', region: 'NA' },
  { id: 22, name: 'Victor Green',     email: 'victor@globex.com',      role: 'admin',   department: 'IT',           salary: 110000, score: 89, active: true,  joinDate: '2018-09-07', region: 'EMEA' },
  { id: 23, name: 'Wendy Adams',      email: 'wendy@initech.com',      role: 'user',    department: 'Finance',      salary: 93000,  score: 76, active: true,  joinDate: '2021-07-14', region: 'APAC' },
  { id: 24, name: 'Xander Baker',     email: 'xander@umbrella.com',    role: 'user',    department: 'Sales',        salary: 81000,  score: 68, active: false, joinDate: '2020-12-29', region: 'NA' },
  { id: 25, name: 'Yara Gonzalez',    email: 'yara@soylent.com',       role: 'manager', department: 'Engineering',  salary: 155000, score: 93, active: true,  joinDate: '2017-06-16', region: 'LATAM' },
  { id: 26, name: 'Zoe Nelson',       email: 'zoe@acme.com',           role: 'user',    department: 'Marketing',    salary: 86000,  score: 71, active: true,  joinDate: '2022-04-02', region: 'NA' },
  { id: 27, name: 'Aaron Carter',     email: 'aaron@globex.com',       role: 'user',    department: 'Engineering',  salary: 127000, score: 84, active: true,  joinDate: '2019-10-20', region: 'NA' },
  { id: 28, name: 'Beth Mitchell',    email: 'beth@initech.com',       role: 'user',    department: 'HR',           salary: 68000,  score: 57, active: false, joinDate: '2023-05-31', region: 'EMEA' },
  { id: 29, name: 'Chris Perez',      email: 'chris@umbrella.com',     role: 'manager', department: 'Finance',      salary: 121000, score: 86, active: true,  joinDate: '2020-01-15', region: 'APAC' },
  { id: 30, name: 'Diana Roberts',    email: 'diana@soylent.com',      role: 'user',    department: 'Sales',        salary: 79000,  score: 64, active: true,  joinDate: '2022-09-27', region: 'NA' },
];

export const PRODUCTS = [
  { id: 1,  name: 'Intent Data Pro',      category: 'Data',       price: 2999,  rating: 4.8, stock: 999, featured: true,  description: 'Real-time buyer intent signals' },
  { id: 2,  name: 'Account Intelligence', category: 'Analytics',  price: 4499,  rating: 4.9, stock: 999, featured: true,  description: 'Full-funnel account tracking' },
  { id: 3,  name: 'Predictive Model',     category: 'AI',         price: 6999,  rating: 4.7, stock: 999, featured: false, description: 'AI-powered lead scoring' },
  { id: 4,  name: 'CRM Sync Connector',   category: 'Integration', price: 1499, rating: 4.5, stock: 50,  featured: false, description: 'Bidirectional CRM sync' },
  { id: 5,  name: 'Segment Builder',      category: 'Analytics',  price: 3499,  rating: 4.6, stock: 999, featured: true,  description: 'Dynamic audience segmentation' },
  { id: 6,  name: 'Outreach Optimizer',   category: 'Sales',      price: 2199,  rating: 4.4, stock: 999, featured: false, description: 'Personalized outreach at scale' },
  { id: 7,  name: 'Data Enrichment API',  category: 'Data',       price: 1999,  rating: 4.3, stock: 999, featured: false, description: 'Enrich contact & company data' },
  { id: 8,  name: 'Dashboard Studio',     category: 'Analytics',  price: 799,   rating: 4.2, stock: 999, featured: false, description: 'Custom reporting dashboards' },
  { id: 9,  name: 'Revenue Attribution',  category: 'AI',         price: 5499,  rating: 4.7, stock: 999, featured: true,  description: 'Multi-touch revenue attribution' },
  { id: 10, name: 'Email Signal Tracker', category: 'Data',       price: 899,   rating: 4.1, stock: 999, featured: false, description: 'Email engagement signals' },
  { id: 11, name: 'Web Visitor Reveal',   category: 'Data',       price: 1299,  rating: 4.4, stock: 999, featured: false, description: 'De-anonymize website traffic' },
  { id: 12, name: 'Keyword Intent Feed',  category: 'Data',       price: 2499,  rating: 4.6, stock: 999, featured: true,  description: '6sense keyword intent data' },
];

export const ANALYTICS_DATA = [
  { date: '2024-01-15', pageViews: 12400, uniqueVisitors: 8200,  conversions: 145, region: 'NA',   category: 'Data' },
  { date: '2024-01-22', pageViews: 9800,  uniqueVisitors: 6700,  conversions: 98,  region: 'EMEA', category: 'Analytics' },
  { date: '2024-02-03', pageViews: 15200, uniqueVisitors: 10100, conversions: 201, region: 'NA',   category: 'AI' },
  { date: '2024-02-18', pageViews: 7600,  uniqueVisitors: 5300,  conversions: 77,  region: 'APAC', category: 'Data' },
  { date: '2024-03-05', pageViews: 18900, uniqueVisitors: 12400, conversions: 267, region: 'NA',   category: 'Sales' },
  { date: '2024-03-20', pageViews: 11300, uniqueVisitors: 7800,  conversions: 134, region: 'EMEA', category: 'Analytics' },
  { date: '2024-04-08', pageViews: 21500, uniqueVisitors: 14200, conversions: 312, region: 'NA',   category: 'AI' },
  { date: '2024-04-25', pageViews: 8900,  uniqueVisitors: 6100,  conversions: 89,  region: 'LATAM',category: 'Data' },
  { date: '2024-05-12', pageViews: 16700, uniqueVisitors: 11000, conversions: 223, region: 'NA',   category: 'Analytics' },
  { date: '2024-05-28', pageViews: 13100, uniqueVisitors: 8900,  conversions: 178, region: 'APAC', category: 'Sales' },
  { date: '2024-06-10', pageViews: 24300, uniqueVisitors: 16000, conversions: 389, region: 'NA',   category: 'Data' },
  { date: '2024-06-27', pageViews: 10500, uniqueVisitors: 7200,  conversions: 112, region: 'EMEA', category: 'AI' },
  { date: '2025-01-08', pageViews: 28100, uniqueVisitors: 18500, conversions: 445, region: 'NA',   category: 'Analytics' },
  { date: '2025-01-24', pageViews: 19400, uniqueVisitors: 13100, conversions: 287, region: 'EMEA', category: 'Data' },
  { date: '2025-02-11', pageViews: 31200, uniqueVisitors: 20600, conversions: 521, region: 'NA',   category: 'AI' },
  { date: '2025-03-03', pageViews: 22700, uniqueVisitors: 15000, conversions: 367, region: 'APAC', category: 'Sales' },
  { date: '2025-04-14', pageViews: 35800, uniqueVisitors: 23400, conversions: 612, region: 'NA',   category: 'Data' },
  { date: '2025-05-01', pageViews: 27600, uniqueVisitors: 18200, conversions: 489, region: 'NA',   category: 'Analytics' },
];

export const NOTIFICATIONS_FEED = [
  { id: 1, type: 'lead',    message: 'New high-intent account: Salesforce',    time: '2m ago' },
  { id: 2, type: 'alert',   message: 'Buying group detected at Microsoft',      time: '8m ago' },
  { id: 3, type: 'success', message: 'Deal closed: $120k with Oracle',          time: '1h ago' },
  { id: 4, type: 'lead',    message: 'Account spiked on keyword "AI platform"', time: '2h ago' },
];

// Simulate async API latency
export function simulateFetch(data, delay = 600) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}
