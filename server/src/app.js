const express = require("express");
const app = express();

// connect database
await mongoose.connect("mongodb://127.0.0.1/Classroom_Management");
// init routes
app.use("/", require("./routers/index"));

module.exports = app;
