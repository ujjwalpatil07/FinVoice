// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Target,
    BarChart3,
    Calendar,
    Eye,
    PlusCircle,
    Sparkles,
} from "lucide-react";
import { MetricCard } from "../components/dashboard/MetricCard";
import { LineChart } from "../components/charts/LineChart";
import { DoughnutChart } from "../components/charts/DoughnutChart";
import { useUserContext } from "../context/UserContext";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { authUser } = useUserContext();
    const [timeRange, setTimeRange] = useState("month");
    const [isLoading, setIsLoading] = useState(true);

    const [financialData, setFinancialData] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
        savings: 0,
        goalsProgress: 0,
        spendingByCategory: [],
        incomeExpenseHistory: [],
        investmentPerformance: [],
        recentTransactions: [],
    });

    const mainDream = "Buy a Home";

    function getGenAIAdvice() {
        const highestSpending = financialData.spendingByCategory
            .sort((a, b) => b.amount - a.amount)[0];
        const savingsRate = (financialData.savings / financialData.income) * 100;
        const totalInvestments = financialData.investmentPerformance.length > 0
            ? financialData.investmentPerformance[financialData.investmentPerformance.length - 1].value
            : 0;

        let advice = [
            `🔍 <b>Highest Spending:</b> You spent the most on <b>${highestSpending?.category ?? 'N/A'}</b> this month. Try setting a budget or reducing discretionary spending in that area.`,
        ];

        if (totalInvestments > 100000) {
            advice.push(`📈 <b>Investment Tip:</b> Your portfolio is performing well! Consider rebalancing your assets to lock in gains.`);
        } else {
            advice.push(`💡 <b>Start Investing:</b> It looks like you're building a strong savings foundation. As you save more, consider starting with a small, diversified investment to grow your wealth over time.`);
        }

        if (savingsRate > 20) {
            advice.push(`🎉 <b>Great job!</b> Your savings rate is at <b>${savingsRate.toFixed(1)}%</b>, well above the recommended 20%. You're on a great path to reaching your goals!`);
        } else {
            advice.push(`🚀 <b>Tip:</b> Increasing your savings rate to 20% or more could help you reach your goals faster. Look for ways to automate savings!`);
        }

        advice.push(`🌟 <b>Dream Tracker:</b> Keep up the great work to achieve your dream: <b>${mainDream}</b>!`);

        return advice;
    }

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Mock API data
                const mockData = {
                    balance: 85420.5,
                    income: 125000,
                    expenses: 39579.5,
                    savings: 25420.5,
                    goalsProgress: 65,
                    spendingByCategory: [
                        { category: "Food & Dining", amount: 12500, color: "#FF6384" },
                        { category: "Transportation", amount: 8500, color: "#36A2EB" },
                        { category: "Entertainment", amount: 6500, color: "#FFCE56" },
                        { category: "Utilities", amount: 7500, color: "#4BC0C0" },
                        { category: "Shopping", amount: 4500, color: "#9966FF" },
                    ],
                    incomeExpenseHistory: [
                        { month: "Jan", income: 120000, expenses: 38000 },
                        { month: "Feb", income: 125000, expenses: 42000 },
                        { month: "Mar", income: 130000, expenses: 45000 },
                        { month: "Apr", income: 125000, expenses: 39500 },
                        { month: "May", income: 135000, expenses: 41000 },
                        { month: "Jun", income: 140000, expenses: 43000 },
                    ],
                    investmentPerformance: [
                        { month: "Jan", value: 100000 },
                        { month: "Feb", value: 105000 },
                        { month: "Mar", value: 110000 },
                        { month: "Apr", value: 115000 },
                        { month: "May", value: 120000 },
                        { month: "Jun", value: 125000 },
                    ],
                    recentTransactions: [
                        { id: 1, title: "Grocery Store", amount: -4500, date: "2025-08-15" },
                        { id: 2, title: "Salary Credit", amount: 125000, date: "2025-08-01" },
                        { id: 3, title: "Netflix", amount: -499, date: "2025-08-10" },
                        { id: 4, title: "Petrol", amount: -1800, date: "2025-08-12" },
                    ],
                };
                setFinancialData(mockData);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [timeRange]);

    const incomeExpenseChartData = {
        labels: financialData.incomeExpenseHistory.map((item) => item.month),
        datasets: [
            {
                label: "Income",
                data: financialData.incomeExpenseHistory.map((item) => item.income),
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Expenses",
                data: financialData.incomeExpenseHistory.map((item) => item.expenses),
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const spendingChartData = {
        labels: financialData.spendingByCategory.map((item) => item.category),
        datasets: [
            {
                data: financialData.spendingByCategory.map((item) => item.amount),
                backgroundColor: financialData.spendingByCategory.map((item) => item.color),
                borderWidth: 0,
            },
        ],
    };

    const investmentChartData = {
        labels: financialData.investmentPerformance.map((item) => item.month),
        datasets: [
            {
                label: "Portfolio Value",
                data: financialData.investmentPerformance.map((item) => item.value),
                borderColor: "rgb(79, 70, 229)",
                backgroundColor: "rgba(79, 70, 229, 0.1)",
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

    const aiAdvice = getGenAIAdvice();

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-8">

            {/* GenAI Info + Personalized Insights Section */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                {/* Sparkle Decorations */}
                <Sparkles className="h-16 w-16 text-yellow-300 absolute -top-4 -left-4 opacity-30" />
                <Sparkles className="h-10 w-10 text-yellow-300 absolute -bottom-2 -right-2 opacity-50 rotate-12" />

                {/* Header */}
                <div className="flex items-center mb-4">
                    <Sparkles className="h-7 w-7 text-yellow-500 mr-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Insights</h3>
                </div>

                {/* AI Advice List */}
                <ul className="space-y-3 text-sm">
                    {aiAdvice.map((line, idx) => (
                        <li
                            key={idx}
                            className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                            dangerouslySetInnerHTML={{ __html: line }}
                        />
                    ))}
                </ul>
            </div>


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
                <MetricCard title="Total Balance" value={<CountUp end={financialData.balance} separator="," prefix="₹" />} change="+12.5%" changeType="increase" icon={Wallet} iconColor="text-blue-600" iconBg="bg-blue-100" />
                <MetricCard title="Monthly Income" value={<CountUp end={financialData.income} separator="," prefix="₹" />} change="+8.2%" changeType="increase" icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-100" />
                <MetricCard title="Monthly Expenses" value={<CountUp end={financialData.expenses} separator="," prefix="₹" />} change="-3.1%" changeType="decrease" icon={TrendingDown} iconColor="text-red-600" iconBg="bg-red-100" />
                <MetricCard title="Savings Rate" value={`${((financialData.savings / financialData.income) * 100).toFixed(1)}%`} change="+5.3%" changeType="increase" icon={PiggyBank} iconColor="text-purple-600" iconBg="bg-purple-100" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Income vs Expenses</h2>
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <LineChart data={incomeExpenseChartData} className="w-full" />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category</h2>
                        <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <DoughnutChart data={spendingChartData} className="h-fit md:h-70" />
                </div>
            </div>

            {/* Investment + Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Performance</h2>
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <LineChart data={investmentChartData} className="h-fit md:h-64" />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals Progress</h2>
                        <Target className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "Emergency Fund", percent: 65, color: "bg-indigo-600" },
                            { label: "Vacation Fund", percent: 45, color: "bg-green-600" },
                            { label: "New Car Fund", percent: 30, color: "bg-blue-600" },
                        ].map((goal) => (
                            <div key={goal.label}>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span>{goal.label}</span>
                                    <span>{goal.percent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div className={`${goal.color} h-2 rounded-full transition-all duration-700`} style={{ width: `${goal.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Transactions
                </h2>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {financialData.recentTransactions.slice(0, 5).map((tx) => (
                        <li key={tx.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{tx.title}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(tx.date).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                                {tx.amount > 0 ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate("/transactions")}
                        className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-400"
                    >
                        View All Transactions →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Add Expense", icon: Wallet, color: "indigo" },
                        { label: "Add Income", icon: TrendingUp, color: "green" },
                        { label: "Set Goal", icon: Target, color: "purple" },
                        { label: "Schedule", icon: Calendar, color: "blue" },
                    ].map((action) => (
                        <button
                            key={action.label}
                            className={`flex flex-col items-center p-4 rounded-lg hover:scale-105 hover:shadow-md transition-transform bg-${action.color}-50 dark:bg-${action.color}-900/20`}
                        >
                            <action.icon className={`h-6 w-6 mb-2 text-${action.color}-600 dark:text-${action.color}-400`} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                        </button>
                    ))}
                    <button className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-105 transition">
                        <PlusCircle className="h-6 w-6 text-gray-500 dark:text-gray-300 mb-2" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">More</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
