const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lectureController = require('../controllers/lecture');
const multer = require('../middleware/multer-thumbnail');

// .array(fieldname[, maxCount])

// router.post("/upload", multer.single("thumbnail"), lectureController.lectureUpload);

// router.post("/upload", multer.array("thumbnail",1), lectureController.lectureUpload);

router.post("/upload", multer.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]), lectureController.lectureUpload);

// should change this multer string to match the name field from frontend
// router.post("/upload", multer.single('pdf'), lectureController.lectureUpload);

router.get("/:id", lectureController.singleLecture);

router.get("/fetch", lectureController.lectureFetching);


module.exports = router;