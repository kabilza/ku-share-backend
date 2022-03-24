const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const cloudinary = require("../../cloud");
const bucket = require("../../bucket");

const Lecture = require("../models/lecture");

// exports.lectureUpload = async (req, res, next) => {
// console.log(req.body);
// console.log(req.files.pdf[0].mimetype);
// console.log('thumbnail file: ')
// console.log(req.files.thumbnail);
//   const {
//     userId,
//     title,
//     author,
//     description,
//     subject,
//     section,
//     professor,
//     numberOfPages,
//     dateCreated,
//     filePath,
//     slug,
//   } = req.body;
//   const { file } = req;
//   const isAlreadyExists = await Lecture.findOne({ slug });

//   if (isAlreadyExists) {
//     return res.status(401).json({ error: "Please use unique slug" });
//   }

//   const newLecture = new Lecture({
//     userId,
//     title,
//     author,
//     description,
//     subject,
//     section,
//     professor,
//     numberOfPages,
//     dateCreated,
//     filePath,
//     slug,
//   });

//   if (file) {
//     const { secure_url: url, public_id } = await cloudinary.uploader.upload(
//       file.path
//     );
//     console.log(url);
//     console.log(public_id);
//     console.log('now writing file path to db')
//     newLecture.thumbnail = {url, public_id}
//   }

//   await newLecture.save();

//   res.json(newLecture);
// };

exports.lectureUpload = async (req, res, next) => {
  const reqUserInput = JSON.parse(req.body.userInput);

  const {userId,
    title,
    author,
    description,
    subject,
    section,
    slug} = reqUserInput
  console.log(description)
  

  const folder = "lectures";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files.pdf[0].mimetype,
    },
  });

  blobStream.on("error", (err) => {
    res.status(405).json(err);
  });

  blobStream.on("finish", () => {
    const file = bucket.file(fileName);
    return file
      .getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      })
      .then((signedUrls) => {
        // signedUrls[0] contains the file's public URL
        console.log("Lecture URL:");
        console.log(signedUrls[0]);
        res.status(200).send(signedUrls[0]);
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({
          err,
        });
      });
  });
  blobStream.end(req.files.buffer);
};

exports.singleLecture = async (req, res, next) => {
  console.log(req);

  const file = bucket.file(`lectures/${req.params.id}`);

  // force user to download file when enter the url eg. 'http://localhost:3001/lecture/1648107164740'
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};

exports.lectureFetching = async (req, res, next) => {
  let myUserId = req.query.userId;
  console.log("fetch lecture for userId: ");
  console.log(myUserId);
  const fetchedLectures = await Lecture.find({ userId: myUserId });
  try {
    return res.status(200).json({ myUserId: myUserId });
    // return res.status(200).json({fetchedLectures});
  } catch (err) {
    (err) => {
      console.log(err);
      res.status(200).json({
        err,
      });
    };
  }
};
