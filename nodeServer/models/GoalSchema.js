const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const GoalSchema = new Schema(
  {
    // Link back to the user
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Core goal details
    name: { type: String, required: true }, // “Buy a Car”, “iPhone 15”
    targetAmount: { type: Number, required: true }, // how much user wants to save
    targetDate: { type: Date }, // when user wants to achieve it

    // Current state
    currentCorpus: { type: Number, default: 0 }, // savings already done
    expectedReturnPA: { type: Number, default: 0.12 }, // assumed annual return (12%)

    // Derived metrics (you’ll calculate in advisor logic)
    sipRequired: { type: Number, default: 0 }, // monthly SIP needed
    etaImprovement: { type: String }, // “2 months earlier if you save 1k more”

    // Metadata
    notes: { type: String }, // optional description
  },
  { timestamps: true }
);

export default mongoose.model("Goal", GoalSchema);
