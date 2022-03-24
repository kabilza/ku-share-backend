const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const cloudinary = require("../../cloud");
const bucket = require("../../bucket");

const Lecture = require("../models/lecture");

// const cloudinaryUpload = async (file) => {
//   // console.log("there is thumbnail!");
//   // console.log(file.buffer);
//   try{
//     // const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.buffer);
//     // console.log(url);
//     // console.log(public_id);
//     // console.log("now writing file path to db, done");
//   await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, res) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(`Upload succeed: ${res}`)
//         console.log(res);
//         return res;
//       }
//     }).end(file.buffer);
//   }
//   catch (err) {
//     (err) => {
//       console.log('error!');
//       console.log(err);
//       res.status(200).json({
//         err,
//       });
//     };
//   }

const cloudinaryUpload = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`Upload succeed: `);
          console.log(res);
          resolve(res);
        }
      })
      .end(file.buffer);
  });
};

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

  // const newLecture = new Lecture({
  //   userId,
  //   title,
  //   author,
  //   description,
  //   subject,
  //   section,
  //   professor,
  //   numberOfPages,
  //   dateCreated,
  //   filePath,
  //   slug,
  // });

// if (file) {
//   const { secure_url: url, public_id } = await cloudinary.uploader.upload(
//     file.path
//   );
//   console.log(url);
//   console.log(public_id);
//   console.log('now writing file path to db')
//   newLecture.thumbnail = {url, public_id}
// }

//   await newLecture.save();

//   res.json(newLecture);
// };

exports.lectureUpload = async (req, res, next) => {
  const reqUserInput = JSON.parse(req.body.userInput);

  const { userId, title, author, description, subject, section, slug } =
    reqUserInput;


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
      .then(async (signedUrls) => {
        // signedUrls[0] contains the file's public URL
        const filePath = signedUrls[0];

        if (req.files.thumbnail[0]) {
          const { secure_url, public_id } = await cloudinaryUpload(
            req.files.thumbnail[0]
          );
          console.log("thumbnail upload is done!");

          const thumbnail = {
            url: secure_url,
            public_id: public_id
          }

          const newLecture = new Lecture({
            _id: new mongoose.Types.ObjectId(),
            userId,
            title,
            author,
            description,
            subject,
            section,
            thumbnail,
            filePath,
            slug,
          });

          await newLecture.save();

          console.log(newLecture);
          res.status(200).json(newLecture);
          
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({
          err,
        });
      });
  });
  blobStream.end(req.files.pdf[0].buffer);
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
