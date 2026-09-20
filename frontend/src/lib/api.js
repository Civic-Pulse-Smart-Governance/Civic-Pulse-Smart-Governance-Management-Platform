import { complaints as mockComplaints } from '../data/mockData';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('civicpulse_token') || localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getComplaintById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, { headers: getHeaders() });
    if (res.status === 404) {
      return { data: null, source: 'api', notFound: true };
    }
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const resData = await res.json();
    const complaint = resData.complaint || resData;
    return { data: normalizeComplaint(complaint), source: 'api', notFound: false };
  } catch (err) {
    const fallback = mockComplaints.find((c) => c.id === id || c.complaintId === id) || null;
    return { data: fallback, source: 'mock', notFound: !fallback, error: err.message };
  }
}

export async function getAllComplaints(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/complaints${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const resData = await res.json();
    const complaintsArr = Array.isArray(resData) ? resData : (resData.complaints || []);
    return { data: complaintsArr.map(normalizeComplaint), source: 'api' };
  } catch (err) {
    return { data: mockComplaints, source: 'mock', error: err.message };
  }
}

export async function createComplaint(payload) {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Request failed: ${res.status}`);
  }
  const resData = await res.json();
  const created = resData.complaint || resData;
  return normalizeComplaint(created);
}

export async function updateComplaintStatus(id, status, extra = {}) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status, ...extra }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Request failed: ${res.status}`);
  }
  const resData = await res.json();
  const updated = resData.complaint || resData;
  return normalizeComplaint(updated);
}

function normalizeComplaint(c) {
  if (!c) return c;
  
  let formattedStatus = 'Pending';
  if (c.status) {
    const sLower = c.status.toLowerCase();
    if (sLower === 'in-progress' || sLower === 'in progress') {
      formattedStatus = 'In Progress';
    } else if (sLower === 'resolved') {
      formattedStatus = 'Resolved';
    } else if (sLower === 'rejected') {
      formattedStatus = 'Rejected';
    } else if (sLower === 'pending') {
      formattedStatus = 'Pending';
    } else {
      formattedStatus = c.status.charAt(0).toUpperCase() + c.status.slice(1);
    }
  }

  return {
    ...c,
    id: c.complaintId || c.id || (c._id ? c._id.toString() : ''),
    submittedAt: c.submittedAt || c.submitted_at || c.submittedDate || c.createdAt,
    priority: c.priority || c.urgency || 'MEDIUM',
    status: formattedStatus,
    officerNote: c.officerNote || c.resolutionNote || c.note || '',
    resolutionNote: c.resolutionNote || c.officerNote || c.note || '',
    image: c.image || c.imageUrl || c.photo || null
  };
}
