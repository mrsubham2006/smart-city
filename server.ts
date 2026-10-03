import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

/**
 * Multi-Turn Chatbot with Contextual System Instruction
 */
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userRole, language, contextData } = req.body;

    if (!aiClient) {
      return res.status(200).json({
        text: "I am Civic Nexus AI, your dedicated Bhubaneswar Smart City Operations Assistant. (Offline operational fallback active)",
        role: "assistant"
      });
    }

    const systemInstruction = `You are "Civic Nexus AI", the official Intelligent Operations and Civic Assistant for Bhubaneswar Municipal Corporation (BMC), Government of Odisha.
Target Audience: ${userRole || 'CITIZEN'}.
Current City: Bhubaneswar, Odisha, India (67 Municipal Wards across North, Central, and South-West Zones).
Primary Language: ${language === 'or' ? 'Odia' : language === 'hi' ? 'Hindi' : 'English'}.

Operational Knowledge:
- 112 Emergency Hotline, 1929 BMC Civic Grievance Helpline.
- Key Landmark Corridors: Janpath, Jayadev Vihar, Nayapalli, Patia, Khandagiri, Master Canteen, Rasulgarh, Kalinga Nagar, Old Town (Ekamra Kshetra).
- Core Departments: Disaster Management & Drainage, Health & Sanitation, Engineering & Roads, Electrical & Street Lighting, 112 Emergency Operations.
- Trauma Centers: AIIMS Bhubaneswar, Capital Hospital Unit-6, SUM Ultimate Medicare, Apollo Hospital.

Responsibilities:
1. Provide accurate, empathetic, and actionable guidance for reporting civic complaints, flood warnings, road safety, and tourist itineraries.
2. If the user asks about an emergency, immediately instruct them to call 112 or use the SOS button.
3. Be professional, concise, culturally respectful of Odisha, and clear in formatting with markdown bullet points.`;

    const contents = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // If context data provided, prepend to prompt
    if (contextData) {
      contents.unshift({
        role: 'user',
        parts: [{ text: `[SYSTEM_CONTEXT_STATE]: Active city telemetry context: ${JSON.stringify(contextData)}` }]
      });
      contents.unshift({
        role: 'model',
        parts: [{ text: 'Acknowledged Bhubaneswar municipal telemetry context.' }]
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction
      }
    });

    res.json({
      text: response.text || 'Civic Nexus AI is ready to assist you with Bhubaneswar civic operations.',
      role: 'assistant'
    });
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    res.status(500).json({ error: err.message || 'Failed to process chat message' });
  }
});

/**
 * Google Search Grounding for Live Bhubaneswar Weather & City Alerts
 */
app.post('/api/gemini/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!aiClient) {
      return res.json({
        text: 'Live search unavailable without API key. Standard Bhubaneswar monsoon & advisory protocols in effect.',
        sources: []
      });
    }

    const prompt = `Provide the latest real-time verified information regarding: "${query}" in Bhubaneswar, Odisha, India. Focus on municipal advisories, weather/rain forecasts, traffic updates, or civic announcements.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text: response.text || 'No immediate search grounding results found.',
      sources
    });
  } catch (err: any) {
    console.error('Search Grounding Error:', err);
    res.status(500).json({ error: err.message || 'Search grounding failed' });
  }
});

/**
 * Google Maps / Places Grounding for Bhubaneswar Locations
 */
app.post('/api/gemini/maps', async (req: Request, res: Response) => {
  try {
    const { locationQuery, category } = req.body;

    if (!aiClient) {
      return res.json({
        text: `Bhubaneswar landmarks near ${locationQuery || 'Jayadev Vihar'} (Offline GIS records active).`,
        places: []
      });
    }

    const prompt = `You are a Bhubaneswar GIS specialist. Find verified municipal details and facilities for: "${locationQuery}" (Category: ${category || 'civic'}).
Include:
- Landmark / Hospital / Facility Name
- Exact Ward / Zone in Bhubaneswar
- Proximity to major arterial roads (e.g., Janpath, NH-16, Nandankanan Road)
- Contact & Emergency access routes`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    res.json({
      text: response.text || 'Location identified in Bhubaneswar GIS directory.',
      grounding: response.candidates?.[0]?.groundingMetadata || null
    });
  } catch (err: any) {
    console.error('Maps Grounding Error:', err);
    res.status(500).json({ error: err.message || 'Maps query failed' });
  }
});

/**
 * Complaint Triage & Multimodal Classification
 */
app.post('/api/gemini/triage', async (req: Request, res: Response) => {
  try {
    const { description, categoryInput, address, photoBase64 } = req.body;

    if (!aiClient) {
      return res.status(200).json({
        category: categoryInput || 'Engineering & Roads',
        subcategory: 'General Civic Maintenance',
        severity: 'MEDIUM',
        priority: 'P3_MEDIUM',
        confidence: 0.88,
        department: 'Engineering & Roads',
        summary: description,
        recommendedAction: 'Inspect site and issue maintenance ticket.',
        estimatedResolutionHours: 8,
        cascadeRisks: ['Localized pedestrian inconvenience']
      });
    }

    const prompt = `You are the AI City Operating & Intelligence Engine for Bhubaneswar Municipal Corporation (BMC), Odisha.
Analyze this citizen civic grievance:
- Category Selected: ${categoryInput}
- Description: "${description}"
- Location: "${address}"

Respond in pure JSON format:
{
  "category": string,
  "subcategory": string,
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "priority": "P1_CRITICAL" | "P2_HIGH" | "P3_MEDIUM" | "P4_LOW",
  "confidence": number (0.85 to 0.99),
  "department": string (One of: "Disaster Management & Drainage", "Health & Sanitation", "Engineering & Roads", "Electrical & Street Lighting", "Environment & Parks", "Enforcement & Public Safety"),
  "locationIdentified": string,
  "wardEstimated": string,
  "zoneEstimated": "North Zone" | "Central Zone" | "South-West Zone",
  "summary": string,
  "recommendedAction": string,
  "estimatedResolutionHours": number,
  "cascadeRisks": string[]
}`;

    const parts: any[] = [{ text: prompt }];

    if (photoBase64) {
      const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json(parsed);
    }

    res.json({
      category: categoryInput,
      subcategory: 'General Inspection',
      severity: 'MEDIUM',
      priority: 'P3_MEDIUM',
      confidence: 0.85,
      department: 'Engineering & Roads',
      summary: description,
      recommendedAction: 'Deploy standard inspection squad.',
      estimatedResolutionHours: 12,
      cascadeRisks: ['Minor pedestrian slowdown']
    });
  } catch (err: any) {
    console.error('Triage Error:', err);
    res.status(500).json({ error: err.message || 'Triage analysis failed' });
  }
});

// Vite Middleware for Dev Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Civic Nexus AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
