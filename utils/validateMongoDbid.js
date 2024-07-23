const mongoose = require('mongoose')
const validateMongoDbid = (id) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("this ID is not valid or not Found")
    }
};
module.exports = validateMongoDbid;