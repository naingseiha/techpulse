import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
  bio: {
    type: String,
    maxlength: [500, "Bio cannot be more than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.User || mongoose.model("User", UserSchema);
