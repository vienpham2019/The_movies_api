const express = require("express");
const app = express();

const compression = require("compression");
const { default: helmet } = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/allowedOrigins");

// init middlewares
app.use(express.json());
// morgan: Logs HTTP requests to the console, providing information such as request method, URL, status code,
// and response time. Useful for debugging and monitoring.
app.use(cors(corsOptions));
app.use(morgan("dev"));
// mongoSantitize againt NoSQL query injection
app.use(mongoSanitize());
// xss againt HTML tag injection
app.use(xss());
//helmet: Sets various HTTP headers to improve security, including headers like Content Security Policy (CSP),
//Strict-Transport-Security, X-Frame-Options, and more.
app.use(helmet());
//compression middleware helps reduce the size of the response data
app.use(compression());
//express.json() : Parses incoming JSON requests, making the JSON data available in req.body for easy access
//in your route handlers.
//Parses incoming URL-encoded form data, making it available in req.body for easy access in your route handlers.
app.use(
  express.urlencoded({
    extended: true,
  })
);
//Parses cookies attached to incoming requests, making them available in req.cookies for easy access in your route handlers.
app.use(cookieParser());

// Trust the first proxy in front of the app (e.g., Heroku, Render)
app.set("trust proxy", 1); // Adjust the number to match your proxy chain (1 if you have a single proxy, 2 if two proxies, etc.)

// init db
require("./db/init.mongodb");

// init routes
app.use("/v1/api", require("./route"));
// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// const fs = require("fs");
// const path = require("path");
// const MovieService = require("./service/movie.service");

// // Path to your JSON file
// const filePath = path.join(__dirname, "mocBD.json");

// // Function to read the JSON file
// const readJsonFile = (filePath) => {
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading the file:", err);
//       return;
//     }

//     try {
//       const jsonData = JSON.parse(data); // Parse the JSON string into an object
//       jsonData.movies.forEach(async (movieData) => {
//         const { backdrop_path, release_date, overview } = movieData;
//         if (backdrop_path && release_date && overview) {
//           const {
//             Runtime,
//             Genre,
//             Director,
//             Writer,
//             Actors,
//             Plot,
//             Language,
//             Country,
//             Awards,
//           } = movieData;
//           const payload = {
//             ...movieData,
//             runtime: Runtime,
//             genre: Genre,
//             director: Director,
//             writer: Writer,
//             actors: Actors,
//             plot: Plot,
//             language: Language,
//             country: Country,
//             awards: Awards,
//           };
//           await MovieService.createMovie({ payload });
//         }
//       });
//       // You can now use the jsonData as needed
//     } catch (parseError) {
//       console.error("Error parsing JSON:", parseError);
//     }
//   });
// };

// // Call the function to read the JSON file
// readJsonFile(filePath);

app.use((error, req, res, next) => {
  const statusError = error.status || 500;
  return res.status(statusError).json({
    status: "error",
    code: statusError,
    stack: error.stack, // only for dev enviroment
    message: error.message || "Internal Server Errror",
  });
});

module.exports = app;
