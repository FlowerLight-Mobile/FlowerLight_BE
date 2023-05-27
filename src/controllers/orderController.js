const express = require('express');
const OrderItem = require('../models/OrderItem');
const { Order } = require('../models/Orders');

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
            let order = new Order({
                orderItems: orderItemsIdsResolved,
                phone: req.body.phone,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                totalPrice: totalPrice,
                user: req.body.user
            })
            order = await order.save();
            if (!order) {
                return res.status(400).json({ message: 'Cannot Order !' })
            } else {
                return res.status(200).json({ message: 'Order Successfully !', order })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },
    getAllOrder: async(req, res) => {
        try {
            const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
            if (orderList.length === 0) {
                return res.status(400).json({ message: 'Order List Not Found!' });
            } else {
                return res.status(200).json(orderList);
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
module.exports = orderController