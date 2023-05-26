const express = require('express');
const OrderItem = require('../models/OrderItem');

const orderController = {
    createOrder: async(req, res) => {
        try {
            const orderItemsIds = Promise.all(req.body.orderItems.map(async(orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product
                })
                newOrderItem = await newOrderItem.save()
                return newOrderItem._id;
            }));
            const orderItemsIdsResolved = await orderItemsIds;

            const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) => {
                const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
                const totalPrice = orderItem.product.price * orderItem.quantity;
                return totalPrice
            }))

            const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' });

        }
    }
}
module.exports = orderController