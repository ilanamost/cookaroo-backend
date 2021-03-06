const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const recipesRoutes = require("./routes/recipes");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect(
    "mongodb+srv://Ilana:" + process.env.MONGO_ATLAS_PW + "@cluster0.osga8.mongodb.net/cookaroo-db",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

// define headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// define routes
app.use("/api/recipes", recipesRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
