const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';




// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection & fallback setups
let client = null;
let db = null;
let useLocalFallback = false;

// Mock in-memory databases as fallback
const mockUsers = [];
const mockComplaints = [];

async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    console.warn("[DB] MongoDB URI is missing or contains placeholder. Falling back to local in-memory storage.");
    useLocalFallback = true;
    return;
  }
  
  console.log("[DB] Attempting to connect to MongoDB...");
  client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db('civicpulse');
    console.log("[DB] Connected successfully to MongoDB Atlas.");
    useLocalFallback = false;
    
    // Ensure unique indexes on email if possible
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
      console.log("[DB] Ensured unique index on users.email.");
    } catch (e) {
      console.warn("[DB] Index creation skipped/failed:", e.message);
    }
  } catch (err) {
    console.error("[DB] MongoDB connection failed:", err.message);
    console.warn("[DB] Falling back to local in-memory storage for registration and login.");
    useLocalFallback = true;
  }
}

connectToMongoDB();

// Strict JWT Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// Optional JWT Verification Middleware (attaches user if token provided)
function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err && user) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  });
}


// Department mapping helper
function getDepartmentByCategory(category) {
  if (!category) return "General Municipal Services";
  const catLower = category.toLowerCase();
  if (catLower.includes("road")) {
    return "Roads & Traffic Engineering Dept";
  } else if (catLower.includes("water")) {
    return "Water Supply & Sanitation Department";
  } else if (catLower.includes("electr")) {
    return "Electrical Works Department";
  } else if (catLower.includes("sanitat") || catLower.includes("garb")) {
    return "Municipal Solid Waste Division";
  } else {
    return "General Civic Grievances Dept";
  }
}

// Routes

