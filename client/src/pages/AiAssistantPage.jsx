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
  }, []);

  // Generate AI response based on user query
  const generateAIResponse = (query) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let response = "";
      const lowerQuery = query.toLowerCase();
      
      // Analyze query and generate appropriate response
      if (lowerQuery.includes("save") || lowerQuery.includes("saving") || lowerQuery.includes("savings")) {
        const savingsRate = ((userData.savings / userData.monthlyIncome) * 100).toFixed(1);
        response = `Your current savings rate is ${savingsRate}%, which is ${savingsRate >= 20 ? 'excellent' : 'good but could be improved'}. `;
        
        if (savingsRate < 20) {
          response += "I recommend aiming for at least 20%. You could achieve this by reducing spending on dining out and entertainment, which currently make up a significant portion of your expenses.";
        } else {
          response += "Great job! You're on track to meet your financial goals. Consider investing some of your savings for higher returns.";
        }
      } 
      else if (lowerQuery.includes("spend") || lowerQuery.includes("spending") || lowerQuery.includes("expense")) {
        const highestCategory = userData.spendingByCategory.reduce((prev, current) => 
          (prev.amount > current.amount) ? prev : current
        );
        
        response = `You're spending the most on ${highestCategory.category} (₹${highestCategory.amount.toLocaleString()}), which accounts for ${highestCategory.percentage}% of your expenses. `;
        response += "To reduce spending, consider setting monthly budgets for each category. I notice your Food & Dining expenses are quite high - meal planning could help reduce these costs.";
      }
      else if (lowerQuery.includes("budget") || lowerQuery.includes("budgeting")) {
        response = "Based on your income and expenses, I recommend the following budget: ";
        response += "• Essentials (housing, utilities, groceries): 50% \n";
        response += "• Financial goals (savings, investments): 20% \n";
        response += "• Lifestyle (dining, entertainment): 20% \n";
        response += "• Unexpected expenses: 10% \n\n";
        response += "You're currently spending a bit more on lifestyle categories than recommended. Try tracking your daily expenses to stay within budget.";
      }
      else if (lowerQuery.includes("goal") || lowerQuery.includes("target")) {
        response = "Here's the progress on your financial goals: \n";
        userData.goals.forEach(goal => {
          response += `• ${goal.title}: ${goal.progress}% complete (₹${(goal.target * goal.progress / 100).toLocaleString()} of ₹${goal.target.toLocaleString()}) \n`;
        });
        response += "\nTo accelerate your goal progress, consider allocating any bonuses or windfalls directly to these goals rather than increasing discretionary spending.";
      }
      else if (lowerQuery.includes("invest") || lowerQuery.includes("investment")) {
        response = "Based on your financial situation, I recommend: \n";
        response += "1. Build an emergency fund covering 3-6 months of expenses first \n";
        response += "2. Consider low-cost index funds for long-term growth \n";
        response += "3. Explore tax-saving investment options like ELSS funds \n";
        response += "4. Diversify across different asset classes based on your risk tolerance \n\n";
        response += "Would you like me to explain any of these options in more detail?";
      }
      else if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
        response = "Hello! How can I help with your financial questions today?";
      }
      else {
        response = "I've analyzed your financial data and here's my insight: ";
        response += `You have a good financial foundation with a balance of ₹${userData.balance.toLocaleString()}. `;
        response += `Your income is ₹${userData.monthlyIncome.toLocaleString()} per month with expenses of ₹${userData.monthlyExpenses.toLocaleString()}. `;
        response += "To optimize your finances, consider creating a detailed budget, increasing your savings rate, and reviewing your investment strategy. Is there a specific area you'd like to focus on?";
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: response,
          sender: "ai",
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }, 1000); // Simulate thinking time
  };

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
    
    // Generate AI response
    generateAIResponse(input);
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
          <button
            type="submit"
            disabled={isLoading || input.trim() === ""}
            className={`px-4 py-3 rounded-r-lg ${
              isLoading || input.trim() === ""
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