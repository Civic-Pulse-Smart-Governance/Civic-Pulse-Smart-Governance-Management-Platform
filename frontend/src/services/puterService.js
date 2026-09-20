/**
 * puterService.js
 * 
 * Puter.js integration for free access to AI models (Google Gemini, OpenAI GPT)
 * for complaint analysis, 4-option municipal action planning, and international
 * jurisdiction enforcement.
 */

import { analyzeLocationProximity, checkIsOutsideIndia } from './geoProximityService';

export const AVAILABLE_MODELS = [
  { id: 'google/gemini-2.5-flash', name: 'Google Gemini 2.5 Flash (Free via Puter)', provider: 'Google' },
  { id: 'google/gemini-2.0-flash', name: 'Google Gemini 2.0 Flash', provider: 'Google' },
  { id: 'openai/gpt-4o-mini', name: 'OpenAI GPT-4o Mini (Free via Puter)', provider: 'OpenAI' },
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
];

/**
 * Check if Puter.js is loaded in the browser window
 */
export function isPuterAvailable() {
  return typeof window !== 'undefined' && !!window.puter && !!window.puter.ai;
}

/**
 * Fallback generator for civic action plans if Puter is offline or network fails
 */
function generateFallbackActionPlan(complaint, isOutsideIndia = false) {
  const category = (complaint.category || 'General').toLowerCase();
  const location = complaint.location || 'Local Area';
  const title = complaint.title || 'Civic Grievance';

  if (isOutsideIndia) {
    return {
      source: 'fallback',
      isOutsideIndia: true,
      canBeSolved: false,
      summary: `This complaint specifies a location outside India (${location}). Municipal administrative jurisdiction is restricted to India and Maharashtra state. Local municipal officers CANNOT solve issues in international territories.`,
      urgencyAssessment: 'Outside Legal Jurisdiction',
      options: [
        {
          id: 1,
          tag: '🚫 Jurisdiction Rejection',
          title: 'Reject: Outside Indian Municipal Jurisdiction',
          actionText: `Complaint Rejected: The reported location (${location}) is outside India. Indian municipal bodies hold no legal authority or operational jurisdiction in foreign territories.`,
          status: 'Rejected',
          estimatedTime: 'Immediate (Auto-Close)',
          department: 'LEGAL & JURISDICTION'
        },
        {
          id: 2,
          tag: '🏛️ Diplomatic Referral',
          title: 'Refer to Consular / Overseas Grievance Portal',
          actionText: `Official Notice: For civic or public infrastructure issues outside India, please contact the respective local municipal council or register via the Ministry of External Affairs MADAD portal.`,
          status: 'Rejected',
          estimatedTime: 'Immediate',
          department: 'EXTERNAL AFFAIRS'
        },
        {
          id: 3,
          tag: '🔄 Address Verification',
          title: 'Request Citizen Clarification & Geolocation Update',
          actionText: `Information Request: The submitted location indicates an international address. If this incident actually occurred within Maharashtra/India, please update your complaint with your local street/ward.`,
          status: 'Pending',
          estimatedTime: '48 Hours',
          department: 'CITIZEN HELPDESK'
        },
        {
          id: 4,
          tag: '📁 Log & Archive',
          title: 'Archive as Out-of-Bounds Submission',
          actionText: `Archived: Logged under Out-of-Jurisdiction administrative records. No municipal field officers will be dispatched.`,
          status: 'Rejected',
          estimatedTime: 'Immediate',
          department: 'ADMIN ARCHIVE'
        }
      ]
    };
  }

  // Category specific solutions within Maharashtra / India
  let opt1Title = '⚡ Emergency Rapid Response & Barricading';
  let opt1Text = `Dispatch Quick Response Team to ${location} immediately to inspect and secure site for "${title}". Install safety cones and cautionary tape.`;
  let opt1Time = '1 - 2 Hours';
  let opt1Status = 'In Progress';

  let opt2Title = '🛠️ Standard Departmental Work Order';
  let opt2Text = `Issue formal repair work order to designated zonal contractor for ${category} remediation at ${location}. Coordinate material requisition.`;
  let opt2Time = '24 - 48 Hours';
  let opt2Status = 'In Progress';

  let opt3Title = '🔍 Joint Multi-Agency Technical Audit';
  let opt3Text = `Schedule site audit with Executive Engineer and Assistant Municipal Commissioner to assess structural/systemic overhaul needed for ${category}.`;
  let opt3Time = '3 Days';
  let opt3Status = 'In Progress';

  let opt4Title = '✅ Complete On-Site Rectification & Citizen Verification';
  let opt4Text = `Execute complete on-site repair work, capture geo-tagged post-repair photographs, and mark grievance as fully RESOLVED with citizen notification.`;
  let opt4Time = 'Same Day';
  let opt4Status = 'Resolved';

  if (category.includes('road') || category.includes('pothole')) {
    opt1Title = '⚡ Cold-Mix Patching & Warning Barricade';
    opt1Text = `Deploy municipal road maintenance van to ${location} with cold asphalt mix. Patch hazardous potholes and install reflective warnings.`;
    opt2Title = '🛠️ Full Bitumen Resurfacing Order';
    opt2Text = `Assign PWD Road Works Division to mill and resurface damaged road segment at ${location}.`;
    opt4Text = `Pothole repair successfully filled with asphalt concrete, roller compacted, and road clearance verified.`;
  } else if (category.includes('water')) {
    opt1Title = '⚡ Emergency Valve Isolation & Tanker Dispatch';
    opt1Text = `Isolate affected water valve at ${location} to stop leakage/contamination and dispatch emergency potable water tanker to residents.`;
    opt2Title = '🛠️ Pipeline Splicing & Pressure Restoration';
    opt2Text = `Issue pipe replacement ticket to Water Works engineers. Excavate and replace damaged section at ${location}.`;
    opt4Text = `Water supply line repaired, pipeline pressurized, and water quality test cleared for consumption.`;
  } else if (category.includes('electric') || category.includes('light')) {
    opt1Title = '⚡ Power Line Safety Isolation & Fuse Check';
    opt1Text = `Depute linemen crew to ${location} to disconnect exposed wiring or replace blown junction fuse immediately.`;
    opt2Title = '🛠️ LED Luminaire & Cable Replacement';
    opt2Text = `Replace faulty street light fixtures with new high-efficiency LED luminaires and underground cable check.`;
    opt4Text = `Street lighting circuit restored, tested during night hours, and illumination verified.`;
  } else if (category.includes('sanitat') || category.includes('garb')) {
    opt1Title = '⚡ Compactor Truck & Sanitation Crew Dispatch';
    opt1Text = `Send hydraulic compactor vehicle and 4 sanitation workers to clear accumulated waste at ${location}.`;
    opt2Title = '🛠️ Daily Pickup Schedule & Bin Sanitization';
    opt2Text = `Deep clean and disinfect garbage bin bay at ${location} with bleaching powder; adjust daily route timings.`;
    opt4Text = `Solid waste cleared, area sanitized, and regular scheduled collection restored.`;
  }

  return {
    source: 'smart-engine',
    isOutsideIndia: false,
    canBeSolved: true,
    summary: `Analysis for "${title}" in ${location}: Categorized under ${category.toUpperCase()}. Requires coordinated municipal action according to Maharashtra urban local body guidelines.`,
    urgencyAssessment: complaint.priority || complaint.urgency || 'MEDIUM',
    options: [
      {
        id: 1,
        tag: '⚡ Immediate Response',
        title: opt1Title,
        actionText: opt1Text,
        status: opt1Status,
        estimatedTime: opt1Time,
        department: complaint.department || 'MUNICIPAL'
      },
      {
        id: 2,
        tag: '🛠️ Standard Work Order',
        title: opt2Title,
        actionText: opt2Text,
        status: opt2Status,
        estimatedTime: opt2Time,
        department: complaint.department || 'ENGINEERING'
      },
      {
        id: 3,
        tag: '🔍 Technical Inspection',
        title: opt3Title,
        actionText: opt3Text,
        status: opt3Status,
        estimatedTime: opt3Time,
        department: complaint.department || 'QUALITY CONTROL'
      },
      {
        id: 4,
        tag: '✅ Complete Resolution',
        title: opt4Title,
        actionText: opt4Text,
        status: opt4Status,
        estimatedTime: opt4Time,
        department: complaint.department || 'OPERATIONS'
      }
    ]
  };
}

