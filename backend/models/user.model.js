const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : { type: String, required : true, trim : true, unique : true,},
    hash : { type: String,required : true },
    firstName : { type: String, required: true },
    lastName: { type : String, required: true },
}, {
    timestamps : true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;