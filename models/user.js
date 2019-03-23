
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    imageUrl: String,
    token: String,
    status: {type: String, enum: ['active', 'pending'], default: 'pending'},
    facebookID: String,
    googleID: String,
    type: {type: String, enum: ['Admin','User'], default:'pending'},
    review: [{ type: Schema.Types.ObjectId, ref: 'Reviews' }]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;