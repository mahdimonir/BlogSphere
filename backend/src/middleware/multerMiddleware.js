import multer from "multer";
import path from "path";

// Configure Multer storage to use /tmp/ for serverless environments
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/"); // Use /tmp/ for AWS Lambda
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Configure Multer to handle specific file fields
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, false);
    }
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG/PNG images are allowed"));
  },
});

// Apply fields configuration
const configuredUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export { configuredUpload as upload };
