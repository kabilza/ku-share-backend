const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lectureController = require('../controllers/lectureUpload');
const multer = require('../middleware/multer-thumbnail');

router.post("/upload", multer.single("thumbnail"), lectureController.lectureUpload);

module.exports = router;