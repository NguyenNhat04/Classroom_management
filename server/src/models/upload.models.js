const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["teacher", "student"], required: true }
});

const SubjectSchema = new mongoose.Schema({
    subjectName: String,
    subjectCode: { type: String, unique: true },
    credits: Number
});

const User = mongoose.model("User", UserSchema);
const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = { User, Subject };