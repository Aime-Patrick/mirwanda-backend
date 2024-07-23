const express = require('express');
const { isAdmin } = require("../middlewares/isAdmin");
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require('../controller/blogController');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImage');
const router = express.Router()

router.post('/',authMiddleware,isAdmin,createBlog);
router.put(
    "/upload",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images",2),
    blogImgResize,
    uploadImages
  );
router.put('/likes',authMiddleware,likeBlog);
router.put('/dislikes',authMiddleware,dislikeBlog);
router.put('/:id',authMiddleware,isAdmin,updateBlog);
router.get('/:id',getBlog);
router.get('/',getAllBlogs);
router.delete('/:id',authMiddleware,isAdmin,deleteBlog);
module.exports = router;