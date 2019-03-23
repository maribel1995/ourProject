const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    owner: {type: Schema.Types.ObjectId, ref:'User'},
    category: String,
    stared: {type: Boolean, default: false},
    images: [String]
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;


