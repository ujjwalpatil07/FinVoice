import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Loader, ArrowLeft } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import { useSnackbar } from "notistack";
import {
    addTransaction,
    updateTransaction,
    deleteTransaction
} from "../services/financeService";
import { useNavigate } from "react-router-dom";

export default function TransactionsPage() {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useUserContext();
    const { enqueueSnackbar } = useSnackbar();

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
        relatedGoal: ""
    });
    const [editTransactionId, setEditTransactionId] = useState(null);

    // Show notification
    const showNotification = (message, variant = "success") => {
        enqueueSnackbar(message, {
            variant,
            autoHideDuration: 4000,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            }
        });
    };

    // Load transactions from authUser
    useEffect(() => {
        setIsLoading(true);
        try {
            if (authUser?.allTransactions) {
                const formattedTransactions = authUser.allTransactions.map(tx => ({
                    ...tx,
                    date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : ""
                }));
                setTransactions(formattedTransactions);
            }
        } catch (err) {
            console.error("Failed to load transactions:", err);
            showNotification("Failed to load transactions", "error");
        } finally {
            setIsLoading(false);
        }
    }, [authUser]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setNewTransaction({
            title: "",
            amount: "",
            type: "expense",
            category: "",
            date: new Date().toISOString().split('T')[0],
            description: "",
            relatedGoal: ""
        });
        setEditTransactionId(null);
    };

    // Add or Update Transaction
    const handleAddOrUpdate = async () => {
        if (!newTransaction.title || !newTransaction.amount || isNaN(newTransaction.amount)) {
            showNotification("Title and valid amount are required", "error");
            return;
        }

        setApiLoading(true);

        try {
            if (editTransactionId) {
                // Update existing transaction
                const transactionData = {
                    title: newTransaction.title,
                    amount: Number(newTransaction.amount),
                    type: newTransaction.type,
                    category: newTransaction.category,
                    date: newTransaction.date,
                    description: newTransaction.description,
                    relatedGoal: newTransaction.relatedGoal
                };

                const response = await updateTransaction(authUser._id, editTransactionId, transactionData);

                if (response.success) {
                    setAuthUser(response?.user);
                    showNotification("Transaction updated successfully!");
                    resetForm();
                } else {
                    throw new Error(response.message || "Update failed");
                }
            } else {
                // Create new transaction
                const transactionData = {
                    title: newTransaction.title,
                    amount: Number(newTransaction.amount),
                    type: newTransaction.type,
                    category: newTransaction.category,
                    date: newTransaction.date,
                    description: newTransaction.description,
                    relatedGoal: newTransaction.relatedGoal
                };

                const response = await addTransaction(authUser._id, transactionData);

                if (response.success) {
                    setAuthUser(response?.user)
                    showNotification("Transaction added successfully!");
                    resetForm();
                } else {
                    throw new Error(response.message || "Add failed");
                }
            }
        } catch (error) {
            console.error("Error saving transaction:", error);
            showNotification(error.message || "Failed to save transaction. Please try again.", "error");
        } finally {
            setApiLoading(false);
        }
    };

    const handleEdit = (transaction) => {
        setNewTransaction({
            title: transaction.title || "",
            amount: transaction.amount || "",
            type: transaction.type || "expense",
            category: transaction.category || "",
            date: transaction.date || new Date().toISOString().split('T')[0],
            description: transaction.description || "",
            relatedGoal: transaction.relatedGoal || ""
        });
        setEditTransactionId(transaction._id);
    };

    const handleDelete = async (idx) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            setApiLoading(true);
            try {
                const response = await deleteTransaction(authUser._id, idx);

                if (response.success) {
                    setAuthUser(response?.user);
                    showNotification("Transaction deleted successfully!");
                } else {
                    throw new Error(response.message || "Delete failed");
                }
            } catch (error) {
                showNotification(error.message || "Failed to delete transaction. Please try again.", "error");
            } finally {
                setApiLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
            {/* Loading Overlay */}
            {apiLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center">
                        <Loader className="h-6 w-6 animate-spin text-indigo-600 mr-3" />
                        <span>Processing...</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track and manage all your financial transactions
                    </p>
                </div>
            </div>

            {/* Add / Edit Transaction Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {editTransactionId ? "Edit Transaction" : "Add New Transaction"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={newTransaction.title}
                            onChange={handleInputChange}
                            placeholder="Transaction description"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount (₹) *
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={newTransaction.amount}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type *
                        </label>
                        <select
                            name="type"
                            value={newTransaction.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={newTransaction.category}
                            onChange={handleInputChange}
                            placeholder="e.g., Food, Shopping, Salary"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={newTransaction.date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={newTransaction.description}
                            onChange={handleInputChange}
                            placeholder="Additional details"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    {editTransactionId && (
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel Edit
                        </button>
                    )}
                    <button
                        onClick={handleAddOrUpdate}
                        disabled={apiLoading}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {editTransactionId ? "Update Transaction" : "Add Transaction"}
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Transactions
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transactions.length} transactions found
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Amount (₹)
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No transactions found. Add your first transaction above.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx, idx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            <div>
                                                <div className="font-medium">{tx.title}</div>
                                                {tx.description && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {tx.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {tx.category || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tx.type === 'income'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">
                                            <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(tx)}
                                                    className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(idx)}
                                                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}