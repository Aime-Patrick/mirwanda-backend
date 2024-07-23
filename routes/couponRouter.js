const express = require('express');
const { createCoupon, getAllcoupon, updateCoupon, DeleteCoupon } = require('../controller/counpoController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();
router.post('/',authMiddleware,isAdmin,createCoupon);
router.get('/',authMiddleware,isAdmin,getAllcoupon);
router.put('/:id',authMiddleware,isAdmin,updateCoupon);
router.delete('/:id',authMiddleware,isAdmin,DeleteCoupon);

module.exports = router;