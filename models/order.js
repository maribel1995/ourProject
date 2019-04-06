const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const orderSchema = new Schema({
    protocol: String,
    status: {type:String, enum:['Pending','Match','Canceled'],default:'Pending'},
    transporter: String,
    requestedProduct: {type: Schema.Types.ObjectId, ref:'Product'},
    biderProduct:{type: Schema.Types.ObjectId, ref:'Product'},
    requester:{type: Schema.Types.ObjectId, ref:'User'},
    bider:{type: Schema.Types.ObjectId, ref:'User'},
    requesterStatus:{type:String, enum:['Pending','Confirmed','Declined'],default:'Pending'},
    biderStatus:{type:String, enum:['Pending','Confirmed','Declined','Delivered'],default:'Pending'}
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

