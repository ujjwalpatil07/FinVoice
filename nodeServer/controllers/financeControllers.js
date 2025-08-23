import User from "../models/UserSchema.js";

// Helper function to safely add transaction
const addTransactionRecord = (user, transactionData) => {
  const { title, amount, type, category, relatedGoal, description } =
    transactionData;

  // Ensure all fields are proper types
  user.allTransactions.push({
    title: title?.toString() || "No Title",
    amount: Number(amount) || 0,
    type: type?.toString() || "income",
    category: category?.toString() || "Other",
    relatedGoal: relatedGoal?.toString() || "",
    description: description?.toString() || "",
    date: new Date(),
  });
};

export const addIncome = async (req, res) => {
  const { userId } = req.params;
  const { amount, reason } = req.body;

  // Validate input
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Convert values to proper types
  const incomeAmount = Number(amount);
  const incomeReason = reason?.toString() || "Income";

  // Push to monthlyIncome
  user.monthlyIncome.push({
    amount: incomeAmount,
    reason: incomeReason,
    date: new Date(),
  });

  console.log(userId, incomeReason, incomeAmount);

  // Update total balance
  user.totalBalance += incomeAmount;

  // Add to allTransactions - PROPER WAY
  user.allTransactions.push({
    title: incomeReason,
    amount: incomeAmount,
    type: "income",
    category: "Income", // Don't use empty string
    relatedGoal: "", // Don't use undefined
    description: "", // Don't use undefined
    date: new Date(),
  });

  await user.save();
  res.json({ message: "Income added", user });
};

