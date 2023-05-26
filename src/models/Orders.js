const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        require: true
    }],
    phone: {
        type: Number,
        require: true
    },
    Address1: {
        type: String,
        require: true
    },
    Address2: {
        type: String,
    },
    city: {
        type: String,
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        require: true,
        default: 'Pending',
    },

})
orderSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


exports.Order = mongoose.model('Order', orderSchema);