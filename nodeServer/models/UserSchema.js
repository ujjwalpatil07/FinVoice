const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // some demo users may not need email
    },

    passwordHash: {
      type: String,
      select: false, // hide by default
    },

    // 🔑 Authentication + session
    authProvider: {
      type: String,
      enum: ["local", "google", "guest"],
      default: "guest",
    },

    // 💰 Financial profile
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    monthlySavingsTarget: {
      type: Number,
      default: 0,
    },

    // 🔒 Settings / preferences
    currency: {
      type: String,
      default: "INR",
    },
    privacyMode: {
      type: Boolean,
      default: true, // "don’t send raw text to LLM"
    },

    // 📝 Relationships (referenced models)
    expenses: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
    goals: [{ type: Schema.Types.ObjectId, ref: "Goal" }],

    // 💬 Advisor history (for chat context)
    advisorHistory: [
      {
        question: String,
        response: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.model("User", UserSchema);
