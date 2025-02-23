const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const uniqid = require('uniqid')
const asyncHandler = require('express-async-handler');
const validateMongoDbid = require('../utils/validateMongoDbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./emailContrroller');
const crypto = require('crypto');
const { log } = require('console');
const Order = require('../models/orderModel');
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findeUser = await User.findOne({ email: email });
    if (!findeUser) {
        const newUser = await User.create(req.body);
        res.json(newUser)
    } else {
        throw new Error("user already exist");
    }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, {
            new: true,
        });
        res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            }
        )
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credenatial")
    }
})
// admin login

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if(findAdmin.role !== 'admin') throw new Error('Not Authorised')
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken: refreshToken,
        }, {
            new: true,
        });
        res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            }
        )
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credenatial")
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async (res, req) => {
    const cookie = req.cookie;
    if (!cookie?.refreshToken)
        throw new Error('No Refresh Token In Cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No Refresh token in db or not matched');
    jwt.verify(refreshToken.process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(User?._id);
        res.json({ accessToken })
    })
});
// log out 
const logOut = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken)
        throw new Error('No Refresh Token In Cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
})
// update a user

const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbid(id);

    try {
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,

            },
            {
                new: true,
            }
        );
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

//save user Address

const saveAddress = asyncHandler(async(req,res) =>{
    const { _id } = req.user;
    validateMongoDbid(id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                address: req?.body?.address,
               

            },
            {
                new: true,
            }
        );
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})


// Get all users

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});


//Get a single User

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbid(id);

    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        })
    } catch (error) {
        throw new Error(error)
    }
});

//Delete user

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbid(id);

    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    } catch (error) {
        throw new Error(error)
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbid(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        }, {
            new: true,
        }
        );
        res.json(
            block
        );
    } catch (error) {
        throw new Error(error)
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbid(id);

    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true,
        }
        );
        res.json(unblock);
    } catch (error) {
        throw new Error(error)
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const {password} = req.body;
    validateMongoDbid(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    } else {
        res.json(user)
    }
});

const forgetPasswordToken =  asyncHandler(async(req,res) =>{
    const { email } = req.body;
    const user = await User.findOne({ email })
    if(!user) throw new Error('User not found with this email');
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to rest Your Password. this link is valid till 10 minutes from now.<a href='http://localhost:8000/api/user/reset-password/${token}'>click Here</>`;
        const data = {
            to:email,
            text:"Hey User",
            subject:"Forgot Password Link",
            html:resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error)
    }
})

const resetPassword = asyncHandler(async(req,res)=>{
    const { password } = req.body;
    const { token } = req.params;
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires:{ $gt:Date.now() }
    });
    console.log(user);
    if(!user) throw new Error('Token Expired, Please try Again later');
    user.password = password;
    user.passwordResetToken= undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)
})

const getWishlist = asyncHandler(async(req,res) =>{
    const {_id} = req.user;
    validateMongoDbid(_id);
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser)
    } catch (error) {
        throw new Error(error)
    }
})

const userCart = asyncHandler(async(req,res,next) =>{
    const { cart} =req.body;
    const {_id} = req.user;
    validateMongoDbid(_id);
    try {
        let products=[]
        const user = await User.findById(_id);
        //check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({orderby:user._id})
        if(alreadyExistCart){
            alreadyExistCart.remove()
        }
        for(let i=0;i<cart.lenght;i++){
            let object = {}
            object.product=cart[i]._id;
            object.count=cart[i].count;
            object.color=cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object)
        }
        let cartTotal = 0;
        for(let i = 0;i<products.lenght;i++){
            cartTotal = cartTotal+products[i].price *products[i].count;
        }
        let newCart = await new cart({
            products,
            cartTotal,
            orderby:user?._id,
        }).save();
        req.json(newCart);

        
    } catch (error) {
        throw new Error(error)
    }

})

const getUserCart = asyncHandler(async(req,res)=>{
    const {_id} =req.user;
    validateMongoDbid(_id);
    try {
        const cart = await Cart.findOne({orderby:_id}).populate("products:product")
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

const emptycart = asyncHandler(async(req,res)=>{
    const {_id} =req.user;
    validateMongoDbid(_id);
    try {
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby:user._id})
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

const applyCoupon = asyncHandler(async(req,res)=>{
    const {coupon} = req.body;
    const {_id} =req.user;
    validateMongoDbid(_id);
    const validCoupon = await Coupon.findOne({name: coupon})
    if(validCoupon === null ){
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({_id});
    let {cartTotal} = await Cart.findOne({orderby:user._id}).populate("products:product");
    let totalAfterDiscount = (
        cartTotal-(cartTotal*validCoupon.discount)/100
    ).toFixed(2);
    await Cart.findOneAndUpdate({orderby:user._id},{
        totalAfterDiscount
    },{new:true});
     
    res.json(totalAfterDiscount)
})

const createOrder = asyncHandler(async(req,res)=>{
    const {COD,couponApplied} =req.body;
    const {_id} = req.user;
    validateMongoDbid(_id)
    if(!COD) throw new Error('create cash order failed')
    try {
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({orderby:user._id});
        let finalAmount = 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount
        }

        let newOrder = await new Order ({
            products:userCart.products,
            paymentIntent:{
                id: uniqid(),
                method:"COD",
                amount: finalAmount,
                status:"Cash on Delivery",
                create:Date.now(),
                currency:"usd"
            },
            orderby:user._id,
            orderStatus:"Cash on Delivery"
        }).save();
        let update = userCart.products.map((item) =>{
            return{
                uplateOne:{
                    filter:{ _id:item.product._id},
                    update:{$inc:{quantity: -item.count, sold: +item.count}},
                },
            }
        })
        const updated = await Product.bulkWrite(update,{});
        res.json({message:"success"})
    } catch (error) {
        throw new Error(error)
    }
})

const getOrders = asyncHandler(async(req,res)=>{
    const {_id} =req.user;
    validateMongoDbid(_id)
    try {
        const userorders = await Order.findOne({orderby:_id}).populate("products:product").exec()
        res.json(userorders)
    } catch (error) {
        throw new Error(error)
    }
})

const updateOrderStatus = asyncHandler(async(req,res)=>{
    const {status} = req.body;
    const {id}=req.params;
    validateMongoDbid(id)
   try {
    const updateOrderStatus= await Order.findByIdAndUpdate(id,{
        orderStatus:status,
        paymentIntent:{
            status:status,
        }
    },{new:true})
    res.json(updateOrderStatus)
   } catch (error) {
    throw new Error(error)
   }
})

module.exports = { 
    createUser,
    loginUserCtrl,
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
};