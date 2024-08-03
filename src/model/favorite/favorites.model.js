const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Automatically handle timestamps
    collection: "Favorites", // Specify collection name
  }
);

// Create the Movie model
module.exports = mongoose.model("Favorite", favoriteSchema);
