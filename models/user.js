
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    cellphone: String,
    address: String,
    imageUrl: {type: String, default:'https://res.cloudinary.com/daniel-donato/image/upload/v1553372769/ichange/profileDefault.jpg'},
    token: String,
    status: {type: String, enum: ['active', 'pending'], default: 'pending'},
    facebookID: String,
    googleID: String,
    stared: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    type: {type: String, enum: ['Admin','User'], default:'User'},
    review: [{ type: Schema.Types.ObjectId, ref: 'Reviews' }]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;