const multer = require("multer");

// const storage = multer.diskStorage({}); // change to memoryStorage() for the buffer value. https://stackoverflow.com/a/69922094

const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//     if (!file.mimetype.includes("image")) {
//         return cb("Invalid image format!", false);
//     }
//     cb(null,  true);
// }

const fileFilter = (req, file, cb) => {
    cb(null,  true);
}


module.exports = multer({ 
    storage: storage, 
    fileFilter, 
    limits: {
        fileSize: 5 * 1024 * 1024
    } 
});