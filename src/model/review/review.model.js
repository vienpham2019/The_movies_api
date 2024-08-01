const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    author: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    score: { type: Number, default: 10 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Automatically handle timestamps
    collection: "Reviews", // Specify collection name
  }
);

// Create the Movie model
module.exports = mongoose.model("Review", reviewSchema);
