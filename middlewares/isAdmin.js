const  User  = require("../models/userModel");
const asyncHandler = require('express-async-handler');


const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    
    try {
        const adminUser = await User.findOne({ email });

        if (!adminUser || adminUser.role !== "admin") {
            throw new Error('You are not an admin');
        } else {
            next();
        }
    } catch (error) {
        // Handle database query or other errors
        next(error);
    }
});

module.exports ={isAdmin}