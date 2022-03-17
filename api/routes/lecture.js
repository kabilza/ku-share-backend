const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lectureController = require('../controllers/lecture');
const multer = require('../middleware/multer-thumbnail');

router.post("/upload", multer.single("thumbnail"), lectureController.lectureUpload);

router.get("/fetch", lectureController.lectureFetching);


module.exports = router;