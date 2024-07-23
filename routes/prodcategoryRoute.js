const { isAdmin } = require("../middlewares/isAdmin");
const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controller/prodcategoryController');
const router = express.Router();
router.post('/',authMiddleware,isAdmin,createCategory);
router.put('/:id',authMiddleware,isAdmin,updateCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteCategory);
router.get('/:id',authMiddleware,isAdmin,getCategory);
router.get('/',authMiddleware,isAdmin,getAllCategory);
module.exports = router;