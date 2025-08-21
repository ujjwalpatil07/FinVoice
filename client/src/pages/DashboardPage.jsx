// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Target,
    BarChart3,
    Calendar,
    Eye
} from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { LineChart } from '../components/charts/LineChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { useUserContext } from '../context/UserContext';

export default function DashboardPage() {
    const { authUser } = useUserContext();
    const [timeRange, setTimeRange] = useState('month');
    const [isLoading, setIsLoading] = useState(true);

    // Sample data - in real app, this would come from API
    const [financialData, setFinancialData] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
        savings: 0,
        goalsProgress: 0,
        spendingByCategory: [],
        incomeExpenseHistory: [],
        investmentPerformance: []
    });

    useEffect(() => {
        // Simulate data loading
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Mock data - replace with actual API calls
                const mockData = {
                    balance: 85420.50,
                    income: 125000,
                    expenses: 39579.50,
                    savings: 25420.50,
                    goalsProgress: 65,
                    spendingByCategory: [
                        { category: 'Food & Dining', amount: 12500, color: '#FF6384' },
                        { category: 'Transportation', amount: 8500, color: '#36A2EB' },
                        { category: 'Entertainment', amount: 6500, color: '#FFCE56' },
                        { category: 'Utilities', amount: 7500, color: '#4BC0C0' },
                        { category: 'Shopping', amount: 4500, color: '#9966FF' },
                    ],
                    incomeExpenseHistory: [
                        { month: 'Jan', income: 120000, expenses: 38000 },
                        { month: 'Feb', income: 125000, expenses: 42000 },
                        { month: 'Mar', income: 130000, expenses: 45000 },
                        { month: 'Apr', income: 125000, expenses: 39500 },
                        { month: 'May', income: 135000, expenses: 41000 },
                        { month: 'Jun', income: 140000, expenses: 43000 },
                    ],
                    investmentPerformance: [
                        { month: 'Jan', value: 100000 },
                        { month: 'Feb', value: 105000 },
                        { month: 'Mar', value: 110000 },
                        { month: 'Apr', value: 115000 },
                        { month: 'May', value: 120000 },
                        { month: 'Jun', value: 125000 },
                    ]
                };
                setFinancialData(mockData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [timeRange]);

    // Prepare chart data
    const incomeExpenseChartData = {
        labels: financialData.incomeExpenseHistory.map(item => item.month),
        datasets: [
            {
                label: 'Income',
                data: financialData.incomeExpenseHistory.map(item => item.income),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Expenses',
                data: financialData.incomeExpenseHistory.map(item => item.expenses),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const spendingChartData = {
        labels: financialData.spendingByCategory.map(item => item.category),
        datasets: [
            {
                data: financialData.spendingByCategory.map(item => item.amount),
                backgroundColor: financialData.spendingByCategory.map(item => item.color),
                borderWidth: 0,
            },
        ],
    };

    const investmentChartData = {
        labels: financialData.investmentPerformance.map(item => item.month),
        datasets: [
            {
                label: 'Portfolio Value',
                data: financialData.investmentPerformance.map(item => item.value),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Welcome back, {authUser?.name}! Here's your financial overview.
                    </p>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Balance"
                    value={financialData.balance}
                    change="+12.5%"
                    changeType="increase"
                    icon={Wallet}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-100"
                />
                <MetricCard
                    title="Monthly Income"
                    value={financialData.income}
                    change="+8.2%"
                    changeType="increase"
                    icon={TrendingUp}
                    iconColor="text-green-600"
                    iconBg="bg-green-100"
                />
                <MetricCard
                    title="Monthly Expenses"
                    value={financialData.expenses}
                    change="-3.1%"
                    changeType="decrease"
                    icon={TrendingDown}
                    iconColor="text-red-600"
                    iconBg="bg-red-100"
                />
                <MetricCard
                    title="Savings Rate"
                    value={`${((financialData.savings / financialData.income) * 100).toFixed(1)}%`}
                    change="+5.3%"
                    changeType="increase"
                    icon={PiggyBank}
                    iconColor="text-purple-600"
                    iconBg="bg-purple-100"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Income vs Expenses
                        </h2>
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <LineChart
                        data={incomeExpenseChartData}
                        className="!h-fit"
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Monthly Trend',
                                },
                            },
                        }}
                    />
                </div>

                {/* Spending by Category */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Spending by Category
                        </h2>
                        <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <DoughnutChart
                        data={spendingChartData}
                        className="h-80"
                        options={{
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Investment Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Investment Performance
                        </h2>
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <LineChart
                        data={investmentChartData}
                        className="h-64"
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Portfolio Growth',
                                },
                            },
                        }}
                    />
                </div>

                {/* Goals Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Goals Progress
                        </h2>
                        <Target className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>Emergency Fund</span>
                                <span>65%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: '65%' }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>Vacation Fund</span>
                                <span>45%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: '45%' }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>New Car Fund</span>
                                <span>30%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: '30%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                        <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Add Expense</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Add Income</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        <Target className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Set Goal</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule</span>
                    </button>
                </div>
            </div>
        </div>
    );
}