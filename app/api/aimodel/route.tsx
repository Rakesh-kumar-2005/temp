import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Initialize OpenAI
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// API Keys
const SERP_API_KEY = process.env.SERP_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Weather API function
async function getWeatherData(city: string) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
}

// SERP API function for search
async function searchPlaces(query: string) {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google",
        q: query,
        api_key: SERP_API_KEY,
        num: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("SERP API Error:", error);
    return null;
  }
}

// Enhanced search for hotels and attractions
async function searchHotelsAndAttractions(destination: string) {
  try {
    const [hotelsData, attractionsData] = await Promise.all([
      searchPlaces(`best hotels in ${destination}`),
      searchPlaces(`top attractions in ${destination}`),
    ]);
    return {
      hotels: hotelsData?.organic_results || [],
      attractions: attractionsData?.organic_results || [],
    };
  } catch (error) {
    console.error("Search Error:", error);
    return { hotels: [], attractions: [] };
  }
}

const PROMPT = `You are an AI Jharkhand Trip Planner Agent.
Your scope is strictly Jharkhand, India. If asked about other places, acknowledge and redirect to relevant Jharkhand alternatives.
Operate as a conversational planner that asks ONE concise question at a time, adapts to answers, and progressively fills all trip details.
If greeted casually, respond politely, then resume planning with the next best question.
You can leverage (when available): live weather in Jharkhand, place/stay/transport search, and user-provided constraints. Never expose internal tools or JSON. Reply only in plain text.
Objectives:
- Converge to a feasible, preference-aligned itinerary inside Jharkhand.
- Keep travel times realistic, budgets consistent, and safety top of mind.
- Maintain a friendly, concise tone.
Ask one question at a time, adapting the order if info is already known:
1) Starting location (city + state/country)
2) Destination(s) within Jharkhand (e.g., Ranchi, Netarhat, Betla, Deoghar, Hazaribagh, Patratu, Ghatshila, Jamshedpur, Parasnath/Shikharji)
3) Group size and type (solo, couple, family with kids, seniors, friends)
4) Budget range (per person and total; economy, mid, premium)
5) Trip dates or duration (days)
6) Travel interests (waterfalls, wildlife safari, temples/pilgrimage, hill station, lakes, caves, tribal culture, adventure, photography, food/markets)
7) Special requirements (mobility, dietary, language, festival timing, early check-in, no stairs, kid-friendly, pet-friendly, safety)
8) Travel style (fast vs relaxed; public transport vs cab; homestay vs hotel)
9) Arrival mode (train, flight to Ranchi/Deoghar, bus, self-drive) if missing
10) Season/time constraints (monsoon safety, safari timings, ropeway status, road closures) if relevant
Seasonal intelligence (apply silently; explain when relevant):
- Monsoon (Jul–Sep): Emphasize high-flow waterfalls around Ranchi (Dassam, Hundru, Jonha, Hirni), Patratu viewpoints; warn about slippery trails/closures; add buffer time.
- Post-monsoon to Winter (Oct–Mar): Favor Netarhat sunsets/sunrises, Betla safaris, Hazaribagh wildlife, Deoghar pilgrimage, Ghatshila nature walks.
- Summer (Apr–Jun): Prefer hill/forest escapes (Netarhat dawn/dusk), shorter outdoor blocks, AC stays, lakeside evenings; keep midday light.
Constraint solver (apply internally, confirm key choices):
- ≤3 days: 1 hub with day trips. 4–6 days: 2 hubs. 7+ days: 2–3 hubs max.
- Cap daily one-way commute to ~2–3 hours unless user agrees.
- Ensure at least one "wow" experience per day; alternate heavy/light days.
- Fit hotel and transport to budget; surface trade-offs when needed.
Safety & practicality:
- Note steps/difficulty at major waterfalls (e.g., Jonha), safari gates/timings (Betla/Hazaribagh), ropeway advisories (e.g., Trikut), monsoon alerts.
- Offer local transport options (auto, cab, rental, train) with quick pros/cons.
- Mention permits/entry fees and temple/park timing windows when relevant.
Error handling:
- If info is missing or ambiguous, ask a clarifying question instead of assuming.
- If user goes off-topic, acknowledge briefly and guide back to trip planning.
- If data is uncertain (weather, ropeway, safari), mark it as "to verify on day" and suggest how to check.
Style:
- Plain text, no JSON.
- Short, friendly, conversational lines.
- One question per message. Offer 2–3 smart suggestions when helpful.`;

