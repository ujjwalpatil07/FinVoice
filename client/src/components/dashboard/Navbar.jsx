// src/components/dashboard/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  X,
  Home,
  PieChart,
  Wallet,
  Target,
  MessageSquare,
  BarChart3,
  CreditCard,
  Receipt
} from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";
import { useUserContext } from "../../context/UserContext";

export default function Navbar() {
  const { theme, toggleTheme } = useThemeContext();
  const { authUser, markNotificationAsRead } = useUserContext();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileSidebarRef = useRef(null);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (mobileSidebarRef.current && !mobileSidebarRef.current.contains(event.target) && 
          !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const unreadNotifications = authUser?.notifications?.filter((n) => !n.read) || [];

  // Mobile sidebar navigation items
  const mobileNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <PieChart className="h-5 w-5" />
    },
    {
      name: 'My Wallet',
      path: '/wallet',
      icon: <Wallet className="h-5 w-5" />
    },
    {
      name: 'Goals',
      path: '/goals',
      icon: <Target className="h-5 w-5" />
    },
    {
      name: 'AI Assistant',
      path: '/assistant',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: 'Budget',
      path: '/budget',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      name: 'Bills',
      path: '/bills',
      icon: <Receipt className="h-5 w-5" />
    }
  ];

  return (
    <>
      <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm h-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left side - Mobile menu button and search */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - Only show on smaller screens */}
            <button
              data-mobile-menu-button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Search - Hidden on mobile, visible on medium screens and up */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-md"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions, analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Mobile search button - Only show on small screens */}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Search className="h-5 w-5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Notifications
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {authUser?.notifications?.length > 0 ? (
                      authUser.notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-4 text-sm cursor-pointer border-b border-gray-100 dark:border-gray-700 ${
                            !n.read
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <p className="text-gray-700 dark:text-gray-300">
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(n.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {authUser?.name?.charAt(0) || "U"}
                </div>
                <div className="hidden lg:block">
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {authUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {authUser?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                    >
                      <User className="h-4 w-4 mr-2" /> Profile
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                    >
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </a>
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        console.log("Sign out clicked");
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div 
            ref={mobileSidebarRef}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                    <span className="text-white font-bold text-lg">FV</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">FinVoice</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* User Info */}
            {authUser && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {authUser.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {authUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {authUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {mobileNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-shrink-0 text-gray-500">
                    {item.icon}
                  </div>
                  <span className="ml-3">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <a
                href="/settings"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors mb-2"
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </a>
              <button
                onClick={() => {
                  console.log("Mobile sign out clicked");
                  setIsMobileSidebarOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}