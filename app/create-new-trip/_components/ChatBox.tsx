"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Zap, Bot, Brain, RefreshCw, MapPin } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import axios from "axios";

type Message = {
  role: string;
  content: string;
};

type ApiResponse = {
  resp: string;
  ui: string;
  trip_plan?: any;
};

type AIProvider = 'openai' | 'gemini';

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiProvider, setAIProvider] = useState<AIProvider>('openai');
  const [questionCount, setQuestionCount] = useState(0);
  const [tripPlan, setTripPlan] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetChat = () => {
    setMessages([]);
    setUserInput("");
    setError(null);
    setQuestionCount(0);
    setTripPlan(null);
  };

  const onSend = async () => {
    if (!userInput?.trim()) return;

    setIsLoading(true);
    setError(null);
    const inputValue = userInput.trim();
    setUserInput("");

    const newMsg: Message = { role: "user", content: inputValue };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    try {
      const isFinal =
        questionCount >= 6 ||
        inputValue.toLowerCase().includes("generate plan") ||
        inputValue.toLowerCase().includes("create itinerary") ||
        inputValue.toLowerCase().includes("final plan") ||
        inputValue.toLowerCase().includes("complete plan");

      const result = await axios.post<ApiResponse>("/api/aimodel", {
        messages: updatedMessages,
        isFinal: isFinal,
        useAI: aiProvider,
      });

      console.log("API Response:", result.data);

      if (result.data?.resp) {
        setMessages((prev: Message[]) => [
          ...prev,
          { role: "assistant", content: result.data.resp },
        ]);

        if (!isFinal && result.data.ui !== "Final") {
          setQuestionCount((prev) => prev + 1);
        }

        if (result.data.ui === "Final" && result.data.trip_plan) {
          setTripPlan(result.data.trip_plan);
          console.log("Trip plan received:", result.data.trip_plan);
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
      setMessages((prev: Message[]) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const switchAIProvider = (provider: AIProvider) => {
    setAIProvider(provider);
  };

  const getPlaceholderText = () => {
    if (questionCount === 0) {
      return "Create a trip to Ranchi...";
    } else if (questionCount < 7) {
      return "Type your response...";
    } else {
      return "Ask me to generate your complete trip plan!";
    }
  };

  const getTipText = () => {
    if (questionCount === 0) {
      return "Start by telling me where you'd like to go!";
    } else if (questionCount < 7) {
      return "I'll ask you about your destination, budget, group size, and preferences";
    } else {
      return "Ready to generate your complete trip plan! Just ask me to create it.";
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-2 bg-white/5 rounded-lg">
        <div className="flex space-x-2">
          <Button
            variant={aiProvider === "openai" ? "default" : "outline"}
            size="sm"
            onClick={() => switchAIProvider("openai")}
            className="flex items-center gap-2"
          >
            <Bot size={16} />
            OpenAI
          </Button>
          <Button
            variant={aiProvider === "gemini" ? "default" : "outline"}
            size="sm"
            onClick={() => switchAIProvider("gemini")}
            className="flex items-center gap-2"
          >
            <Brain size={16} />
            Gemini
            {aiProvider === "gemini" && (
              <span className="text-xs bg-blue-500 px-1 rounded">+Search</span>
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetChat}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          New Trip
        </Button>
      </div>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-300 mt-8">
            <div className="text-6xl mb-4">✈️</div>
            <div className="text-xl font-medium mb-2">
              Welcome to AI Trip Planner!
            </div>
            <div className="text-sm opacity-80 max-w-md mx-auto">
              I'll help you plan the perfect trip by asking you a few questions
              about your preferences. You can chat with me unlimited times to
              create multiple trip plans!
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-60">
              <MapPin size={12} />
              <span>
                Unlimited conversations • Real-time weather • Live search
                results
              </span>
            </div>
          </div>
        )}

        {messages.map((msg: Message, index) =>
          msg.role === "user" ? (
            <div className="flex justify-end" key={index}>
              <div className="max-w-lg bg-primary text-white px-4 py-3 rounded-lg shadow-sm">
                <div className="whitespace-pre-wrap text-sm">
                  {msg.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start" key={index}>
              <div className="max-w-lg bg-white/10 text-white px-4 py-3 rounded-lg shadow-sm border border-white/20">
                <div className="whitespace-pre-wrap text-sm">
                  {msg.content}
                </div>
              </div>
            </div>
          )
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-white/10 text-white px-4 py-3 rounded-lg shadow-sm border border-white/20">
              <div className="flex items-center gap-3">
                <PulseLoader color="white" size={6} />
                <span className="text-sm">
                  {aiProvider === "gemini"
                    ? "Gemini is thinking..."
                    : "OpenAI is thinking..."}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-red-500/20 text-red-200 rounded-lg text-sm shadow-sm border border-red-500/30">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-300 hover:text-red-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {tripPlan && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-200 mb-2">
              <MapPin size={16} />
              <span className="font-medium">Trip Plan Generated!</span>
            </div>
            <div className="text-sm text-green-100">
              Your personalized trip plan is ready with real-time weather data
              and live search results. Scroll up to see all the details!
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* Input */}
      <section className="p-4">
        <div className="border border-white/20 rounded-2xl relative bg-white/5 backdrop-blur-sm">
          <Textarea
            placeholder={getPlaceholderText()}
            className="w-full border-none bg-transparent h-28 focus-visible:ring-1 shadow-none resize-none text-white placeholder-gray-400"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            value={userInput}
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            {aiProvider === "gemini" && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Zap size={12} />
                Enhanced
              </div>
            )}
            <Button
              size="icon"
              onClick={onSend}
              disabled={isLoading || !userInput.trim()}
              className="bg-primary hover:bg-primary/80"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-2 text-xs text-gray-400 text-center flex items-center justify-center gap-2">
          <span>{getTipText()}</span>
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Unlimited</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;
