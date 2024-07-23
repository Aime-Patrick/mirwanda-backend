const Coupon = require('../models/couponModel');
const validateMongoDbid = require('../utils/validateMongoDbid');
const asnyHandler = require('express-async-handler');

const createCoupon = asnyHandler(async(req,res) =>{
    try {
       const newCoupon = await Coupon.create(req.body); 
       res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllcoupon = asnyHandler(async(req,res)=>{
    try {
        const getallcoupon = await Coupon.find();
        res.json(getallcoupon)
    } catch (error) {
        throw new Error(error);
    }
})

const updateCoupon = asnyHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        validateMongoDbid(id);
        const coupons = await Coupon.findByIdAndUpdate(id,req.body,{
            new:true
        });
        res.json(coupons)
    } catch (error) {
        throw new Error(error);
    }
});

const DeleteCoupon = asnyHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        validateMongoDbid(id);
        const coupons = await Coupon.findByIdAndDelete(id)
        res.json(coupons)
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {
    createCoupon,
    getAllcoupon,
    updateCoupon,
    DeleteCoupon,
}