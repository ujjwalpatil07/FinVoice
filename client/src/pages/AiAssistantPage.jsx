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
  Mic,
  Square
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // User ID - in a real app, this would come from authentication
  const userId = "user_123";

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
        text: "Hi! I'm your financial AI assistant. I can help you analyze your spending, suggest ways to save more, and provide personalized financial advice. What would you like to know?",
        sender: "ai",
        timestamp: new Date()
      },
      {
        id: 2,
        text: "Try asking me questions like: 'How can I save more money?', 'Where am I spending the most?', 'What's my savings rate?' or 'Add an expense of 500 rupees for food'",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Test server connection on component mount
  useEffect(() => {
    testServerConnection();
  }, []);

  const testServerConnection = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/health", {
        timeout: 5000
      });
      console.log("✅ Server connection successful:", response.data);
    } catch (error) {
      console.error("❌ Server connection failed:", error.message);
      // Add warning message
      const warningMessage = {
        id: Date.now(),
        text: "⚠️ Warning: Cannot connect to server. Please make sure the backend is running on port 8000.",
        sender: "system",
        timestamp: new Date()
      };
      setMessages(prev => [warningMessage, ...prev]);
    }
  };

  // Handle sending a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the API with proper headers
      const response = await axios.post("http://localhost:8000/api/chat", {
        user_id: userId,
        message: input
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log("✅ API Response:", response.data);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);

      // Add appropriate error message
      let errorText = "Sorry, I encountered an error. Please try again.";

      if (error.code === 'ECONNREFUSED') {
        errorText = "Cannot connect to server. Please make sure the backend is running on port 8000.";
      } else if (error.message.includes('Network Error')) {
        errorText = "Network error. Please check your internet connection.";
      } else if (error.response?.status === 500) {
        errorText = "Server error. The backend encountered an issue.";
      } else if (error.response?.status === 400) {
        errorText = "Invalid request. Please check your input.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Audio recording not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        try {
          if (audioChunksRef.current.length === 0) {
            throw new Error("No audio data recorded");
          }

          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav"
          });
          await sendAudioToAPI(audioBlob);
        } catch (error) {
          console.error("Error in recording stop:", error);
          const errorMessage = {
            id: Date.now() + 1,
            text: "Recording failed. Please try again.",
            sender: "ai",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          // Stop mic
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000);

    } catch (err) {
      console.error("❌ Mic access error:", err);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Microphone access denied. Please check your browser permissions.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToAPI = async (audioBlob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      const response = await axios.post(
        "http://localhost:8000/api/chat/audio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      console.log("✅ Audio API Response:", response.data);

      // Add user transcript and AI response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: response.data.user_text || "Voice message",
          sender: "user",
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          text: response.data.message,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("❌ Audio request error:", err);

      let errorText = "Sorry, I couldn't process your audio. Please try again.";
      if (err.response?.status === 400) {
        errorText = "Invalid audio format. Please try a different recording.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    },
    {
      title: "Add Expense",
      icon: Wallet,
      query: "I spent 500 rupees on lunch today"
    }
  ];

  const handleQuickAction = (query) => {
    setInput(query);
    // Auto-submit after a short delay
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => { } };
      handleSend(fakeEvent);
    }, 100);
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
              disabled={isLoading}
              className="flex-shrink-0 flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} ${message.sender === "system" ? "justify-center" : ""}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${message.sender === "user"
                ? "bg-indigo-600 text-white"
                : message.sender === "system"
                  ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                }`}
            >
              <div className="flex items-start">
                {message.sender === "ai" && (
                  <div className="p-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mr-2">
                    <Brain className="h-4 w-4" />
                  </div>
                )}
                {message.sender === "system" && (
                  <div className="p-1 rounded-full bg-yellow-200 text-yellow-800 mr-2">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className="whitespace-pre-line">{message.text}</div>
                {message.sender === "user" && (
                  <div className="p-1 rounded-full bg-indigo-500 ml-2">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className={`text-xs mt-2 ${message.sender === "user" ? "text-indigo-200" :
                message.sender === "system" ? "text-yellow-600 dark:text-yellow-400" :
                  "text-gray-500"
                }`}>
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
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            disabled={isLoading || isRecording}
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`ml-2 p-3 rounded-full ${isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading || isRecording || input.trim() === ""}
            className={`ml-2 px-4 py-3 rounded-r-lg ${isLoading || isRecording || input.trim() === ""
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          {isRecording ? "Recording... Speak now" : "The AI assistant analyzes your financial data to provide personalized advice"}
        </p>
      </div>
    </div>
  );
}