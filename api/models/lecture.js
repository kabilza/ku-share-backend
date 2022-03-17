const mongoose = require("mongoose");

const lectureSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    professor: {
      type: String,
      required: true,
    },
    numberOfPages: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: Object,
      url: {
        type: URL,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      }, //storing thumbnails online
    },
    filePath: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lecture", lectureSchema);