/**
 * Main AI Analysis Function using Puter.js
 * Analyzes the complaint and returns 4 options + summary + jurisdiction assessment.
 */
export async function analyzeComplaintWithAI(complaint = {}, options = {}) {
  const model = options.model || 'google/gemini-2.5-flash';
  const locationStr = complaint.location || '';
  
  // 1. First verify Indian Municipal Jurisdiction
  const proximity = analyzeLocationProximity(locationStr);
  if (proximity.isOutsideIndia) {
    return generateFallbackActionPlan(complaint, true);
  }

  // 2. If Puter.js is available in window, call free AI model
  if (isPuterAvailable()) {
    try {
      const prompt = `You are a Municipal Grievance Officer AI Assistant for Maharashtra State Civic Administration in India.
Analyze the following civic complaint submitted by a citizen:
- Title: ${complaint.title || 'Untitled'}
- Category: ${complaint.category || 'General'}
- Department: ${complaint.department || 'Municipal Services'}
- Location: ${complaint.location || 'Maharashtra, India'}
- Urgency: ${complaint.priority || complaint.urgency || 'Medium'}
- Description: ${complaint.description || 'No details'}

Instructions:
1. Provide a concise 1-2 sentence problem diagnosis summary.
2. Provide EXACTLY 4 actionable, practical operational options for the Municipal Admin / Officer:
   Option 1: Immediate on-site emergency containment or dispatch (e.g. quick barricade or isolation)
   Option 2: Standard departmental work order & contractor repair schedule
   Option 3: Multi-agency technical site inspection or structural assessment
   Option 4: Complete permanent resolution & citizen verification
3. Respond ONLY with valid JSON (no markdown ticks or conversational text) following this exact schema:
{
  "summary": "1-2 sentence diagnosis",
  "urgencyAssessment": "HIGH / MEDIUM / LOW",
  "options": [
    {
      "id": 1,
      "tag": "⚡ Immediate Action",
      "title": "Short descriptive title",
      "actionText": "Full operational instruction for officer/note to citizen",
      "status": "In Progress",
      "estimatedTime": "1 - 2 Hours",
      "department": "Name of department"
    },
    {
      "id": 2,
      "tag": "🛠️ Work Order",
      "title": "Short descriptive title",
      "actionText": "Full operational instruction",
      "status": "In Progress",
      "estimatedTime": "24 Hours",
      "department": "Name of department"
    },
    {
      "id": 3,
      "tag": "🔍 Technical Inspection",
      "title": "Short descriptive title",
      "actionText": "Full operational instruction",
      "status": "In Progress",
      "estimatedTime": "2 - 3 Days",
      "department": "Name of department"
    },
    {
      "id": 4,
      "tag": "✅ Permanent Resolution",
      "title": "Short descriptive title",
      "actionText": "Full operational instruction",
      "status": "Resolved",
      "estimatedTime": "Same Day / Immediate",
      "department": "Name of department"
    }
  ]
}`;

      // Call Puter.js with a 3500ms timeout
      const chatPromise = window.puter.ai.chat(prompt, { model });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Puter AI request timed out')), 3500)
      );

      const response = await Promise.race([chatPromise, timeoutPromise]);
      
      let rawText = '';
      if (typeof response === 'string') {
        rawText = response;
      } else if (response?.message?.content) {
        rawText = typeof response.message.content === 'string' 
          ? response.message.content 
          : JSON.stringify(response.message.content);
      } else if (response?.text) {
        rawText = response.text;
      } else {
        rawText = JSON.stringify(response);
      }

      // Clean markdown code blocks if returned
      const cleaned = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.options) && parsed.options.length >= 4) {
        return {
          source: 'puter',
          modelUsed: model,
          isOutsideIndia: false,
          canBeSolved: true,
          summary: parsed.summary || `Diagnosis complete for ${complaint.title}`,
          urgencyAssessment: parsed.urgencyAssessment || complaint.priority || 'MEDIUM',
          options: parsed.options.slice(0, 4)
        };
      }
    } catch (err) {
      console.warn('Puter AI call error or JSON parse issue, falling back to smart engine:', err);
    }
  }

  // 3. Resilient fallback generator
  return generateFallbackActionPlan(complaint, false);
}
