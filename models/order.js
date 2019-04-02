const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const orderSchema = new Schema({
    protocol: String,
    status: {type:String, enum:['Pending','Match','Canceled'],default:'Pending'},
    transporter: String,
    requestedProduct: {type: Schema.Types.ObjectId, ref:'Product'},
    biderProduct:{type: Schema.Types.ObjectId, ref:'Product'},
    requester:{type: Schema.Types.ObjectId, ref:'User'},
    bider:{type: Schema.Types.ObjectId, ref:'User'}
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

