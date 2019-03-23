const orderSchema = new Schema({
    protocol: String
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

