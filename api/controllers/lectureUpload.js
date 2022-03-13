const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const cloudinary = require("../../cloud");

const Lecture = require("../models/lecture");

exports.lectureUpload = async (req, res, next) => {
  const {
    userId,
    title,
    author,
    description,
    subject,
    section,
    professor,
    numberOfPages,
    dateCreated,
    filePath,
    slug,
  } = req.body;
  const { file } = req;
  const isAlreadyExists = await Lecture.findOne({ slug });

  if (isAlreadyExists) {
    return res.status(401).json({ error: "Please use unique slug" });
  }

  const newLecture = new Lecture({
    userId,
    title,
    author,
    description,
    subject,
    section,
    professor,
    numberOfPages,
    dateCreated,
    filePath,
    slug,
  });

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    console.log(url);
    console.log(public_id);
    console.log('now writing file path to db')
    newLecture.thumbnail = {url, public_id}
  }

  await newLecture.save();

  res.json(newLecture);
};
