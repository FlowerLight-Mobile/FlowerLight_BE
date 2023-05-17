const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    takeCare: {
        type: String,
        require: true
    },
    image: {
        type: String,
        default: ''
    },
    localProduct: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        default: 0
    },
    countInStock: {
        type: Number,
        require: true,
        min: 0,
        max: 255
    },
}, { timestamps: true })
module.exports = mongoose.model("Product", productSchema);