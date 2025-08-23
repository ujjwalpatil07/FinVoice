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
import axios from "axios";

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

    const mainDream = authUser?.mainDream ?? "Your Dream Goal";

    function getGenAIAdvice() {
        const highestSpending = financialData?.spendingByCategory?.length
            ? [...financialData.spendingByCategory].sort((a, b) => b.amount - a.amount)[0]
            : null;

        const savingsRate =
            financialData?.income > 0
                ? (financialData?.savings / financialData?.income) * 100
                : 0;

        const totalInvestments =
            financialData?.investmentPerformance?.length > 0
                ? financialData.investmentPerformance[financialData.investmentPerformance.length - 1]?.value ?? 0
                : 0;

        let advice = [
            `🔍 <b>Highest Spending:</b> You spent the most on <b>${highestSpending?.category ?? "N/A"}</b> this month.`,
        ];

        if (totalInvestments > 100000) {
            advice.push(`📈 <b>Investment Tip:</b> Your portfolio is performing well! Consider rebalancing your assets.`);
        } else {
            advice.push(`💡 <b>Start Investing:</b> Consider starting with a small, diversified investment.`);
        }

        if (savingsRate > 20) {
            advice.push(`🎉 <b>Great job!</b> Your savings rate is at <b>${savingsRate.toFixed(1)}%</b>.`);
        } else {
            advice.push(`🚀 <b>Tip:</b> Increasing your savings rate to 20% or more could help you reach your goals faster.`);
        }

        advice.push(`🌟 <b>Dream Tracker:</b> Keep up the great work to achieve your dream: <b>${mainDream}</b>!`);
        return advice;
    }

    useEffect(() => {
        if (!authUser) return;

        setIsLoading(true);
        try {
            // Process real data from authUser
            const income = authUser?.monthlyIncome?.reduce((sum, inc) => sum + (inc?.amount ?? 0), 0) ?? 0;
            const expenses = authUser?.monthlyExpenses
                ?.filter((exp) => exp?.type === "expense")
                .reduce((sum, exp) => sum + (exp?.amount ?? 0), 0) ?? 0;
            const savings = authUser?.savings?.reduce((sum, s) => sum + (s?.amount ?? 0), 0) ?? 0;

            const spendingByCategory = authUser?.monthlyExpenses?.map((exp, i) => ({
                category: exp?.category ?? "Other",
                amount: exp?.amount ?? 0,
                color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][i % 5],
            })) ?? [];

            const incomeExpenseHistory = authUser?.monthlyIncome?.map((inc, i) => ({
                month: new Date(inc?.date ?? Date.now()).toLocaleString("default", { month: "short" }),
                income: inc?.amount ?? 0,
                expenses: authUser?.monthlyExpenses?.[i]?.amount ?? 0,
            })) ?? [];

            const investmentPerformance = authUser?.investments?.performance?.map((p) => ({
                month: new Date(p?.date ?? Date.now()).toLocaleString("default", { month: "short" }),
                value: p?.value ?? 0,
            })) ?? [];

            const totalProgress = authUser?.goals?.reduce((sum, g) => sum + (g?.progress ?? 0), 0) ?? 0;
            const goalsProgress = totalProgress / (authUser?.goals?.length || 1);



            const recentTransactions = authUser?.allTransactions
                ?.slice(-5)
                .reverse()
                .map((tx, i) => ({
                    id: i + 1,
                    title: tx?.title ?? "Untitled",
                    amount: tx?.type === "income" ? (tx?.amount ?? 0) : -(tx?.amount ?? 0),
                    date: tx?.date ?? Date.now(),
                })) ?? [];

            setFinancialData({
                balance: authUser?.totalBalance ?? 0,
                income,
                expenses,
                savings,
                goalsProgress,
                spendingByCategory,
                incomeExpenseHistory,
                investmentPerformance,
                recentTransactions,
            });
        } catch (err) {
            console.error("Error while processing dashboard data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [authUser, timeRange]);

    // In your DashboardPage.jsx
    const handleAddExpense = async (expenseData) => {
        try {
            console.log('Sending expense data:', expenseData);

            // Make API call to add expense
            const response = await axios.post('http://localhost:9001/expense', {
                email: "u@p.com", // Get this from your auth context
                expense: expenseData
            });

            console.log('Expense added successfully:', response.data);
            // Refresh your data or update state as needed

            return response.data; // Return the response data

        } catch (error) {
            console.error('Error adding expense:', error);

            // Check if we have a response with error details
            if (error.response && error.response.data) {
                console.error('Server error details:', error.response.data);
                throw new Error(error.response.data.error || 'Failed to add expense');
            } else if (error.request) {
                console.error('No response received:', error.request);
                throw new Error('No response from server. Please check your connection.');
            } else {
                console.error('Request setup error:', error.message);
                throw new Error('Failed to setup request: ' + error.message);
            }
        }
    };

    const incomeExpenseChartData = {
        labels: financialData?.incomeExpenseHistory?.map((item) => item?.month) ?? [],
        datasets: [
            {
                label: "Income",
                data: financialData?.incomeExpenseHistory?.map((item) => item?.income) ?? [],
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Expenses",
                data: financialData?.incomeExpenseHistory?.map((item) => item?.expenses) ?? [],
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const spendingChartData = {
        labels: financialData?.spendingByCategory?.map((item) => item?.category) ?? [],
        datasets: [
            {
                data: financialData?.spendingByCategory?.map((item) => item?.amount) ?? [],
                backgroundColor: financialData?.spendingByCategory?.map((item) => item?.color) ?? [],
                borderWidth: 0,
            },
        ],
    };

    const investmentChartData = {
        labels: financialData?.investmentPerformance?.map((item) => item?.month) ?? [],
        datasets: [
            {
                label: "Portfolio Value",
                data: financialData?.investmentPerformance?.map((item) => item?.value) ?? [],
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
            {/* GenAI Insights */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                <Sparkles className="h-16 w-16 text-yellow-300 absolute -top-4 -left-4 opacity-30" />
                <Sparkles className="h-10 w-10 text-yellow-300 absolute -bottom-2 -right-2 opacity-50 rotate-12" />

                <div className="flex items-center mb-4">
                    <Sparkles className="h-7 w-7 text-yellow-500 mr-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Insights</h3>
                </div>

                <ul className="space-y-3 text-sm">
                    {aiAdvice?.map((line, idx) => (
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
                        Welcome back, {authUser?.fullName ?? "User"}! Here's your financial overview.
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
                <MetricCard title="Total Balance" value={<CountUp end={financialData?.balance ?? 0} separator="," prefix="₹" />} change="0%" changeType="none" icon={Wallet} iconColor="text-blue-600" iconBg="bg-blue-100" />
                <MetricCard title="Monthly Income" value={<CountUp end={financialData?.income ?? 0} separator="," prefix="₹" />} change="+8.2%" changeType="increase" icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-100" />
                <MetricCard title="Monthly Expenses" value={<CountUp end={financialData?.expenses ?? 0} separator="," prefix="₹" />} change="-3.1%" changeType="decrease" icon={TrendingDown} iconColor="text-red-600" iconBg="bg-red-100" onAddExpense={handleAddExpense}
/>
                <MetricCard title="Savings Rate" value={`${((financialData?.savings / (financialData?.income || 1)) * 100).toFixed(1)}%`} change="+5.3%" changeType="increase" icon={PiggyBank} iconColor="text-purple-600" iconBg="bg-purple-100" />
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
                        {authUser?.goals?.map((goal, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span>{goal?.name ?? "Unnamed Goal"}</span>
                                    <span>{goal?.progress ?? 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`bg-indigo-600 h-2 rounded-full transition-all duration-700`}
                                        style={{ width: `${goal?.progress ?? 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) ?? <p>No goals set yet.</p>}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {financialData?.recentTransactions?.map((tx) => (
                        <li key={tx?.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{tx?.title}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(tx?.date).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`font-semibold ${tx?.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                                {tx?.amount > 0 ? "+" : "-"}₹{Math.abs(tx?.amount ?? 0).toLocaleString()}
                            </span>
                        </li>
                    )) ?? <p>No transactions yet.</p>}
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
        </div>
    );
}
