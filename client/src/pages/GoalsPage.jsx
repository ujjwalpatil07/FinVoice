import React, { useState, useEffect } from "react";
import {
    Plus, Target, Calendar, IndianRupee, Edit3, Trash2, ArrowLeft,
    TrendingUp, PieChart, Sparkles, Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { addGoal, updateGoal, toggleGoalCompletion, deleteGoal } from "../services/financeService";
import { useSnackbar } from "notistack";

export default function GoalsPage() {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useUserContext();
    const { enqueueSnackbar } = useSnackbar();

    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [filter, setFilter] = useState("all");
    const [apiLoading, setApiLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        targetAmount: "",
        targetDate: "",
        category: "savings",
        priority: "medium",
        description: ""
    });

    // Show snackbar notification using Notistack
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

    // Load goals from authUser
    useEffect(() => {
        setIsLoading(true);
        try {
            if (authUser?.goals) {
                const userGoals = authUser.goals.map((goal, idx) => ({
                    _id: goal._id || `goal-${idx}`,
                    name: goal.name || "Untitled Goal",
                    targetAmount: goal.targetAmount || 0,
                    currentAmount: goal.currentAmount || 0,
                    targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : "",
                    category: goal.category || "savings",
                    priority: goal.priority || "medium",
                    description: goal.description || "",
                    createdAt: goal.createdAt ? new Date(goal.createdAt).toISOString().split("T")[0] : "",
                    completed: goal.completed || false,
                    progress: goal.progress || 0
                }));
                setGoals(userGoals);
            }
        } catch (err) {
            console.error("Failed to load goals:", err);
            showNotification("Failed to load goals", "error");
        } finally {
            setIsLoading(false);
        }
    }, [authUser]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            targetAmount: "",
            targetDate: "",
            category: "savings",
            priority: "medium",
            description: ""
        });
        setEditingGoal(null);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setFormData({
            name: goal.name,
            targetAmount: goal.targetAmount,
            targetDate: goal.targetDate,
            category: goal.category,
            priority: goal.priority,
            description: goal.description
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiLoading(true);

        try {
            let response;
            if (editingGoal) {
                const goalData = {
                    name: formData.name,
                    targetAmount: Number(formData.targetAmount),
                    targetDate: formData.targetDate,
                    category: formData.category,
                    priority: formData.priority,
                    description: formData.description
                };

                response = await updateGoal(authUser._id, editingGoal._id, goalData);
                showNotification("Goal updated successfully!");
            } else {
                // Create new goal
                const goalData = {
                    name: formData.name,
                    targetAmount: Number(formData.targetAmount),
                    targetDate: formData.targetDate,
                    category: formData.category,
                    priority: formData.priority,
                    description: formData.description
                };

                response = await addGoal(authUser._id, goalData);
                showNotification("Goal created successfully!");
            }

            // Update local state with the response data
            if (response.success) {
                // Refresh user data to get updated goals
                setAuthUser(response?.user);
                setShowForm(false);
                resetForm();
            } else {
                throw new Error(response.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving goal:", error);
            showNotification(error.message || "Failed to save goal. Please try again.", "error");
        } finally {
            setApiLoading(false);
        }
    };

    const handleDelete = async (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            setApiLoading(true);
            try {
                const response = await deleteGoal(authUser._id, goalId);

                if (response.success) {
                    setAuthUser(response?.user)
                    showNotification("Goal deleted successfully!");
                } else {
                    throw new Error(response.message || "Delete operation failed");
                }
            } catch (error) {
                showNotification(error.message || "Failed to delete goal. Please try again.", "error");
            } finally {
                setApiLoading(false);
            }
        }
    };

    const handleToggleCompletion = async (goalId, currentStatus) => {
        setApiLoading(true);
        try {
            const response = await toggleGoalCompletion(authUser._id, goalId);

            if (response.success) {
                setAuthUser(response?.user);
                showNotification(`Goal marked as ${!currentStatus ? "completed" : "active"}!`);
            } else {
                throw new Error(response.message || "Toggle operation failed");
            }
        } catch (error) {
            console.error("Error toggling goal completion:", error);
            showNotification(error.message || "Failed to update goal status. Please try again.", "error");
        } finally {
            setApiLoading(false);
        }
    };

    const calculateProgress = (current, target) => {
        return target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    };

    const filteredGoals = goals.filter(goal => {
        if (filter === "active") return !goal.completed;
        if (filter === "completed") return goal.completed;
        return true;
    });

    const totalGoals = goals?.length || 0;
    const completedGoals = goals?.filter(g => g.completed)?.length || 0;
    const totalTargetAmount = goals?.reduce((sum, g) => sum + (g.targetAmount || 0), 0) || 0;
    const totalSavedAmount = goals?.reduce((sum, g) => sum + (g.currentAmount || 0), 0) || 0;
    const overallProgress = totalTargetAmount > 0
        ? Math.min(100, Math.round((totalSavedAmount / totalTargetAmount) * 100))
        : 0;

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex items-center mb-4 sm:mb-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Plan, track and achieve your financial dreams
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Goal
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mr-4">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Goals</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalGoals}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 mr-4">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedGoals}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mr-4">
                            <PieChart className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Progress</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 mr-4">
                            <IndianRupee className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Saved</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalSavedAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                        onClick={() => setFilter("all")}
                    >
                        All Goals
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === "active" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                        onClick={() => setFilter("active")}
                    >
                        Active
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === "completed" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                        onClick={() => setFilter("completed")}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Goals List */}
            <div className="grid grid-cols-1 gap-6 mb-8">
                {filteredGoals.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === "completed"
                                ? "You haven't completed any goals yet."
                                : "Create your first financial goal to get started."}
                        </p>
                    </div>
                ) : (
                    filteredGoals.map(goal => {
                        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                        const daysRemaining = Math.ceil(
                            (new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)
                        );

                        return (
                            <div key={goal._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div className="flex items-center mb-2 md:mb-0">
                                        <div className={`p-2 rounded-full mr-3 ${goal.priority === "high" ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                            goal.priority === "medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" :
                                                "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                            }`}>
                                            <Target className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                                        {goal.completed && (
                                            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium rounded-full">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(goal)}
                                            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal._id)}
                                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 mb-4">{goal.description}</p>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-700 ${progress < 30 ? "bg-red-500" :
                                                progress < 70 ? "bg-yellow-500" : "bg-green-500"
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        <span>₹{goal.currentAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}</span>
                                        <span>{daysRemaining > 0 ? `${daysRemaining} days left` : "Deadline passed"}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className="capitalize">• {goal.category}</span>
                                        <span className="capitalize">• {goal.priority} priority</span>
                                    </div>
                                    <button
                                        onClick={() => handleToggleCompletion(goal._id, goal.completed)}
                                        className={`mt-3 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${goal.completed
                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                            : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                            }`}
                                    >
                                        {goal.completed ? "Mark as Active" : "Mark as Completed"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex items-center mb-4">
                    <Sparkles className="h-6 w-6 text-yellow-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Based on your goals, we recommend increasing your monthly savings by 15% to reach your targets faster.
                    Consider automating transfers to your goals right after you receive your income.
                </p>
                <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                    View detailed plan →
                </button>
            </div>

            {/* Goal Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {editingGoal ? "Edit Goal" : "Create New Goal"}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Goal Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Target Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="targetAmount"
                                            value={formData.targetAmount}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Target Date
                                        </label>
                                        <input
                                            type="date"
                                            name="targetDate"
                                            value={formData.targetDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="savings">Savings</option>
                                                <option value="emergency">Emergency Fund</option>
                                                <option value="travel">Travel</option>
                                                <option value="education">Education</option>
                                                <option value="home">Home</option>
                                                <option value="vehicle">Vehicle</option>
                                                <option value="electronics">Electronics</option>
                                                <option value="health">Health</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Priority
                                            </label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        disabled={apiLoading}
                                    >
                                        {apiLoading ? "Processing..." : (editingGoal ? "Update Goal" : "Create Goal")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}