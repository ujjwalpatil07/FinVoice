import mongoose from "mongoose";
import User from "../models/UserSchema.js";

const dbUrl =
  "mongodb+srv://ujjwalpatil001155:zfl6oCE8d65o8o0C@sunhacks-project.znptaw7.mongodb.net/?retryWrites=true&w=majority&appName=SUNHACKS-Project";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    initDB();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error: ", err);
  });

const initDB = async () => {
  try {
    // 1️⃣ Find or create user
    let user = await User.findOne({ email: "u@p.com" });

    if (!user) {
      console.log("ℹ️ No user found, creating new one...");
      user = new User({
        fullName: "Ujjwal Patil",
        email: "u@p.com",
        password: "hashedpassword123", // hash this in real use
        // Initialize all array fields to empty arrays
        monthlyIncome: [],
        monthlyExpenses: [],
        savings: [],
        investments: {
          currentValue: 0,
          performance: []
        },
        goals: [],
        allTransactions: [],
        budgets: []
      });
    }

    // 2️⃣ Assign some data
    user.totalBalance = 50000;

    // Monthly Income
    user.monthlyIncome.push({
      amount: 25000,
      reason: "Salary",
    });

    // Monthly Expenses
    user.monthlyExpenses.push({
      title: "Netflix Subscription",
      amount: 499,
      category: "Entertainment",
    });

    user.monthlyExpenses.push({
      title: "Electricity Bill",
      amount: 1200,
      category: "Utilities",
    });

    // Savings
    user.savings.push({
      amount: 10000,
      rate: 20,
    });

    // Investments
    user.investments.currentValue += 20000;
    user.investments.performance.push({
      value: 20000,
      growth: 5,
    });

    // Goals
    user.goals.push({
      name: "Buy a Car",
      targetAmount: 500000,
      currentAmount: 100000,
      progress: (100000 / 500000) * 100,
      targetDate: new Date("2027-01-01"),
    });

    // Budgets
    user.budgets.push({
      category: "Travel",
      limit: 20000,
      spent: 5000,
    });

    // 3️⃣ Save to DB
    const updatedUser = await user.save();
    console.log("✅ User updated successfully:", updatedUser);
  } catch (err) {
    console.error("❌ Error in initDB:", err);
  }
}
