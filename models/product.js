const productSchema = new Schema({
    name: String
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;