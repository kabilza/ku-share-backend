const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

const Lecture = require("../models/lecture");

exports.lectureUpload = (req, res, next) => {
  console.log(req.body);
  const email = req.body.email
  res.json({
    message: "hello",
    email: email
  });
};
