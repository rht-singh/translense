const router = require("express").Router();
const { Router } = require("../middleware/RouteGuard");
const {
  register,
  login,
  Verify,
  Post_a_Story,
  getUploadedPost,
  deleteUploadedFile,
} = require("../controllers/index");

const multer = require("multer");

// specify name and location of file
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + ".jpg");
  },
});
let upload = multer({
  storage: storage,
});

router.post("/register", register);
router.post("/login", login);
router.get("/verify", Verify);
router.post("/post", Router, upload.single("image"), Post_a_Story);
// router.delete("/delete-post", Router, deleteUploadedFile);
router.get("/get-post", Router, getUploadedPost);
module.exports = router;
