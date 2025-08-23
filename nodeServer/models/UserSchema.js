import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,
    },

    password: {
      type: String,

      required: true,

      minlength: 6,
    },

    totalBalance: {
      type: Number,

      default: 0,
    },

    monthlyIncome: [
      {
        amount: Number,

        date: {
          type: Date,

          default: Date.now,
        },

        reason: String, // "salary increase", "new job", "bonus", etc.
      },
    ],

    monthlyExpenses: [
      {
        title: String, // "Grocery Store", "Netflix", etc.

        amount: Number, // 4500, 499, etc.

        category: String, // "Food", "Entertainment", etc.

        date: {
          type: Date,

          default: Date.now,
        },

        type: {
          // "expense" or "income"

          type: String,

          default: "expense",
        },
      },
    ],

    // 🐖 SAVINGS (Saving rate = (Savings / Income) * 100)

    savings: [
      {
        amount: Number,

        rate: Number,

        date: {
          type: Date,

          default: Date.now,
        },
      },
    ],

    // 📈 INVESTMENT PERFORMANCE

    investments: {
      currentValue: {
        type: Number,

        default: 0,
      },

      performance: [
        {
          date: {
            type: Date,

            default: Date.now,
          },

          value: Number,

          growth: Number, // Percentage growth from previous Growth % = ((Current Value - Previous Value) / Previous Value) * 100
        },
      ],
    },

    // 🎯 GOALS PROGRESS

    goals: [
      {
        name: String, // "Emergency Fund", "Buy a Home", etc.

        targetAmount: Number, // Total amount needed

        currentAmount: Number, // Amount saved so far

        progress: Number, // Percentage (currentAmount/targetAmount)*100

        createdAt: {
          type: Date,

          default: Date.now,
        },

        targetDate: Date, // When you want to achieve this

        completed: {
          type: Boolean,

          default: false,
        },
      },
    ],

    // 💳 ALL TRANSACTIONS (Combined view)

    allTransactions: [
      {
        title: String,

        amount: Number,

        type: String, // "income" or "expense"

        category: String,

        date: {
          type: Date,

          default: Date.now,
        },

        relatedGoal: String, // If transaction is related to a goal

        description: String,
      },
    ],

    budgets: [
      {
        category: {
          type: String,

          required: true,

          trim: true,
        },

        limit: {
          type: Number,

          required: true,
        },

        spent: {
          type: Number,

          default: 0,
        },

        createdAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],

    currency: {
      type: String,

      default: "INR",
    },

    mainDream: {
      type: String,

      default: "Buy a Home",
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
