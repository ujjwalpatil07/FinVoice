import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import {
  addIncome,
  addExpense,
  addSaving,
  addInvestment,
  addGoal,
  addTransaction,
  addBudget,
  updateTotalBalance,
  updateGoal,
  toggleGoalCompletion,
  deleteGoal,
  updateTransaction,
  deleteTransaction
} from "../../controllers/financeControllers.js";

const router = express.Router();

// 📌 Income
router.post("/:userId/income", wrapAsync(addIncome));

// 📌 Expense
router.post("/:userId/expense", wrapAsync(addExpense));

// 📌 Saving
router.post("/:userId/saving", wrapAsync(addSaving));

// 📌 Investment
router.post("/:userId/investment", wrapAsync(addInvestment));

// 📌 Goal
router.post("/:userId/goal", wrapAsync(addGoal));

// 📌 Update an existing goal
router.put("/:userId/:goalId", wrapAsync(updateGoal));

// 📌 Toggle completion status
router.patch("/:userId/:goalId/toggle", wrapAsync(toggleGoalCompletion));

// 📌 Delete a goal
router.delete("/:userId/:goalId", wrapAsync(deleteGoal));

// 📌 Transaction
router.post("/:userId/transaction", wrapAsync(addTransaction));
router.put("/:userId/transaction/:transactionId", wrapAsync(updateTransaction));
router.delete("/:userId/transaction/:index", wrapAsync(deleteTransaction));

// 📌 Budget
router.post("/:userId/budget", wrapAsync(addBudget));

// 📌 Update total balance from last income
router.put("/:userId/update-balance", wrapAsync(updateTotalBalance));

export default router;