// 🟢 Add Expense
export const addExpense = async (req, res) => {
  const { userId } = req.params;
  const { title, amount, category } = req.body;

  // Validate input
  if (!title || !amount || isNaN(amount)) {
    return res
      .status(400)
      .json({ message: "Title and valid amount are required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const expenseAmount = Number(amount);
  const expenseTitle = title.toString();
  const expenseCategory = category?.toString() || "Other";

  const expenseEntry = {
    title: expenseTitle,
    amount: expenseAmount,
    category: expenseCategory,
    date: new Date(),
    type: "expense",
  };

  user.monthlyExpenses.push(expenseEntry);
  user.totalBalance -= expenseAmount;

  // Use the safe helper function
  addTransactionRecord(user, {
    title: expenseTitle,
    amount: expenseAmount,
    type: "expense",
    category: expenseCategory,
  });

  await user.save();
  res.json({ message: "Expense added", user });
};

// 🟢 Add Saving
export const addSaving = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  // Validate input
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const savingAmount = Number(amount);
  const lastIncome = user.monthlyIncome.slice(-1)[0]?.amount || 0;
  const rate = lastIncome > 0 ? (savingAmount / lastIncome) * 100 : 0;

  user.savings.push({
    amount: savingAmount,
    rate: rate,
    date: new Date(),
  });

  user.totalBalance -= savingAmount;

  addTransactionRecord(user, {
    title: "Saving Deposit",
    amount: savingAmount,
    type: "expense",
    category: "Savings",
    description: "Amount added to savings",
  });

  await user.save();
  res.json({ message: "Saving added", user });
};

// 🟢 Add Investment
export const addInvestment = async (req, res) => {
  const { userId } = req.params;
  const { value } = req.body;

  // Validate input
  if (!value || isNaN(value)) {
    return res
      .status(400)
      .json({ message: "Valid investment value is required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const investmentValue = Number(value);
  const prevValue = user.investments.currentValue;
  const growth =
    prevValue > 0 ? ((investmentValue - prevValue) / prevValue) * 100 : 0;

  user.investments.currentValue = investmentValue;
  user.investments.performance.push({
    value: investmentValue,
    growth: growth,
    date: new Date(),
  });

  addTransactionRecord(user, {
    title: "Investment Update",
    amount: investmentValue,
    type: "investment",
    category: "Investments",
    description: `Investment value updated to ${investmentValue}`,
  });

  await user.save();
  res.json({ message: "Investment updated", user });
};

// 🟢 Add Goal
export const addGoal = async (req, res) => {
  const { userId } = req.params;
  const { name, targetAmount, targetDate, category, priority, description } =
    req.body;

  // Validate input
  if (!name || !targetAmount || isNaN(targetAmount)) {
    return res.status(400).json({
      success: false,
      message: "Name and valid target amount are required",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const newGoal = {
    name: name.toString(),
    targetAmount: Number(targetAmount),
    currentAmount: 0,
    progress: 0,
    targetDate: targetDate ? new Date(targetDate) : new Date(),
    category: category || "savings",
    priority: priority || "medium",
    description: description || "",
    completed: false,
  };

  user.goals.push(newGoal);
  await user.save();

  // Return the newly created goal with its ID
  const savedGoal = user.goals[user.goals.length - 1];

  res.status(201).json({
    success: true,
    message: "Goal added successfully",
    goal: savedGoal,
    user,
  });
};

// Update goal (edit)
export const updateGoal = async (req, res) => {
  const { userId, goalId } = req.params;
  const updates = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const goal = user.goals.id(goalId);
  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  // Update only the provided fields
  if (updates.name !== undefined) goal.name = updates.name.toString();
  if (updates.targetAmount !== undefined)
    goal.targetAmount = Number(updates.targetAmount);
  if (updates.targetDate !== undefined)
    goal.targetDate = new Date(updates.targetDate);
  if (updates.category !== undefined) goal.category = updates.category;
  if (updates.priority !== undefined) goal.priority = updates.priority;
  if (updates.description !== undefined) goal.description = updates.description;
  if (updates.currentAmount !== undefined) {
    goal.currentAmount = Number(updates.currentAmount);
    // Recalculate progress
    goal.progress =
      goal.targetAmount > 0
        ? Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          )
        : 0;
  }

  await user.save();

  res.json({
    success: true,
    message: "Goal updated successfully",
    goal: goal,
    user,
  });
};

// Toggle completion status
export const toggleGoalCompletion = async (req, res) => {
  const { userId, goalId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const goal = user.goals.id(goalId);
  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  goal.completed = !goal.completed;
  await user.save();

  res.json({
    success: true,
    message: `Goal marked as ${goal.completed ? "completed" : "active"}`,
    goal: goal,
    user,
  });
};

export const deleteGoal = async (req, res) => {
  const { userId, goalId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const goal = user.goals.id(goalId);
  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  goal.remove();
  await user.save();

  res.json({
    success: true,
    message: "Goal deleted successfully",
    user,
  });
};

// 🟢 Add Transaction
export const addTransaction = async (req, res) => {
  const { userId } = req.params;
  const { title, amount, type, category, relatedGoal, description } = req.body;

  // Validate input
  if (!title || !amount || isNaN(amount) || !type) {
    return res
      .status(400)
      .json({ message: "Title, amount, and type are required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Use the safe helper function
  addTransactionRecord(user, {
    title: title,
    amount: Number(amount),
    type: type,
    category: category,
    relatedGoal: relatedGoal,
    description: description,
  });

  if (type === "income") {
    user.totalBalance += Number(amount);
  } else if (type === "expense") {
    user.totalBalance -= Number(amount);
  }

  await user.save();
  res.json({ message: "Transaction added", user });
};

// 🟢 Add Budget
export const addBudget = async (req, res) => {
  const { userId } = req.params;
  const { category, limit } = req.body;

  // Validate input
  if (!category || !limit || isNaN(limit)) {
    return res
      .status(400)
      .json({ message: "Category and valid limit are required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.budgets.push({
    category: category.toString(),
    limit: Number(limit),
    spent: 0,
    createdAt: new Date(),
  });

  await user.save();
  res.json({ message: "Budget added", user });
};

// 🟢 Update Total Balance
export const updateTotalBalance = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const lastIncome =
    user.monthlyIncome[user.monthlyIncome.length - 1]?.amount || 0;
  user.totalBalance += lastIncome;

  await user.save();
  res.json({ message: "Total balance updated", user });
};
