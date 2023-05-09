const User = require('../models/User');
const bcrypt = require('bcrypt');

const authController = {
    // Signup
    signupUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create New User
            const newUser = await new User({
                name: req.body.name,
                email: req.body.email,
                password: hashed,
                phone: req.body.phone,
                apartment: req.body.apartment,
                street: req.body.street,
                provider: req.body.provider,
                district: req.body.district,
                city: req.body.city
            });
            const user = await newUser.save();
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    //Login 
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (!user) {
                res.status(404).json("Wrong Email !!!")
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                res.status(404).json('Wrong Password !!!')
            }
            if (user && validPassword) {
                res.status(200).json(user)
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

}
module.exports = authController;