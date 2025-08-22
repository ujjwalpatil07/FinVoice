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
} from 'lucide-react';

import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { useUserContext } from '../context/UserContext';

const ResponsiveCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        </div>
        <div className="flex-1 h-fit relative">{children}</div>
    </div>
);

export default function Analytics() {
    const { authUser } = useUserContext();
    const [timeRange, setTimeRange] = useState('month');
    const [isLoading, setIsLoading] = useState(true);

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
                // Transform MongoDB user data into analytics shape
                const spendingTrend = authUser?.monthlyExpenses?.map(exp => ({
                    month: new Date(exp?.date)?.toLocaleString('default', { month: 'short' }),
                    amount: exp?.amount || 0,
                })) || [];

                const categoryBreakdown = authUser?.monthlyExpenses?.reduce((acc, exp) => {
                    if (!exp?.category) return acc;
                    const existing = acc.find(c => c.category === exp.category);
                    if (existing) {
                        existing.amount += exp?.amount || 0;
                    } else {
                        acc.push({
                            category: exp?.category,
                            amount: exp?.amount || 0,
                            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                            trend: '+0%'
                        });
                    }
                    return acc;
                }, []) || [];

                const monthlyComparison = authUser?.monthlyIncome?.map((inc) => {
                    const month = new Date(inc?.date)?.toLocaleString('default', { month: 'short' });
                    const income = inc?.amount || 0;
                    const expenses = authUser?.monthlyExpenses
                        ?.filter(exp => new Date(exp?.date).getMonth() === new Date(inc?.date).getMonth())
                        ?.reduce((sum, e) => sum + (e?.amount || 0), 0) || 0;
                    const savings = income - expenses;
                    return { month, income, expenses, savings };
                }) || [];

                const incomeSources = authUser?.monthlyIncome?.reduce((acc, inc) => {
                    const reason = inc?.reason || 'Other';
                    const existing = acc.find(i => i.source === reason);
                    if (existing) {
                        existing.amount += inc?.amount || 0;
                    } else {
                        acc.push({
                            source: reason,
                            amount: inc?.amount || 0,
                            percentage: 0,
                            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        });
                    }
                    return acc;
                }, []) || [];

                const totalIncome = incomeSources?.reduce((sum, i) => sum + (i?.amount || 0), 0) || 0;
                incomeSources?.forEach(i => {
                    i.percentage = totalIncome ? Math.round(((i?.amount || 0) / totalIncome) * 100) : 0;
                });

                const savingsRate = monthlyComparison?.length
                    ? Math.round((monthlyComparison.reduce((sum, m) => sum + (m?.savings || 0), 0) /
                        monthlyComparison.reduce((sum, m) => sum + (m?.income || 0), 0)) * 100)
                    : 0;

                const expenseToIncome = monthlyComparison?.length
                    ? Math.round((monthlyComparison.reduce((sum, m) => sum + (m?.expenses || 0), 0) /
                        monthlyComparison.reduce((sum, m) => sum + (m?.income || 0), 0)) * 100)
                    : 0;

                const financialHealth = {
                    savingsRate,
                    expenseToIncome,
                    monthlyGrowth: authUser?.investments?.performance?.slice(-1)?.[0]?.growth || 0,
                    budgetAdherence: 90, // static for now
                };

                const genAiInsights = [
                    {
                        title: 'Actionable Insight',
                        text: 'Your expenses on food seem to be a major chunk. You might save up to 10% by meal planning.',
                        color: 'bg-blue-50 dark:bg-blue-900/20'
                    },
                    {
                        title: 'Positive Trend Alert',
                        text: 'Your savings rate is above average! Keep going to reach your goals faster.',
                        color: 'bg-green-50 dark:bg-green-900/20'
                    }
                ];

                setAnalyticsData({
                    spendingTrend,
                    categoryBreakdown,
                    monthlyComparison,
                    incomeSources,
                    financialHealth,
                    genAiInsights
                });
            } catch (error) {
                console.error('Failed to load analytics data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalyticsData();
    }, [authUser, timeRange]);

    const spendingTrendData = {
        labels: analyticsData?.spendingTrend?.map(item => item?.month) || [],
        datasets: [
            {
                label: 'Monthly Spending',
                data: analyticsData?.spendingTrend?.map(item => item?.amount) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const categoryBreakdownData = {
        labels: analyticsData?.categoryBreakdown?.map(item => item?.category) || [],
        datasets: [
            {
                data: analyticsData?.categoryBreakdown?.map(item => item?.amount) || [],
                backgroundColor: analyticsData?.categoryBreakdown?.map(item => item?.color) || [],
                borderWidth: 0,
            },
        ],
    };

    const monthlyComparisonData = {
        labels: analyticsData?.monthlyComparison?.map(item => item?.month) || [],
        datasets: [
            {
                label: 'Income',
                data: analyticsData?.monthlyComparison?.map(item => item?.income) || [],
                backgroundColor: 'rgb(34, 197, 94)',
            },
            {
                label: 'Expenses',
                data: analyticsData?.monthlyComparison?.map(item => item?.expenses) || [],
                backgroundColor: 'rgb(239, 68, 68)',
            },
            {
                label: 'Savings',
                data: analyticsData?.monthlyComparison?.map(item => item?.savings) || [],
                backgroundColor: 'rgb(59, 130, 246)',
            },
        ],
    };

    const incomeSourcesData = {
        labels: analyticsData?.incomeSources?.map(item => item?.source) || [],
        datasets: [
            {
                data: analyticsData?.incomeSources?.map(item => item?.percentage) || [],
                backgroundColor: analyticsData?.incomeSources?.map(item => item?.color) || [],
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
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 dark:text-white">
            {/* ✅ HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Financial Analytics
                    </h1>
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

            {/* ✅ HEALTH METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
                    <p className="text-2xl font-bold">{analyticsData?.financialHealth?.savingsRate}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expense / Income</p>
                    <p className="text-2xl font-bold">{analyticsData?.financialHealth?.expenseToIncome}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Growth</p>
                    <p className="text-2xl font-bold">+{analyticsData?.financialHealth?.monthlyGrowth}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget Adherence</p>
                    <p className="text-2xl font-bold">{analyticsData?.financialHealth?.budgetAdherence}%</p>
                </div>
            </div>

            {/* ✅ MAIN CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveCard title="Spending Trend" icon={BarChart3}>
                    <LineChart data={spendingTrendData} />
                </ResponsiveCard>
                <ResponsiveCard title="Spending by Category" icon={PieChart}>
                    <DoughnutChart data={categoryBreakdownData} />
                </ResponsiveCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveCard title="Income vs Expenses vs Savings" icon={Calendar}>
                    <BarChart data={monthlyComparisonData} />
                </ResponsiveCard>
                <ResponsiveCard title="Income Sources" icon={DollarSign}>
                    <DoughnutChart data={incomeSourcesData} />
                </ResponsiveCard>
            </div>

            {/* ✅ AI INSIGHTS */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">AI-Powered Insights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analyticsData?.genAiInsights?.map((insight, idx) => (
                        <div key={idx} className={`${insight?.color} p-4 rounded-lg`}>
                            <h3 className="font-medium mb-2">{insight?.title}</h3>
                            <p className="text-sm">{insight?.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
