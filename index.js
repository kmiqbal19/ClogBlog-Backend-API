// Import Libraries
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
// Import Routers
const userRouter = require("./routes/userRoutes");

// Create Express Application
const app = express();
// Configure .env to process.env
dotenv.config({ path: "./config.env" });
// Connection to Database (MongoDB)
const DATABASE = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DB_PASSWORD
);
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then((con) => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err));
// Body parser for json file
app.use(express.json({ limit: "10kb" }));
// Logging http request method in console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Serving Static Files
app.use(express.static(path.join(__dirname, "public")));
// Mounting Router for different routes
app.use("/api/v1/users", userRouter);
app.listen("5000", () => {
  console.log("App is running on port 5000...");
});
