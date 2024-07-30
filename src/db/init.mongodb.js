"use strict";
const mongoose = require("mongoose");

const uri = process.env.DB_URL;

class Database {
  constructor() {
    this.connect();
  }

  // connect to db
  connect(type = "mongodb") {
    if (type === "mongodb") {
      mongoose
        .connect(uri, { maxPoolSize: 50 })
        .then(() => {
          console.log("Connect to MongoDb");
        })
        .catch((err) => {
          console.error("Error connecting to MongoDB:", err);
        });
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
