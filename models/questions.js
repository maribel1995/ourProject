const questionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Product' },
    question: { type: String,  maxlength: 200 },
    reply: {type: String,  maxlength: 200} 
}, {
  timestamps: true
});

const Question = mongoose.model("Product", questionSchema);

module.exports = Question;