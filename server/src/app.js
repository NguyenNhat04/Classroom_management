const express = require("express");
const app = express();

// init routes
app.use("/", require("./routers/index"));

module.exports = app;
