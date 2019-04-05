const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: { type: String,  maxlength: 200 },
    rating: {type: Number, enum: [1,2,3,4,5]}
}, {
  timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);


module.exports = Review;