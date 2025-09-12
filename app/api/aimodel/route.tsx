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

const PROMPT = `You are an AI Trip Planner Agent. 
Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Ask about:
1. Starting location
2. Destination
3. Group size
4. Budget
5. Trip duration
6. Travel interests
7. Special requirements

Ask them step by step. 
Respond conversationally in plain text (not JSON).`;

const FINAL_PROMPT = `Generate a comprehensive Travel Plan using the provided details, weather info, and search results. 
Include:
- Hotels
- Day-by-day itinerary
- Weather considerations
- Budget breakdown

Respond in plain text, not JSON.`;

// Function to extract trip details from conversation
function extractTripDetails(messages: any[]) {
  const tripDetails: any = {};

  messages.forEach((msg) => {
    if (msg.role === "user") {
      const content = msg.content.toLowerCase();

      const destinations = {
        paris: "Paris, France",
        london: "London, UK",
        tokyo: "Tokyo, Japan",
        "new york": "New York, USA",
        rome: "Rome, Italy",
        dubai: "Dubai, UAE",
        singapore: "Singapore",
        bangkok: "Bangkok, Thailand",
        amsterdam: "Amsterdam, Netherlands",
        barcelona: "Barcelona, Spain",
      };

      for (const [key, value] of Object.entries(destinations)) {
        if (content.includes(key)) {
          tripDetails.destination = value;
          break;
        }
      }

      const origins = {
        "new york": "New York",
        "los angeles": "Los Angeles",
        chicago: "Chicago",
        miami: "Miami",
        "san francisco": "San Francisco",
        boston: "Boston",
        seattle: "Seattle",
        atlanta: "Atlanta",
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

export async function POST(req: NextRequest) {
  try {
    const { messages, isFinal = false, useAI = "openai" } = await req.json();

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
      const destination = tripDetails.destination || "Paris, France";

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
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        resp: "Sorry, I encountered an error while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
