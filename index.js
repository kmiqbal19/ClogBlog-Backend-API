// Import Libraries
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const AppError = require("./util/appError");
const globalErrorHandler = require("./controller/errorController");
// Import Routers
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRouter");
// Create Express Application
const app = express();
// Configure .env to process.env
dotenv.config({ path: "./.env" });
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
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err));
// Body parser for json file
app.use(express.json({ limit: "10kb" }));
// Logging http request method in console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// TEST Middleware
// app.use("/", (req, res, next) => {
//   console.log(req.headers);
// });
// Serving STATIC Files
app.use(express.static(path.join(__dirname, "public")));
// MOUNTING ROUTER for different routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
// Implementing Global Error Handling
app.all("*", (req, res, next) => {
  next(
    new AppError(`Cannot find this ${req.originalUrl} url in the server!`, 404)
  );
});
app.use(globalErrorHandler);
app.listen("5000", () => {
  console.log("App is running on port 5000...");
});
