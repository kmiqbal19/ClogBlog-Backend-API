// Import Libraries
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const multer = require("multer");
// Import FILES
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
// Limit request rate
const limiter = rateLimiter({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request in this API, Please try again in one hour.",
});
app.use("/api", limiter);
// Set security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// Data sanitization against NOSQL query Injection
app.use(mongoSanitize());
// Data sanitization
app.use(xss());
// Preventing parameter pollution
app.use(
  hpp({
    // whitelist: "duration",
  })
);
// Logging http request method in console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// TEST Middleware
// app.use("/", (req, res, next) => {
//   console.log(req.headers);
// });

// USING MULTER FOR IMAGE UPLOAD

const storagePosts = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const storageUsers = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/users");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only Images can be uploaded!", 400), false);
  }
};
const uploadPost = multer({
  storage: storagePosts,
  fileFilter: multerFilter,
});
const uploadUser = multer({
  storage: storageUsers,
  fileFilter: multerFilter,
});

app.post("/api/v1/posts/upload", uploadPost.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});
app.post("/api/v1/users/upload", uploadUser.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});
// Serving STATIC Files
app.use(express.static(path.join(__dirname, "public/images")));
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
app.listen(process.env.PORT || "5000", () => {
  console.log("App is running on port 5000...");
});
