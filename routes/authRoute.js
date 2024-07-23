const express = require("express");
const {
  createUser,
  getallUser,
  getUser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
  loginUserCtrl,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptycart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controller/userController");
const { isAdmin } = require("../middlewares/isAdmin");

const { authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/order/update-order/:id",authMiddleware,isAdmin, updateOrderStatus);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", userCart);
router.post("/cart/applycoupon",authMiddleware, applyCoupon);
router.post("/cart/cash_order",authMiddleware, createOrder);
router.get("/all-users", getallUser);
router.get("/get-orders",authMiddleware, getOrders);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.get("/cart", authMiddleware, getUserCart);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOut);
router.delete("/empty-cart",authMiddleware,emptycart)
router.delete("/:id", deleteUser);
router.put("/update_user", authMiddleware, updatedUser);
router.put("/save_address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
module.exports = router;
