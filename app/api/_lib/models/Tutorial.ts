import { Schema, model, models } from "mongoose";

const TutorialSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    topic: String,
    level: String,
    category: String,
    language: String,
    tutorial: Object,
  },
  { timestamps: true }
);

export const Tutorial = models.Tutorial || model("Tutorial", TutorialSchema);
