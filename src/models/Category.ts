import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    maxlength: [50, "Category name cannot be more than 50 characters"],
  },
  slug: {
    type: String,
    required: [true, "Please provide a slug"],
    unique: true,
  },
  description: {
    type: String,
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
});

export default models.Category || mongoose.model("Category", CategorySchema);
