const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./src/routes/user");
const storageRoutes = require("./src/routes/storage");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/v1/user", userRoutes);
app.use("/v1/storage", storageRoutes);

/**
 * Handles 404 Not Found
 */
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(3000, () => console.log("Server started on port 3000"));
