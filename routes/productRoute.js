const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
} = require("../controller/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const { isAdmin } = require("../middlewares/isAdmin");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
// router.put(
//   "/upload",
//   authMiddleware,
//   isAdmin,
//   uploadPhoto.array("images",10),
//   productImgResize,
//   uploadImages
// );
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.get("/", getAllProduct);
router.put("/update-product/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