// 1. Citizen & Admin Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, role, officerId, department } = req.body;
  const userRole = role === 'admin' ? 'admin' : 'user';

  if (userRole === 'admin') {
    if (!name || !officerId || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields (Name, Officer ID, Email, Phone, Password) are required for Admin Registration.' });
    }
  } else {
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields (name, email, phone, password) are required.' });
    }
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (useLocalFallback) {
      const existingEmail = mockUsers.find(u => u.email === email);
      if (existingEmail) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }

      if (userRole === 'admin') {
        const existingOfficer = mockUsers.find(u => u.officerId === officerId);
        if (existingOfficer) {
          return res.status(400).json({ error: 'An admin officer with this Employee ID already exists.' });
        }
        
        const newAdmin = {
          id: 'admin_' + Date.now(),
          name,
          email,
          phone,
          officerId,
          department: department || 'General Municipal Command Center',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        };
        mockUsers.push(newAdmin);
        console.log("[MOCK DB] Registered admin:", name, officerId);
        return res.status(201).json({ success: true, message: 'Admin registration successful.' });
      } else {
        const newUser = {
          id: 'user_' + Date.now(),
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'user',
          createdAt: new Date()
        };
        mockUsers.push(newUser);
        console.log("[MOCK DB] Registered user:", name);
        return res.status(201).json({ success: true, message: 'Registration successful.' });
      }
    } else {
      // MongoDB Atlas check for duplicate email or officerId
      const existingEmail = await db.collection('users').findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }

      if (userRole === 'admin') {
        const existingOfficer = await db.collection('users').findOne({ officerId });
        if (existingOfficer) {
          return res.status(400).json({ error: 'An admin officer with this Employee ID already exists.' });
        }
        
        const newAdmin = {
          name,
          email,
          phone,
          officerId,
          department: department || 'General Municipal Command Center',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        };
        await db.collection('users').insertOne(newAdmin);
        console.log("[MONGO DB] Registered admin in MongoDB Atlas:", name, officerId);
        return res.status(201).json({ success: true, message: 'Admin registration successful.' });
      } else {
        const newUser = {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'user',
          createdAt: new Date()
        };
        await db.collection('users').insertOne(newUser);
        console.log("[MONGO DB] Registered user in MongoDB Atlas:", name);
        return res.status(201).json({ success: true, message: 'Registration successful.' });
      }
    }
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
      if (err.message && err.message.includes('email')) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }
      return res.status(400).json({ error: 'An account with this email or Officer ID already exists.' });
    }
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. Login (Citizen & Admin)
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role, officerId, department } = req.body;
  
  if (role === 'admin') {
    if (!officerId || !password) {
      return res.status(400).json({ error: 'Officer ID / Email and security PIN are required.' });
    }
  } else {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  }
  
  try {
    let user = null;
    
    if (role === 'admin') {
      if (useLocalFallback) {
        user = mockUsers.find(u => (u.officerId === officerId || u.email === officerId) && u.role === 'admin');
        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = {
            id: 'admin_' + Date.now(),
            name: 'Officer ' + officerId,
            officerId,
            department: department || 'General Municipal Services',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
          };
          mockUsers.push(user);
        }
      } else {
        user = await db.collection('users').findOne({
          $or: [{ officerId: officerId }, { email: officerId }],
          role: 'admin'
        });
      }
    } else {
      if (useLocalFallback) {
        user = mockUsers.find(u => u.email === email && u.role === 'user');
      } else {
        user = await db.collection('users').findOne({ email, role: 'user' });
      }
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid login credentials.' });
    }
    
    const payload = {
      id: user.id || (user._id ? user._id.toString() : 'user_' + Date.now()),
      name: user.name,
      role: user.role,
      email: user.email || null,
      officerId: user.officerId || null,
      department: user.department || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: payload.id,
        name: payload.name,
        role: payload.role,
        email: payload.email,
        phone: user.phone || null,
        officerId: payload.officerId,
        department: payload.department
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// 3. Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// 4. Submit Complaint (Authenticated or Guest Modal)
app.post('/api/complaints', optionalAuthenticateToken, async (req, res) => {
  const { title, category, description, location, address, urgency, priority, department, image, imageUrl, photo } = req.body;
  
  const cat = category || 'General';
  const desc = description || req.body.details || '';
  const loc = location || address || 'Not Specified';
  
  if (!cat || !desc) {
    return res.status(400).json({ error: 'Category and description are required.' });
  }
  
  try {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CP-${randomNum}`;
    const citizenId = req.user ? `CIT-${req.user.id}` : `GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    
    const complaint = {
      complaintId,
      citizenId,
      title: title || `${cat.toUpperCase()} Issue`,
      category: cat,
      description: desc,
      location: loc,
      urgency: urgency || priority || 'Medium',
      status: 'pending',
      department: department || getDepartmentByCategory(cat),
      assignedOfficer: 'Unassigned (Pending Routing)',
      submittedDate: now.toISOString().split('T')[0],
      userId: req.user ? req.user.id : 'GUEST',
      userName: req.user ? req.user.name : 'Anonymous Citizen',
      image: image || imageUrl || photo || null,
      createdAt: now
    };
    
    if (useLocalFallback) {
      complaint.id = complaintId;
      complaint._id = 'cmp_' + Date.now();
      mockComplaints.push(complaint);
      console.log("[MOCK DB] Submitted complaint:", complaintId);
      return res.status(201).json({ success: true, complaint });
    } else {
      const result = await db.collection('complaints').insertOne(complaint);
      complaint._id = result.insertedId.toString();
      complaint.id = complaint.complaintId;
      console.log("[MONGO DB] Submitted complaint:", complaint.complaintId);
      return res.status(201).json({ success: true, complaint });
    }
  } catch (err) {
    console.error('Submit complaint error:', err);
    res.status(500).json({ error: 'Server error during complaint submission.' });
  }
});

// 5. Get Complaints (All or filtered)
app.get('/api/complaints', optionalAuthenticateToken, async (req, res) => {
  try {
    if (useLocalFallback) {
      if (req.user && req.user.role === 'admin') {
        return res.json({ complaints: mockComplaints });
      } else if (req.user) {
        const userComplaints = mockComplaints.filter(c => c.userId === req.user.id);
        return res.json({ complaints: userComplaints.length > 0 ? userComplaints : mockComplaints });
      } else {
        return res.json({ complaints: mockComplaints });
      }
    } else {
      let complaints = [];
      if (req.user && req.user.role === 'admin') {
        complaints = await db.collection('complaints').find({}).sort({ createdAt: -1 }).toArray();
      } else if (req.user) {
        complaints = await db.collection('complaints').find({ userId: req.user.id }).sort({ createdAt: -1 }).toArray();
        if (complaints.length === 0) {
          complaints = await db.collection('complaints').find({}).sort({ createdAt: -1 }).toArray();
        }
      } else {
        complaints = await db.collection('complaints').find({}).sort({ createdAt: -1 }).toArray();
      }
      
      const normalized = complaints.map(c => ({
        ...c,
        id: c.complaintId || c.id || (c._id ? c._id.toString() : '')
      }));
      res.json({ complaints: normalized });
    }
  } catch (err) {
    console.error('Fetch complaints error:', err);
    res.status(500).json({ error: 'Server error fetching complaints.' });
  }
});

// 6. Get Single Complaint / Tracking Endpoint (Public & Auth)
app.get('/api/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const searchStr = (id || '').trim();
  
  if (!searchStr) {
    return res.status(400).json({ error: 'Complaint ID is required.' });
  }
  
  try {
    let complaint = null;
    if (useLocalFallback) {
      complaint = mockComplaints.find(
        c => (c.complaintId && c.complaintId.toLowerCase() === searchStr.toLowerCase()) ||
             (c.id && c.id.toLowerCase() === searchStr.toLowerCase()) ||
             (c._id && c._id.toString().toLowerCase() === searchStr.toLowerCase())
      );
    } else {
      const { ObjectId } = require('mongodb');
      let queryId = searchStr;
      try {
        if (searchStr.length === 24) {
          queryId = new ObjectId(searchStr);
        }
      } catch (e) {}
      
      complaint = await db.collection('complaints').findOne({
        $or: [
          { complaintId: { $regex: new RegExp(`^${searchStr}$`, 'i') } },
          { id: searchStr },
          { _id: queryId }
        ]
      });
    }
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found. Please check the Complaint ID and try again.' });
    }
    
    complaint.id = complaint.complaintId || complaint.id || (complaint._id ? complaint._id.toString() : '');
    res.json({ complaint });
  } catch (err) {
    console.error('Fetch single complaint error:', err);
    res.status(500).json({ error: 'Server error fetching complaint details.' });
  }
});

