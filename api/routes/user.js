const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const checkAuth = require('../middleware/check-auth');

const userController = require("../controllers/user");

router.post("/signup", userController.userSignUp);
// router.post("/signup", (req, res) => {
//   return res.status(201).json({
//     message: "Signup!",
//   });
// });

router.post("/signin", userController.userSignIn);

router.post("/profile/changeProfile", userController.userChangeProfile);

// router.post(
//   "/profile/changeProfilePicture",
//   userController.userChangeProfilePicture
// );

module.exports = router;
