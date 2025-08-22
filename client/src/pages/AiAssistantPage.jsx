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
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa6";
import VoiceInput from "../components/dashboard/VoiceInput";

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock user financial data
  const userData = {
    name: "Aditya",
    monthlyIncome: 125000,
    monthlyExpenses: 39579.5,
    savings: 25420.5,
    balance: 85420.5,
    goals: [
      { title: "Emergency Fund", progress: 65, target: 100000 },
      { title: "Europe Vacation", progress: 50, target: 250000 },
      { title: "New Laptop", progress: 100, target: 80000 }
    ],
    spendingByCategory: [
      { category: "Food & Dining", amount: 12500, percentage: 32 },
      { category: "Transportation", amount: 8500, percentage: 21 },
      { category: "Entertainment", amount: 6500, percentage: 16 },
      { category: "Utilities", amount: 7500, percentage: 19 },
      { category: "Shopping", amount: 4500, percentage: 11 },
    ],
    recentTransactions: [
      { description: "Grocery Store", amount: -4500, date: "2025-08-15" },
      { description: "Salary Credit", amount: 125000, date: "2025-08-01" },
      { description: "Netflix", amount: -499, date: "2025-08-10" },
      { description: "Petrol", amount: -1800, date: "2025-08-12" },
    ]
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `Hi ${userData.name}! I'm your financial AI assistant. I can help you analyze your spending, suggest ways to save more, and provide personalized financial advice. What would you like to know?`,
        sender: "ai",
        timestamp: new Date()
      },
      {
        id: 2,
        text: "Try asking me questions like: 'How can I save more money?', 'Where am I spending the most?', or 'What's my savings rate?'",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  }, [userData.name]);


  // Handle sending a message
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
  };

  const handleVoiceResult = (data) => {
    // add user transcript
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: data.user_text || "Voice input",
        sender: "user",
        timestamp: new Date(),
      },
      {
        id: prev.length + 2,
        text: data.message,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  // Quick action buttons
  const quickActions = [
    {
      title: "Savings Advice",
      icon: TrendingUp,
      query: "How can I save more money?"
    },
    {
      title: "Spending Analysis",
      icon: PieChart,
      query: "Where am I spending the most?"
    },
    {
      title: "Budget Help",
      icon: Wallet,
      query: "Help me create a budget"
    },
    {
      title: "Goals Review",
      icon: Target,
      query: "How are my goals progressing?"
    }
  ];

  const handleQuickAction = (query) => {
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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Financial AI Assistant</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Powered by smart analysis of your financial data</p>
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
              className="flex-shrink-0 flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <action.icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${
                message.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start">
                {message.sender === "ai" && (
                  <div className="p-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mr-2">
                    <Brain className="h-4 w-4" />
                  </div>
                )}
                <div className="whitespace-pre-line">{message.text}</div>
                {message.sender === "user" && (
                  <div className="p-1 rounded-full bg-indigo-500 ml-2">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className={`text-xs mt-2 ${message.sender === "user" ? "text-indigo-200" : "text-gray-500"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 max-w-xs md:max-w-md">
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mr-2">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          {/* VoiceInput with callback */}
          <VoiceInput onResult={handleVoiceResult} />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ""}
            className={`px-4 py-3 rounded-r-lg ms-5 ${isLoading || input.trim() === ""
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          The AI assistant analyzes your financial data to provide personalized advice
        </p>
      </div>
    </div>
  );
};