const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ExpenseSchema = new Schema(
  {
    // Link back to the user
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Core fields
    amount: { type: Number, required: true }, // ₹ amount spent
    currency: { type: String, default: "INR" }, // multi-currency support
    merchant: { type: String }, // Store, app, restaurant, etc.

    // Categorization
    category: {
      type: String,
      enum: ["Food", "Travel", "Bills", "Shopping", "Health", "Other"],
      default: "Other",
      index: true,
    },
    method: {
      type: String,
      enum: ["cash", "upi", "card", "other"],
      default: "other",
    },

    // Metadata
    notes: { type: String }, // “Dinner with friends”
    source: {
      type: String,
      enum: ["voice", "manual", "sms", "ocr"],
      default: "manual",
    },
    confidence: { type: Number, default: 1 }, // AI parser confidence score (0–1)
    whyCategory: { type: String }, // Explanation for category (for transparency)

    // Timing
    date: { type: Date, default: Date.now }, // Actual expense date
  },
  { timestamps: true }
); // auto adds createdAt & updatedAt

export default mongoose.model("Expense", ExpenseSchema);
