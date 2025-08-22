// src/pages/Budget.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

export default function BudgetPage() {
    const [budgets, setBudgets] = useState([
        { id: 1, category: 'Food & Dining', limit: 15000, spent: 12500 },
        { id: 2, category: 'Transportation', limit: 10000, spent: 8500 },
        { id: 3, category: 'Entertainment', limit: 8000, spent: 6500 },
        { id: 4, category: 'Shopping', limit: 7000, spent: 4500 },
    ]);

    const [newBudget, setNewBudget] = useState({ category: '', limit: '' });
    const [editBudgetId, setEditBudgetId] = useState(null);

    const handleAddOrUpdate = () => {
        if (!newBudget.category || !newBudget.limit) return;

        if (editBudgetId) {
            // Update existing budget
            setBudgets(prev =>
                prev.map(b => (b.id === editBudgetId ? { ...b, ...newBudget, limit: Number(newBudget.limit) } : b))
            );
            setEditBudgetId(null);
        } else {
            // Add new budget
            setBudgets(prev => [...prev, { id: Date.now(), ...newBudget, limit: Number(newBudget.limit), spent: 0 }]);
        }
        setNewBudget({ category: '', limit: '' });
    };

    const handleEdit = (budget) => {
        setNewBudget({ category: budget.category, limit: budget.limit });
        setEditBudgetId(budget.id);
    };

    const handleDelete = (id) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Set budgets for different categories and track your spending.</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <input
                    type="text"
                    placeholder="Category"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="number"
                    placeholder="Budget Limit"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleAddOrUpdate}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl transition"
                >
                    <Plus className="h-4 w-4" />
                    <span>{editBudgetId ? 'Update Budget' : 'Add Budget'}</span>
                </button>
            </div>

            {/* Budgets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((budget) => {
                    const spentPercent = Math.min((budget.spent / budget.limit) * 100, 100);
                    return (
                        <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Spent: ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(budget)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Edit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </button>
                                    <button onClick={() => handleDelete(budget.id)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div
                                    className={`h-2 rounded-full ${spentPercent < 50 ? 'bg-green-500' : spentPercent < 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${spentPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
