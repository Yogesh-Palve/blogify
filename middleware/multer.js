const multer = require("multer");
const fs = require("fs");
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = path.resolve("public/uploads");
    const folderName = req.user ? req.user._id.toString() : "guest";
    const uploadPath = path.join(basePath, folderName);

    // create if not exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

module.exports = upload