// src/pages/Transactions.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { useUserContext } from "../context/UserContext";

export default function TransactionsPage() {
    const { authUser } = useUserContext();

    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        date: "",
        description: "",
        category: "",
        amount: "",
        type: "expense",
    });
    const [editTransactionId, setEditTransactionId] = useState(null);

    // Load transactions from authUser
    useEffect(() => {
        if (authUser?.allTransactions) {
            setTransactions(authUser.allTransactions);
        }
    }, [authUser]);

    // Add or Update Transaction
    const handleAddOrUpdate = () => {
        if (
            !newTransaction.date ||
            !newTransaction.description ||
            !newTransaction.category ||
            !newTransaction.amount
        )
            return;

        if (editTransactionId) {
            setTransactions((prev) =>
                prev.map((t) =>
                    t._id === editTransactionId
                        ? { ...t, ...newTransaction, amount: Number(newTransaction.amount) }
                        : t
                )
            );
            setEditTransactionId(null);
        } else {
            setTransactions((prev) => [
                ...prev,
                {
                    _id: Date.now().toString(),
                    ...newTransaction,
                    amount: Number(newTransaction.amount),
                },
            ]);
        }

        setNewTransaction({
            date: "",
            description: "",
            category: "",
            amount: "",
            type: "expense",
        });
    };

    const handleEdit = (transaction) => {
        setNewTransaction({
            date: transaction?.date?.slice(0, 10) || "",
            description: transaction?.description || transaction?.title || "",
            category: transaction?.category || "",
            amount: transaction?.amount || "",
            type: transaction?.type || "expense",
        });
        setEditTransactionId(transaction?._id);
    };

    const handleDelete = (id) => {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Track your recent transactions and manage them efficiently.
            </p>

            {/* Add / Edit Transaction Form */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) =>
                        setNewTransaction((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) =>
                        setNewTransaction((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newTransaction.category}
                    onChange={(e) =>
                        setNewTransaction((prev) => ({
                            ...prev,
                            category: e.target.value,
                        }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) =>
                        setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleAddOrUpdate}
                    className="flex items-center whitespace-nowrap space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl transition"
                >
                    <Plus className="h-4 w-4" />
                    <span>{editTransactionId ? "Update" : "Add"} Transaction</span>
                </button>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                                Description
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                                Category
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200">
                                Amount (₹)
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions?.map((tx) => (
                            <tr
                                key={tx?._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {tx?.date
                                        ? new Date(tx.date).toLocaleDateString("en-IN")
                                        : ""}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {tx?.description || tx?.title}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {tx?.category}
                                </td>
                                <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">
                                    ₹{tx?.amount?.toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-2 text-center flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(tx)}
                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <Edit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tx?._id)}
                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