const FINAL_PROMPT = `You are an AI Jharkhand Trip Planner.
Using the confirmed inputs, weather, and search insights, produce a cohesive, Jharkhand-only travel plan.
Include, in natural paragraphs (not JSON and not bullets-only):
1) Overview: 3–5 sentences aligning season, interests, and constraints.
2) Stays: 2–3 lodging options per hub (economy/mid/premium) with neighborhood guidance and fit rationale.
3) Day-by-day itinerary:
   - Logical routing and realistic drive times
   - Timing cues (sunrise/sunset, safari slots), ops hours/permits, step counts/difficulty where relevant
   - Meal and local market suggestions
4) Weather considerations: temps, rain/wind odds, packing and seasonal cautions.
5) Budget breakdown: transport, stay/night ranges, food per person/day, entries/activities, 10–15% buffer; show total low–high and confirm it matches stated budget.
6) Highlights & local experiences: key attractions plus 2–3 authentic tips.
7) Logistics: arrival/exit options, local transport choices, backup plans for rain/closures, contingency day.
8) Safety & accessibility: trails/steps, ropeways, safari rules, senior/kid-friendly notes, nearby medical access.
Rules:
- Jharkhand-only. If something is uncertain, label it and suggest how to verify.
- Keep tone warm, clear, trip-ready.
- Ensure seasonal/time consistency and realistic pacing.
- Plain text only.`;

const DECISIONING_PROMPT = `Silently compute:
- Seasonal cluster fit (monsoon waterfalls vs winter hills/safari)
- Hub count vs duration; minimize backtracking
- Daily commute graph keeping one-way travel ≤3 hours
- Budget-feasible stay and transport classes
- Safety flags (monsoon trails, step-heavy falls, ropeways, safari timings)
Then ask the single most-informative next question.`;

const STARTERS = [
  "Namaste! Planning a Jharkhand getaway—what city will the journey start from?",
  "Great choice exploring Jharkhand! Where are you starting, and roughly how many days?",
  "Hello! To tailor your Jharkhand plan, what's the starting location and budget band (economy/mid/premium)?"
];

const GUARDRAILS = `Enforce:
- Scope: Only Jharkhand destinations and logistics.
- One-question turns until ready to finalize.
- Refuse speculative claims; mark uncertain items as "to verify" with a quick method.
- Avoid overpacking; leave daily buffer of 60–90 minutes in monsoon and 30–60 minutes otherwise.`;

