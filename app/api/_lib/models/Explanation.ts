import { Schema, model, models } from "mongoose";

const ExplanationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: String,
    explanation: String,
    language: String,
    complexity: String,
    summary: String,
    timeComplexity: String,
    spaceComplexity: String,
    logicBreakdown: [String],
    edgeCases: [String],
    bugs: [String],
    beginnerExplanation: String,
    recommendation: String,
    optimizedVersion: String,
    keyConcepts: [String],
  },
  { timestamps: true }
);

export const Explanation = models.Explanation || model("Explanation", ExplanationSchema);
