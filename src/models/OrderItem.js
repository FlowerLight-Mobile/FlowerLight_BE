const mongoose = require('mongoose')

const order_ItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }

}, { timestamps: true });
module.exports = mongoose.model('OrderItem', order_ItemSchema)