// Function to extract trip details from conversation - JHARKHAND FOCUSED
function extractTripDetails(messages: any[]) {
  const tripDetails: any = {};
  messages.forEach((msg) => {
    if (msg.role === "user") {
      const content = msg.content.toLowerCase();
      
      // Jharkhand destinations mapping
      const destinations = {
        ranchi: "Ranchi, Jharkhand",
        jamshedpur: "Jamshedpur, Jharkhand", 
        deoghar: "Deoghar, Jharkhand",
        hazaribagh: "Hazaribagh, Jharkhand",
        dhanbad: "Dhanbad, Jharkhand",
        bokaro: "Bokaro, Jharkhand",
        netarhat: "Netarhat, Jharkhand",
        betla: "Betla, Jharkhand",
        giridih: "Giridih, Jharkhand",
        dumka: "Dumka, Jharkhand",
        parasnath: "Parasnath, Jharkhand",
        palamu: "Palamu, Jharkhand",
        ghatshila: "Ghatshila, Jharkhand",
        patratu: "Patratu, Jharkhand",
        lohardaga: "Lohardaga, Jharkhand",
        chaibasa: "Chaibasa, Jharkhand"
      };
      
      for (const [key, value] of Object.entries(destinations)) {
        if (content.includes(key)) {
          tripDetails.destination = value;
          break;
        }
      }
      
      // Starting locations (can be from anywhere in India)
      const origins = {
        "new delhi": "New Delhi",
        delhi: "Delhi",
        mumbai: "Mumbai",
        kolkata: "Kolkata",
        chennai: "Chennai",
        bangalore: "Bangalore",
        hyderabad: "Hyderabad",
        pune: "Pune",
        ahmedabad: "Ahmedabad",
        patna: "Patna",
        bhubaneswar: "Bhubaneswar",
        raipur: "Raipur",
        ranchi: "Ranchi"
      };
      
      for (const [key, value] of Object.entries(origins)) {
        if (content.includes(key)) {
          tripDetails.origin = value;
          break;
        }
      }
      
      if (content.includes("low budget") || content.includes("cheap")) {
        tripDetails.budget = "Low";
      } else if (content.includes("luxury") || content.includes("expensive")) {
        tripDetails.budget = "High";
      } else if (content.includes("medium") || content.includes("moderate")) {
        tripDetails.budget = "Medium";
      }
      
      const durationMatch = content.match(/(\d+)\s*(day|week)/);
      if (durationMatch) {
        const number = parseInt(durationMatch[1]);
        const unit = durationMatch[2];
        tripDetails.duration =
          unit === "week" ? `${number * 7} days` : `${number} days`;
      }
      
      if (content.includes("solo") || content.includes("alone")) {
        tripDetails.groupSize = "Solo";
      } else if (content.includes("couple")) {
        tripDetails.groupSize = "Couple";
      } else if (content.includes("family")) {
        tripDetails.groupSize = "Family";
      } else if (content.includes("friends") || content.includes("group")) {
        tripDetails.groupSize = "Friends";
      }
    }
  });
  return tripDetails;
}

// Main API route handler for POST method
export async function POST(req: NextRequest) {
  try {
    const { messages, isFinal = false, useAI = "gemini" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { resp: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const userId = user?.primaryEmailAddress?.emailAddress ?? "anonymous";
    console.log(
      `Processing request for user: ${userId}, AI: ${useAI}, Final: ${isFinal}`
    );

    let responseText = "";

    if (isFinal) {
      const tripDetails = extractTripDetails(messages);
      const destination = tripDetails.destination || "Ranchi, Jharkhand";
      const weatherData = await getWeatherData(destination.split(",")[0]);
      const searchResults = await searchHotelsAndAttractions(destination);

      const enhancedContext = `
        Trip Details:
        Destination: ${destination}
        Origin: ${tripDetails.origin || "Not specified"}
        Budget: ${tripDetails.budget || "Not specified"}
        Duration: ${tripDetails.duration || "Not specified"}
        Group Size: ${tripDetails.groupSize || "Not specified"}
        
        Weather: ${
          weatherData
            ? `${weatherData.main?.temp}°C, ${weatherData.weather?.[0]?.description}`
            : "Unavailable"
        }
        
        Hotels: ${searchResults.hotels.length} found
        Attractions: ${searchResults.attractions.length} found
      `;

      if (useAI === "gemini") {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
          `${FINAL_PROMPT}\n\nConversation:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n")}\n\n${enhancedContext}`
        );
        responseText = result.response.text();
      } else {
        const completion = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            { role: "system", content: FINAL_PROMPT },
            ...messages,
            { role: "system", content: enhancedContext },
          ],
          max_tokens: 4000,
          temperature: 0.7,
        });
        responseText = completion.choices[0].message?.content ?? "";
      }
    } else {
      if (useAI === "gemini") {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
          `${PROMPT}\n\nConversation:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n")}`
        );
        responseText = result.response.text();
      } else {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: PROMPT }, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
        });
        responseText = completion.choices[0].message?.content ?? "";
      }
    }

    return NextResponse.json({ resp: responseText });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        resp: "Sorry, I encountered an error while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}