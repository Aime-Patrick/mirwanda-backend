const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const { isAdmin } = require("../middlewares/isAdmin");
const router = express.Router();
router.post(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
