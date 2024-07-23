const Category = require('../models/blogCatModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbid = require('../utils/validateMongoDbid');

const createCategory = asyncHandler(async(req,res)=>{
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
});

const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbid(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbid(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error)
    }
});

const getCategory = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        validateMongoDbid(id)
        const getCategory = await Category.find({id});
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCategory = asyncHandler(async(req,res)=>{
    try {
        const getCategory = await Category.find();
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
});
module.exports ={
createCategory,
updateCategory,
deleteCategory,
getCategory,
getAllCategory,
}