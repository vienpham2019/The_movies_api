const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: String },
    gender: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Automatically handle timestamps
    collection: "Users", // Specify collection name
  }
);

// Create the Movie model
module.exports = mongoose.model("User", userSchema);
