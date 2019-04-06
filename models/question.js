const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const questionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String,  maxlength: 200 },
    reply: {type: String,  maxlength: 200} 
}, {
  timestamps: true
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;