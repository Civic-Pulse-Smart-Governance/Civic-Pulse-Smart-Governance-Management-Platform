// Central mock data source.
// Replace each export with a real API call (see src/lib/api.js) once the
// Spring Boot backend is live — the shape of the objects below is what the
// UI expects, so keep it consistent when you swap in real data.

export const currentUser = {
  citizen: { name: 'Vyshnavi', role: 'Citizen', initials: 'V' },
  officer: { name: 'User', role: 'Officer', department: 'Electricity', initials: 'U' },
  admin: { name: 'Administrator', role: 'System Admin', initials: 'A' },
};

export const complaints = [
  {
    id: 'CP-20260812-6AA1B4',
    title: 'Faulty High-Mast Street Light',
    category: 'Street Light',
    department: 'ELECTRICITY',
    priority: 'HIGH',
    location: 'Dadar, Mumbai',
    description: 'High-mast street light near railway station junction blinking and dead since yesterday night, causing pedestrian safety hazard.',
    status: 'Pending',
    submittedBy: 'Radha',
    submittedAt: '2026-08-12T19:34:00',
  },
  {
    id: 'CP-20260812-45DA6D',
    title: 'Severe Drinking Water Pipeline Contamination',
    category: 'Water Supply',
    department: 'WATER',
    priority: 'HIGH',
    location: 'Kothrud, Pune',
    description: 'Muddy water supply with foul odor observed from municipal pipeline since morning.',
    status: 'Pending',
    submittedBy: 'Radha',
    submittedAt: '2026-08-12T18:10:00',
  },
  {
    id: 'CP-20260810-3F2C11',
    title: 'Solid Waste Bins Overflowing on Market Road',
    category: 'Sanitation',
    department: 'SANITATION',
    priority: 'MEDIUM',
    location: 'Naupada, Thane',
    description: 'Community garbage bins overflowing onto the walkway for 3 consecutive days. Stray dogs scattering litter.',
    status: 'In Progress',
    submittedBy: 'Revanth',
    submittedAt: '2026-08-10T09:22:00',
  },
  {
    id: 'CP-20260808-9B7A20',
    title: 'Dangerous Pothole on Highway Bypass',
    category: 'Roads',
    department: 'PWD',
    priority: 'HIGH',
    location: 'Nashik Road, Nashik',
    description: 'Deep trench-like pothole after rains causing vehicle rim damage and two-wheeler skids.',
    status: 'Resolved',
    submittedBy: 'Varun',
    submittedAt: '2026-08-08T14:05:00',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23e2e8f0"/><path d="M50 150 L120 80 L180 140 L220 100 L260 150 Z" fill="%2394a3b8"/><circle cx="90" cy="60" r="18" fill="%23f59e0b"/><text x="150" y="185" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="%23475569">Field Photo Proof (Sample)</text></svg>'
  },
  {
    id: 'CP-20260805-11A0F2',
    title: 'Broken Stormwater Drainage Cover',
    category: 'Drainage',
    department: 'DRAINAGE',
    priority: 'MEDIUM',
    location: 'T Nagar, Chennai',
    description: 'Broken concrete slab over storm drain creating hazard for school children.',
    status: 'Pending',
    submittedBy: 'Varun',
    submittedAt: '2026-08-05T11:40:00',
  },
  {
    id: 'CP-20260814-INT999',
    title: 'Damaged Sidewalk and Pavement Cracks',
    category: 'Roads',
    department: 'PWD',
    priority: 'LOW',
    location: 'Oxford Street, London, United Kingdom',
    description: 'Sidewalk pavement tiles loose and uneven outside commercial district in London.',
    status: 'Pending',
    submittedBy: 'Varun',
    submittedAt: '2026-08-14T10:15:00',
  },
  {
    id: 'CP-20260815-USA888',
    title: 'Park Fountain Water Leakage',
    category: 'Water Supply',
    department: 'WATER',
    priority: 'LOW',
    location: 'Central Park West, New York, USA',
    description: 'Water leaking from decorative public fountain onto bicycle pathway.',
    status: 'Pending',
    submittedBy: 'Sanjana',
    submittedAt: '2026-08-15T15:30:00',
  },
];

export const officers = [
  { id: 'OFF-101', name: 'Kumar', department: 'Electricity', email: 'kumar@civicpulse.gov', status: 'Active', assigned: 4 },
  { id: 'OFF-102', name: 'Rao Rajesh', department: 'Water Supply', email: 'rajesh@civicpulse.gov', status: 'Active', assigned: 2 },
  { id: 'OFF-103', name: 'Vijaya', department: 'Sanitation', email: 'vijaya@civicpulse.gov', status: 'Inactive', assigned: 0 },
  { id: 'OFF-104', name: 'Lakshmi', department: 'Roads (PWD)', email: 'lakshmi@civicpulse.gov', status: 'Active', assigned: 3 },
];

export const citizens = [
  { id: 'CIT-201', name: 'Radha', email: 'radha@example.com', complaints: 2, joined: '2026-05-12', status: 'Active' },
  { id: 'CIT-202', name: 'Revanth', email: 'revanth@example.com', complaints: 1, joined: '2026-06-02', status: 'Active' },
  { id: 'CIT-203', name: 'Varun', email: 'varun@example.com', complaints: 3, joined: '2026-03-21', status: 'Active' },
  { id: 'CIT-204', name: 'Sanjana', email: 'sanjana@example.com', complaints: 1, joined: '2026-07-08', status: 'Suspended' },
];

export const notifications = [
  { id: 1, title: 'Complaint #8 assigned to Electricity dept.', time: '2 hours ago', read: false },
  { id: 2, title: 'Complaint #6 marked as Resolved', time: '1 day ago', read: false },
  { id: 3, title: 'New officer added to Water Supply dept.', time: '2 days ago', read: true },
  { id: 4, title: 'Complaint #3 status changed to In Progress', time: '3 days ago', read: true },
];

export const statusCounts = (list = complaints) => ({
  total: list.length,
  pending: list.filter((c) => c.status === 'Pending').length,
  inProgress: list.filter((c) => c.status === 'In Progress').length,
  resolved: list.filter((c) => c.status === 'Resolved').length,
  rejected: list.filter((c) => c.status === 'Rejected').length,
});

export const departments = ['Electricity', 'Water Supply', 'Sanitation', 'Roads (PWD)', 'Planning'];
export const categories = ['Street Light', 'Water Supply', 'Sanitation', 'Roads', 'Building', 'Other'];
export const priorities = ['LOW', 'MEDIUM', 'HIGH'];
