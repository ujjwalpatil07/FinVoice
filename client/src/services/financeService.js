import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9001/finance", // adjust if your backend runs elsewhere
});

const withUserId = (userId, path) => `/${userId}${path}`;

export const addIncome = async (userId, incomeData) => {
  return await API.post(withUserId(userId, "/income"), incomeData);
};

// 📌 Expense
export const addExpense = async (userId, expenseData) => {
  return await API.post(withUserId(userId, "/expense"), expenseData);
};

// 📌 Saving
export const addSaving = async (userId, savingData) => {
  return await API.post(withUserId(userId, "/saving"), savingData);
};

// 📌 Investment
export const addInvestment = async (userId, investmentData) => {
  return await API.post(withUserId(userId, "/investment"), investmentData);
};

export const addGoal = async (userId, goalData) => {
  const response = await API.post(`/${userId}/goal`, goalData);
  return response.data;
};

export const updateGoal = async (userId, goalId, goalData) => {
  const response = await API.put(`/${userId}/${goalId}`, goalData);
  return response.data;
};

export const toggleGoalCompletion = async (userId, goalId) => {
  const response = await API.patch(`/${userId}/${goalId}/toggle`);
  return response.data;
};

export const deleteGoal = async (userId, goalId) => {
  const response = await API.delete(`/${userId}/${goalId}`);
  return response.data;
};

// 📌 Transaction
export const addTransaction = async (userId, transactionData) => {
  return await API.post(withUserId(userId, "/transaction"), transactionData);
};

// 📌 Budget
export const addBudget = async (userId, budgetData) => {
  return await API.post(withUserId(userId, "/budget"), budgetData);
};

// 📌 Update total balance
export const updateTotalBalance = async (userId, balanceData) => {
  return await API.put(withUserId(userId, "/update-balance"), balanceData);
};
