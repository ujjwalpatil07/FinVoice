// src/components/dashboard/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, PieChart, Wallet, Target, MessageSquare,
    BarChart3, CreditCard, Receipt, LogOut,
    ChevronRight, Sparkles, HelpCircle
} from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

export default function Sidebar() {

    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation();
    const { authUser, updateUser } = useUserContext();

    const navigationItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: <Home className="h-5 w-5" />,
            badge: null
        },
        {
            name: 'Analytics',
            path: '/analytics',
            icon: <PieChart className="h-5 w-5" />,
            badge: 'New'
        },
        {
            name: 'My Wallet',
            path: '/wallet',
            icon: <Wallet className="h-5 w-5" />,
            badge: null
        },
        {
            name: 'Goals',
            path: '/goals',
            icon: <Target className="h-5 w-5" />,
            badge: authUser?.goals?.filter(g => !g.completed).length || null
        },
        {
            name: 'AI Assistant',
            path: '/assistant',
            icon: <MessageSquare className="h-5 w-5" />,
            badge: null
        },
        {
            name: 'Budget',
            path: '/budget',
            icon: <BarChart3 className="h-5 w-5" />,
            badge: null
        },
        {
            name: 'Transactions',
            path: '/transactions',
            icon: <CreditCard className="h-5 w-5" />,
            badge: null
        },
    ];

    const secondaryItems = [
        {
            name: 'Help & Support',
            path: '/help',
            icon: <HelpCircle className="h-5 w-5" />
        }
    ];

    const totalBalance = authUser?.totalBalance || 0;

    const NavItem = ({ item, showText = true }) => {
        const isActive = location.pathname === item.path;

        return (
            <Link
                to={item.path}
                className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group ${isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    } ${showText ? 'justify-start' : 'justify-center'}`}
            >
                <div className={`flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                    {item.icon}
                </div>
                {showText && (
                    <>
                        <span className="ml-3 flex-1">{item.name}</span>
                        {item.badge && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full min-w-[20px] text-center ${typeof item.badge === 'number'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                {item.badge}
                            </span>
                        )}
                    </>
                )}
            </Link>
        );
    };

    const NavItemCollapsed = ({ item }) => {
        const isActive = location.pathname === item.path;

        return (
            <Link
                to={item.path}
                className={`flex items-center justify-center rounded-lg p-3 text-sm font-medium transition-all duration-200 group relative ${isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                title={item.name}
            >
                <div className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                    {item.icon}
                </div>
            </Link>
        );
    };

    const handleLogout = () => {
        updateUser(null);
        navigate("/login");
    }

    return (
        <div className={`hidden md:flex bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isExpanded ? 'w-70' : 'w-20'} h-full flex flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    {isExpanded ? (
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                                <span className="text-white font-bold text-lg">FV</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">FinVoice</span>
                        </Link>
                    ) : (
                        <Link to="/" className="flex justify-center w-full">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                                <span className="text-white font-bold text-sm">FV</span>
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Quick Stats - Expanded Only */}
            {isExpanded && (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Balance</span>
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{totalBalance.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {authUser?.bankAccounts?.length || 0} linked accounts
                    </p>
                </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
                {isExpanded ? (
                    navigationItems.map((item) => (
                        <NavItem key={item.name} item={item} showText={true} />
                    ))
                ) : (
                    <div className="space-y-2">
                        {navigationItems.map((item) => (
                            <NavItemCollapsed key={item.name} item={item} />
                        ))}
                    </div>
                )}
            </nav>

            {/* Secondary Navigation */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
                {isExpanded ? (
                    <>
                        {secondaryItems.map((item) => (
                            <NavItem key={item.name} item={item} showText={true} />
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="ml-3">Sign Out</span>
                        </button>
                    </>
                ) : (
                    <div className="space-y-2">
                        {secondaryItems.map((item) => (
                            <NavItemCollapsed key={item.name} item={item} />
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center rounded-lg p-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* User Profile - Bottom (Expanded Only) */}
            {isExpanded && authUser && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {authUser.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {authUser.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {authUser.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}