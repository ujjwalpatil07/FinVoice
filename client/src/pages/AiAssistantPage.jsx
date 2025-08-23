import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Brain,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Wallet,
  PieChart,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceInput from "../components/dashboard/VoiceInput";

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call backend API
  const fetchAIResponse = async (queryText, tempId) => {
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/process-text/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: queryText }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // Replace placeholder with actual AI response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
              ...m,
              text: data.message || "No response received",
              loading: false,
              isThinking: false // Add this flag
            }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
              ...m,
              text: `❌ Failed to fetch response: ${err.message}`,
              error: true,
              loading: false,
              isThinking: false // Add this flag
            }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      loading: false,
      isThinking: false
    };

    const tempId = Date.now() + 1;
    const aiPlaceholder = {
      id: tempId,
      text: "Thinking...", // Show text instead of empty string
      sender: "ai",
      loading: true,
      isThinking: true, // Special flag for thinking state
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);
    const queryText = input;
    setInput("");

    fetchAIResponse(queryText, tempId);
  };

  // Handle voice input result
  const handleVoiceResult = async (data) => {
    if (isLoading) return;

    const userMsgId = Date.now();
    const tempId = userMsgId + 1;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        text: data.user_text || "Voice input",
        sender: "user",
        timestamp: new Date(),
        loading: false,
        isThinking: false
      },
      {
        id: tempId,
        text: "Thinking...", // Show text instead of empty string
        sender: "ai",
        loading: true,
        isThinking: true, // Special flag for thinking state
        timestamp: new Date(),
      },
    ]);

    if (data.message) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? {
            ...m,
            text: data.message,
            loading: false,
            isThinking: false
          } : m
        )
      );
    } else {
      fetchAIResponse(data.user_text || "Voice input", tempId);
    }
  };

  // Quick action buttons
  const quickActions = [
    {
      title: "Savings Advice",
      icon: TrendingUp,
      query: "How can I save more money?",
    },
    {
      title: "Spending Analysis",
      icon: PieChart,
      query: "Where am I spending the most?",
    },
    {
      title: "Budget Help",
      icon: Wallet,
      query: "Help me create a budget",
    },
    {
      title: "Goals Review",
      icon: Target,
      query: "How are my goals progressing?",
    },
  ];

  const handleQuickAction = (query) => {
    if (isLoading) return;
    setInput(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mr-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Financial AI Assistant
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by smart analysis of your financial data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto space-x-3 pb-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.query)}
              disabled={isLoading}
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full transition-colors ${isLoading
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                }`}
            >
              <action.icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-4">
              <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Ask me anything about your finances!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              I can help with savings advice, spending analysis, budget planning, and more.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${message.sender === "user"
                ? "bg-indigo-600 text-white"
                : message.error
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                }`}
            >
              <div className="flex items-start">
                {message.sender === "ai" && !message.error && (
                  <div className="p-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mr-2">
                    <Brain className="h-4 w-4" />
                  </div>
                )}
                <div className="whitespace-pre-line">
                  {message.isThinking ? ( // Use isThinking flag instead of loading
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="p-1 rounded-full bg-indigo-500 ml-2">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                )}
              </div>
              {!message.isThinking && ( // Don't show timestamp for thinking messages
                <p
                  className={`text-xs mt-2 ${message.sender === "user" ? "text-indigo-200" : "text-gray-500"
                    }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSend} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your finances..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {/* VoiceInput with callback */}
          <VoiceInput onResult={handleVoiceResult} disabled={isLoading} />
          <button
            type="submit"
            disabled={input.trim() === "" || isLoading}
            className={`px-4 py-3 rounded-r-lg ms-5 ${input.trim() === "" || isLoading
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            {isLoading ? (
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          The AI assistant analyzes your financial data to provide personalized advice
        </p>
      </div>
    </div>
  );
}