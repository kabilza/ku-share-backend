const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

const User = require("../models/user");

exports.userSignUp = (req, res, next) => {
  const myLocalId = uniqid();
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail already exists",
        });
      } else {
        // salt = random strings to make reversing the hash impossible
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              localId: myLocalId,
              idToken: "null",
              displayName: "user",
              profileImage: "null",
              briefInfo: "null",
              phoneNumber: "null",
              facebook: "null",
              twitter: "null",
              homeAddress: "null",
              age: "null"
            });
            user
              .save()
              .then(async (result) => {
                const token = jwt.sign(
                  {
                    email: user.email,
                    userId: user._id,
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "1h",
                  }
                );
                user.idToken = token;
                await user.save();
                console.log(result);
                return res.status(201).json(user);
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.userSignIn = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  try {
    if (!user) {
      return res.status(401).json({
        message: "Wrong Email or Password!",
      });
    }
    // console.log(user);
    bcrypt.compare(req.body.password, user.password, async (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        user.idToken = token;
        await user.save();
      }
    });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

exports.userChangeProfile = async (req, res, next) => {
  const { newProfile, userId } = req.body;
  const user = await User.findOne({ localId: userId }).exec();
  try {
    console.log("user " + user);
    console.log("new Profile " + newProfile);
    user.displayName = newProfile.userDisplayName;
    user.briefInfo = newProfile.userBriefInfo;
    user.phoneNumber = newProfile.userPhoneNumber;
    user.facebook = newProfile.userFacebook;
    user.twitter = newProfile.userTwitter;
    user.homeAddress = newProfile.userHomeAddress;
    user.age = newProfile.userAge;
    await user.save();
    return res.status(201).json({
      message: "Profile Updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};