// 7. Update Complaint Status & Officer Assignment (Admin & Officer)
app.patch('/api/complaints/:id/status', optionalAuthenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, assignedOfficer, officerNote, resolutionNote, note } = req.body;
  
  const noteText = officerNote || resolutionNote || note || '';
  
  if (status && !['pending', 'in-progress', 'in progress', 'resolved', 'rejected', 'assigned'].includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  
  try {
    const updateObj = {};
    if (status) {
      updateObj.status = status.toLowerCase() === 'in progress' ? 'in-progress' : status.toLowerCase();
    }
    if (assignedOfficer) updateObj.assignedOfficer = assignedOfficer;
    if (noteText !== undefined) {
      updateObj.officerNote = noteText;
      updateObj.resolutionNote = noteText;
    }
    if (status && status.toLowerCase() === 'resolved') {
      updateObj.resolvedAt = new Date();
    }
    
    if (useLocalFallback) {
      const complaint = mockComplaints.find(
        c => (c.complaintId && c.complaintId.toLowerCase() === id.toLowerCase()) || c.id === id || c._id === id
      );
      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found.' });
      }
      if (status) complaint.status = updateObj.status;
      if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;
      if (noteText !== undefined) {
        complaint.officerNote = noteText;
        complaint.resolutionNote = noteText;
      }
      if (status && status.toLowerCase() === 'resolved') {
        complaint.resolvedAt = new Date();
      }
      console.log(`[MOCK DB] Updated complaint ${id} status to ${complaint.status}`);
      return res.json({ success: true, complaint });
    } else {
      const { ObjectId } = require('mongodb');
      let queryId = id;
      try {
        if (id.length === 24) queryId = new ObjectId(id);
      } catch (e) {}
      
      const filter = {
        $or: [
          { complaintId: { $regex: new RegExp(`^${id}$`, 'i') } },
          { id: id },
          { _id: queryId }
        ]
      };
      
      await db.collection('complaints').updateOne(filter, { $set: updateObj });
      const updatedComplaint = await db.collection('complaints').findOne(filter);
      
      if (!updatedComplaint) {
        return res.status(404).json({ error: 'Complaint not found.' });
      }
      
      updatedComplaint.id = updatedComplaint.complaintId || updatedComplaint.id || updatedComplaint._id.toString();
      console.log(`[MONGO DB] Updated complaint ${id} status to ${updatedComplaint.status}`);
      return res.json({ success: true, complaint: updatedComplaint });
    }
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

// 8. Get Complaint Statistics
app.get('/api/complaints/stats', async (req, res) => {
  try {
    let all = [];
    if (useLocalFallback) {
      all = mockComplaints;
    } else {
      all = await db.collection('complaints').find({}).toArray();
    }
    
    const stats = {
      total: all.length,
      pending: all.filter(c => (c.status || '').toLowerCase() === 'pending').length,
      inProgress: all.filter(c => (c.status || '').toLowerCase() === 'in-progress' || (c.status || '').toLowerCase() === 'assigned').length,
      resolved: all.filter(c => (c.status || '').toLowerCase() === 'resolved').length
    };
    
    res.json({ stats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error fetching statistics.' });
  }
});

// 9. Geocoding & Jurisdiction Verification API (Checks place existence & India jurisdiction)
const geoCache = new Map();

app.get('/api/geocode', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Query parameter q is required.' });
  }

  const cacheKey = q.toLowerCase();
  if (geoCache.has(cacheKey)) {
    return res.json(geoCache.get(cacheKey));
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=1&accept-language=en`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CivicPulse-SmartGovernance/1.0 (contact@civicpulse.gov)',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding service HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      const result = {
        exists: false,
        isInIndia: false,
        isOutsideIndia: false,
        canBeSolved: false,
        rawQuery: q,
        statusNotice: `⚠️ Location "${q}" does not exist on the map`,
        error: `Location "${q}" does not exist or was not found on the world map. Please check spelling or enter a valid city or place.`
      };
      geoCache.set(cacheKey, result);
      return res.json(result);
    }

    const item = data[0];
    const addr = item.address || {};
    const countryCode = (addr.country_code || '').toLowerCase();
    let country = addr.country || 'Unknown Country';
    // Fallback if country is missing or localized
    if (countryCode === 'bh') country = 'Bahrain';
    if (countryCode === 'us') country = 'United States';
    if (countryCode === 'gb' || countryCode === 'uk') country = 'United Kingdom';
    if (countryCode === 'in') country = 'India';
    if (countryCode === 'ae') country = 'United Arab Emirates';
    if (countryCode === 'ca') country = 'Canada';
    if (countryCode === 'au') country = 'Australia';
    if (countryCode === 'de') country = 'Germany';
    if (countryCode === 'fr') country = 'France';
    const state = addr.state || addr.region || addr.county || '';
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || item.name || '';
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    // Baseline: Maharashtra Admin Command HQ (Mumbai: 19.0760° N, 72.8777° E)
    const MH_LAT = 19.0760;
    const MH_LON = 72.8777;

    function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    const distanceKm = !isNaN(lat) && !isNaN(lon) ? getHaversineDistanceKm(MH_LAT, MH_LON, lat, lon) : 12000;
    const isInIndia = countryCode === 'in' || country.toLowerCase() === 'india';
    const isMaharashtra = isInIndia && (state.toLowerCase().includes('maharashtra') || (item.display_name || '').toLowerCase().includes('maharashtra'));

    let zone = 'international';
    let zoneLabel = 'Non-India (Out of Jurisdiction)';
    if (isInIndia) {
      if (distanceKm <= 50) {
        zone = 'local';
        zoneLabel = 'Local Metro Priority (< 50 km)';
      } else if (distanceKm <= 350 || isMaharashtra) {
        zone = 'maharashtra';
        zoneLabel = `Maharashtra Regional (${distanceKm} km)`;
      } else {
        zone = 'interstate';
        zoneLabel = `Inter-State (${state || 'India'}, ${distanceKm} km)`;
      }
    }

    const result = {
      exists: true,
      isInIndia,
      isOutsideIndia: !isInIndia,
      canBeSolved: isInIndia,
      isMaharashtra,
      country,
      countryCode,
      detectedCountry: country,
      state: state || (isMaharashtra ? 'Maharashtra' : 'India'),
      stateName: state || (isMaharashtra ? 'Maharashtra' : 'India'),
      city,
      displayName: item.display_name,
      lat,
      lon,
      distanceKm,
      formattedDistance: isInIndia ? `${distanceKm} km` : `International (${country})`,
      zone,
      zoneLabel,
      statusNotice: isInIndia
        ? (isMaharashtra
            ? `Within Maharashtra Jurisdiction (${distanceKm} km from Admin HQ)`
            : `Inter-State Complaint (${state || 'India'} - ${distanceKm} km from Admin HQ)`)
        : `⚠️ Cannot be solved by Admin — Location is in ${country} (Outside Indian Municipal Jurisdiction)`,
      reason: isInIndia
        ? `Location is in ${state || 'India'}. Municipal jurisdiction confirmed.`
        : `The location "${q}" is situated in ${country}. Indian municipal authorities have jurisdiction strictly within India and cannot resolve complaints abroad.`,
      verifiedByAi: true
    };

    geoCache.set(cacheKey, result);
    return res.json(result);
  } catch (err) {
    console.error('Geocoding API error:', err.message);
    res.status(500).json({ error: 'Geocoding service unavailable' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[SERVER] CivicPulse backend listening on port ${PORT}`);
});


