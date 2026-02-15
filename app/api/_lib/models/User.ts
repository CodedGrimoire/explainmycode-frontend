import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
