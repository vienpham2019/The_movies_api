const mongoose = require("mongoose");

// Define sub-schemas for structured data
const productionCountrySchema = new mongoose.Schema(
  {
    iso_3166_1: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const videoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    videoName: { type: String, required: true },
  },
  { _id: false }
);

const productionCompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo_path: { type: String, required: true },
  },
  { _id: false }
);

// Define the main movie schema
const movieSchema = new mongoose.Schema(
  {
    popularity: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    poster_path: { type: String, required: true },
    id: { type: Number, required: true, unique: true },
    adult: { type: Boolean, default: false },
    backdrop_path: { type: String, required: true },
    title: { type: String, required: true },
    vote_average: { type: Number, required: true },
    overview: { type: String, required: true },
    release_date: { type: Date, required: true }, // Store as Date
    production_countries: { type: [productionCountrySchema], required: true }, // Array of production countries
    imdb_id: { type: String, required: true },
    runtime: { type: String, required: true }, // Corrected case
    genre: { type: String, required: true },
    director: { type: String, required: true },
    writer: { type: String, required: true }, // Corrected to singular
    actors: { type: String, required: true },
    plot: { type: String, required: true },
    language: { type: String, required: true },
    country: { type: String, required: true },
    awards: { type: String, required: true },
    videos: { type: [videoSchema], required: true }, // Array of video objects
    movieReviews: { type: [Object], default: [] }, // Assuming reviews are objects, adjust as needed
    production_companies: { type: [productionCompanySchema], required: true }, // Array of production company objects
    avg_score: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Automatically handle timestamps
    collection: "Movies", // Specify collection name
  }
);

// Create the Movie model
module.exports = mongoose.model("Movie", movieSchema);
