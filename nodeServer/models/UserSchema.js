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
        amount: {
          type: Number,
          required: true,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        reason: {
          type: String,
          default: "Income",
        },
      },
    ],

    monthlyExpenses: [
      {
        title: {
          type: String,
          required: true,
          default: "Expense",
        },
        amount: {
          type: Number,
          required: true,
          default: 0,
        },
        category: {
          type: String,
          default: "General",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          default: "expense",
        },
      },
    ],

    savings: [
      {
        amount: {
          type: Number,
          default: 0,
        },
        rate: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

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
          value: {
            type: Number,
            default: 0,
          },
          growth: {
            type: Number,
            default: 0,
          },
        },
      ],
    },

    goals: [
      {
        name: {
          type: String,
          default: "Goal",
        },
        targetAmount: {
          type: Number,
          default: 0,
        },
        currentAmount: {
          type: Number,
          default: 0,
        },
        progress: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        targetDate: {
          type: Date,
          default: Date.now,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    allTransactions: [
      {
        title: {
          type: String,
          required: true,
          default: "Transaction",
        },
        amount: {
          type: Number,
          required: true,
          default: 0,
        },
        type: {
          type: String,
          required: true,
          default: "income",
        },
        category: {
          type: String,
          default: "General",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        relatedGoal: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
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
          default: 0,
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

export default model("User", UserSchema);
