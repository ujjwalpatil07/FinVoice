import React, { useState, useEffect } from "react";
import {
    Wallet,
    PlusCircle,
    CreditCard,
    DollarSign,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import CountUp from "react-countup";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { addExpense, addIncome } from "../services/financeService";

export default function MyWalletPage() {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useUserContext();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(true);
    const [walletData, setWalletData] = useState({
        balance: 0,
        recentTransactions: [],
        linkedCards: [],
    });

    // dialog state
    const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);

    // form state
    const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", category: "" });
    const [incomeForm, setIncomeForm] = useState({ amount: "", reason: "" });

    useEffect(() => {
        const loadWalletData = async () => {
            setIsLoading(true);
            try {
                if (!authUser) {
                    setWalletData({ balance: 0, recentTransactions: [], linkedCards: [] });
                    return;
                }

                const balance = authUser?.totalBalance || 0;

                const recentTransactions = (authUser?.allTransactions || [])
                    .slice(-5)
                    .reverse()
                    .map((tx, idx) => ({
                        id: idx + 1,
                        title: tx?.title || "Transaction",
                        amount: tx?.type === "income" ? tx?.amount : -(tx?.amount || 0),
                        date: tx?.date,
                    }));

                setWalletData({ balance, recentTransactions, linkedCards: [] });
            } catch (error) {
                console.error("Failed to load wallet data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadWalletData();
    }, [authUser]);

    // 📌 Handle expense submit
    const handleAddExpense = async () => {
        try {
            const res = await addExpense(authUser?._id, {
                title: expenseForm.title,
                amount: Number(expenseForm.amount),
                category: expenseForm.category,
            });
            setAuthUser(res.data.user); // update global user
            enqueueSnackbar("Expense added successfully", { variant: "success" });
            setOpenExpenseDialog(false);
            setExpenseForm({ title: "", amount: "", category: "" });
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err.response?.data?.message || "Failed to add expense", { variant: "error" });
        }
    };

    const handleAddIncome = async () => {
        try {
            const res = await addIncome(authUser._id, {
                amount: Number(incomeForm.amount),
                reason: incomeForm.reason,
            });
            setAuthUser(res.data.user); // update global user
            enqueueSnackbar("Income added successfully", { variant: "success" });
            setOpenIncomeDialog(false);
            setIncomeForm({ amount: "", reason: "" });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Failed to add income", { variant: "error" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-6">
                <Wallet className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
            </div>

            {/* Wallet Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Wallet Balance</h2>
                <p className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">
                    <CountUp end={walletData.balance} prefix="₹" separator="," decimals={2} decimal="." />
                </p>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
                {walletData.recentTransactions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No transactions available.</p>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {walletData.recentTransactions.map((tx) => (
                            <li key={tx.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{tx.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                    {tx.amount > 0 ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate("/transactions")}
                        className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        View All Transactions →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:scale-105 hover:shadow-md transition-transform"
                        onClick={() => setOpenExpenseDialog(true)}
                    >
                        <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Add Expense</span>
                    </button>

                    <button
                        className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:scale-105 hover:shadow-md transition-transform"
                        onClick={() => setOpenIncomeDialog(true)}
                    >
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Add Income</span>
                    </button>

                    <button
                        className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:scale-105 hover:shadow-md transition-transform"
                        onClick={() => navigate("/add-card")}
                    >
                        <PlusCircle className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Link Card</span>
                    </button>
                </div>
            </div>

            {/* Expense Dialog */}
            <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)} fullWidth maxWidth="sm" >
                <DialogTitle>Add Expense</DialogTitle>
                <DialogContent className="flex flex-col gap-4 mt-2">
                    <TextField
                        label="Title"
                        value={expenseForm.title}
                        onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Amount"
                        type="number"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Category"
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExpenseDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddExpense} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Income Dialog */}
            <Dialog open={openIncomeDialog} onClose={() => setOpenIncomeDialog(false)} fullWidth maxWidth="sm" >
                <DialogTitle>Add Income</DialogTitle>
                <DialogContent className="flex flex-col gap-4 mt-2">
                    <TextField
                        label="Amount"
                        type="number"
                        value={incomeForm.amount}
                        onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Reason"
                        value={incomeForm.reason}
                        onChange={(e) => setIncomeForm({ ...incomeForm, reason: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenIncomeDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddIncome} variant="contained" color="success">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
