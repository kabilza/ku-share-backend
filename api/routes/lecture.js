const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lectureController = require('../controllers/lecture');
const multer = require('../middleware/multer-thumbnail');

router.post("/upload", multer.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]), lectureController.lectureUpload);

// should change this multer string to match the name field from frontend
// router.post("/upload", multer.single('pdf'), lectureController.lectureUpload);

// router.get("/:id", lectureControllerFirebase.singleLecture);

router.get("/fetch", lectureController.lectureFetching);
router.get("/search", lectureController.searchLectures);


module.exports = router;