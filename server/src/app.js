const express = require("express");
const app = express();

// connect database
await mongoose.connect("mongodb://127.0.0.1/Classroom_Management");
// init routes
app.use("/", require("./routers/index"));

// middleware handle error
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
