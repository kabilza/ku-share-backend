const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lectureController = require('../controllers/lectureUpload');

router.post("/upload", lectureController.lectureUpload);

module.exports = router;