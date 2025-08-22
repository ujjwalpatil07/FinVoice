import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart3,
    Calendar,
    Download,
    Filter,
    DollarSign,
    Sparkles,
    Lightbulb
} from 'lucide-react';

// Assuming these components are provided from a separate file as per the original code
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';

// Helper component to create a responsive, fluid card with a title and icon
const ResponsiveCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        </div>
        <div className="flex-1 h-fit relative">
            {children}
        </div>
    </div>
);

// This is the main component, simulating the data fetching and rendering
export default function Analytics() {
    const [timeRange, setTimeRange] = useState('month');
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    // Dummy analytics data, including new GenAI insights
    const [analyticsData, setAnalyticsData] = useState({
        spendingTrend: [],
        categoryBreakdown: [],
        monthlyComparison: [],
        incomeSources: [],
        financialHealth: {},
        genAiInsights: []
    });

    useEffect(() => {
        const loadAnalyticsData = async () => {
            setIsLoading(true);
            try {
                const mockData = {
                    spendingTrend: [
                        { month: 'Jan', amount: 38000 },
                        { month: 'Feb', amount: 42000 },
                        { month: 'Mar', amount: 45000 },
                        { month: 'Apr', amount: 39500 },
                        { month: 'May', amount: 41000 },
                        { month: 'Jun', amount: 43000 },
                    ],
                    categoryBreakdown: [
                        { category: 'Food & Dining', amount: 12500, color: '#FF6384', trend: '+5%' },
                        { category: 'Transportation', amount: 8500, color: '#36A2EB', trend: '-2%' },
                        { category: 'Entertainment', amount: 6500, color: '#FFCE56', trend: '+12%' },
                        { category: 'Utilities', amount: 7500, color: '#4BC0C0', trend: '+3%' },
                        { category: 'Shopping', amount: 4500, color: '#9966FF', trend: '-8%' },
                    ],
                    monthlyComparison: [
                        { month: 'Jan', income: 120000, expenses: 38000, savings: 82000 },
                        { month: 'Feb', income: 125000, expenses: 42000, savings: 83000 },
                        { month: 'Mar', income: 130000, expenses: 45000, savings: 85000 },
                        { month: 'Apr', income: 125000, expenses: 39500, savings: 85500 },
                        { month: 'May', income: 135000, expenses: 41000, savings: 94000 },
                        { month: 'Jun', income: 140000, expenses: 43000, savings: 97000 },
                    ],
                    incomeSources: [
                        { source: 'Salary', amount: 100000, percentage: 71, color: '#10B981' },
                        { source: 'Freelance', amount: 25000, percentage: 18, color: '#3B82F6' },
                        { source: 'Investments', amount: 10000, percentage: 7, color: '#8B5CF6' },
                        { source: 'Other', amount: 5000, percentage: 4, color: '#F59E0B' },
                    ],
                    financialHealth: {
                        savingsRate: 32,
                        expenseToIncome: 31,
                        monthlyGrowth: 5.2,
                        budgetAdherence: 88
                    },
                    // Dummy GenAI data
                    genAiInsights: [
                        {
                            title: 'Actionable Insight',
                            text: 'Your "Food & Dining" expenses have been a primary driver of spending growth this quarter. Consider tracking daily food costs to find savings of up to ₹2,500 monthly.',
                            color: 'bg-blue-50 dark:bg-blue-900/20'
                        },
                        {
                            title: 'Positive Trend Alert',
                            text: 'Excellent job maintaining a high savings rate! Your consistent financial discipline puts you on track to meet your long-term goals ahead of schedule.',
                            color: 'bg-green-50 dark:bg-green-900/20'
                        },
                        {
                            title: 'Budget Optimization',
                            text: 'Your investment income is showing a healthy 7% increase this year. Consider reallocating a portion of your "Shopping" budget to further accelerate your investment growth.',
                            color: 'bg-purple-50 dark:bg-purple-900/20'
                        },
                        {
                            title: 'Long-term Projection',
                            text: 'If you maintain your current savings habits, you are projected to reach your emergency fund goal within the next 8 months, significantly earlier than the average user.',
                            color: 'bg-yellow-50 dark:bg-yellow-900/20'
                        }
                    ]
                };
                setAnalyticsData(mockData);
            } catch (error) {
                console.error('Failed to load analytics data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalyticsData();
    }, [timeRange]);

    // Chart data preparation
    const spendingTrendData = {
        labels: analyticsData.spendingTrend.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Spending',
                data: analyticsData.spendingTrend.map(item => item.amount),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const categoryBreakdownData = {
        labels: analyticsData.categoryBreakdown.map(item => item.category),
        datasets: [
            {
                data: analyticsData.categoryBreakdown.map(item => item.amount),
                backgroundColor: analyticsData.categoryBreakdown.map(item => item.color),
                borderWidth: 0,
            },
        ],
    };

    const monthlyComparisonData = {
        labels: analyticsData.monthlyComparison.map(item => item.month),
        datasets: [
            {
                label: 'Income',
                data: analyticsData.monthlyComparison.map(item => item.income),
                backgroundColor: 'rgb(34, 197, 94)',
            },
            {
                label: 'Expenses',
                data: analyticsData.monthlyComparison.map(item => item.expenses),
                backgroundColor: 'rgb(239, 68, 68)',
            },
            {
                label: 'Savings',
                data: analyticsData.monthlyComparison.map(item => item.savings),
                backgroundColor: 'rgb(59, 130, 246)',
            },
        ],
    };

    const incomeSourcesData = {
        labels: analyticsData.incomeSources.map(item => item.source),
        datasets: [
            {
                data: analyticsData.incomeSources.map(item => item.percentage),
                backgroundColor: analyticsData.incomeSources.map(item => item.color),
                borderWidth: 0,
            },
        ],
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                        Deep insights into your spending patterns and financial health
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                    <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {['overview', 'spending', 'income', 'trends'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Financial Health Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analyticsData.financialHealth.savingsRate}%
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">+5% from last month</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expense/Income</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analyticsData.financialHealth.expenseToIncome}%
                            </p>
                        </div>
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">-2% from last month</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                +{analyticsData.financialHealth.monthlyGrowth}%
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Consistent growth</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Adherence</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analyticsData.financialHealth.budgetAdherence}%
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Excellent control</p>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveCard title="Spending Trend" icon={BarChart3}>
                    <LineChart
                        data={spendingTrendData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.1)',
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                </ResponsiveCard>

                <ResponsiveCard title="Spending by Category" icon={PieChart}>
                    <DoughnutChart
                        data={categoryBreakdownData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        boxWidth: 12,
                                        font: { size: 11 }
                                    }
                                },
                            },
                            cutout: '50%',
                        }}
                    />
                </ResponsiveCard>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveCard title="Income vs Expenses vs Savings" icon={Calendar}>
                    <BarChart
                        data={monthlyComparisonData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.1)',
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                </ResponsiveCard>

                <ResponsiveCard title="Income Sources" icon={DollarSign}>
                    <DoughnutChart
                        data={incomeSourcesData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        boxWidth: 12,
                                        font: { size: 11 }
                                    }
                                },
                            },
                            cutout: '60%',
                        }}
                    />
                </ResponsiveCard>
            </div>

            {/* Category Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Category Trends
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analyticsData.categoryBreakdown.map((category, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div
                                className="w-3 h-3 rounded-full mr-3"
                                style={{ backgroundColor: category.color }}
                            ></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{category.category}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">₹{category.amount.toLocaleString('en-IN')}</p>
                            </div>
                            <span className={`text-xs font-medium ${category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {category.trend}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI-Powered Insights & Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        AI-Powered Insights
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analyticsData.genAiInsights.map((insight, index) => (
                        <div key={index} className={`${insight.color} p-4 rounded-lg`}>
                            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{insight.title}</h3>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{insight.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
