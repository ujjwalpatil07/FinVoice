import express from "express";
import User from "../models/UserSchema.js";

const router = express.Router();

router.post("/expense", async (req, res) => {
  try {
    const { email, expense } = req.body;

    console.log("Received expense data:", { email, expense });

    // Validate required fields
    if (
      !email ||
      !expense ||
      !expense.title ||
      !expense.amount ||
      !expense.category
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: email, expense.title, expense.amount, expense.category",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create expense object with proper structure
    const newExpense = {
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date || new Date(),
      type: "expense", // Ensure type is set correctly
    };

    // Add the new expense to monthlyExpenses
    user.monthlyExpenses.push(newExpense);

    // Update total balance (subtract expense amount)
    user.totalBalance -= expense.amount;

    // Also add to allTransactions
    user.allTransactions.push({
      title: expense.title,
      amount: expense.amount,
      type: "expense",
      category: expense.category,
      date: expense.date || new Date(),
      description: expense.description || "",
    });

    // Save the updated user
    const updatedUser = await user.save();

    console.log("Expense added successfully for user:", email);

    res.json({
      message: "Expense added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});


export default router;