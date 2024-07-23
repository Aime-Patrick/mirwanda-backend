const express = require('express');
const { isAdmin } = require("../middlewares/isAdmin");

const { authMiddleware } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controller/blogCatController');
const router = express.Router();
router.post('/',authMiddleware,isAdmin,createCategory);
router.get('/',authMiddleware,isAdmin,getAllCategory);
router.get('/:id',authMiddleware,isAdmin,getCategory);
router.put('/:id',authMiddleware,isAdmin,updateCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteCategory);

module.exports = router;