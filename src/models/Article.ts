import mongoose, { Schema, models } from "mongoose";

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  slug: {
    type: String,
    required: [true, "Please provide a slug"],
    unique: true,
  },
  excerpt: {
    type: String,
    required: [true, "Please provide an excerpt"],
    maxlength: [250, "Excerpt cannot be more than 250 characters"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  featuredImage: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: Number,
    default: 5,
  },
});

export default models.Article || mongoose.model("Article", ArticleSchema);
