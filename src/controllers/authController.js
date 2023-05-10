const User = require('../models/User');
const bcrypt = require('bcrypt');

const authController = {
    // Signup
    signupUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Check existing user
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const existingPhone = await User.findOne({ phone: req.body.phone });
            if (existingPhone) {
                return res.status(400).json({ message: 'Error ! Phone number already in use.' });
            }

            // check characters
            const email = req.body.email;

            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ message: "Invalid email" });
            }

            const phoneNumber = req.body.phone;
            if (/[^0-9]/.test(phoneNumber)) {
                return res.status(400).json({ message: 'Phone number can only contain numbers' });
            }

            function validateName(name) {
                const re = /^[a-zA-Z ]*$/;
                return re.test(name);
            }
            const name = req.body.name;
            if (!validateName(name)) {
                return res.status(400).json({ message: 'Invalid name' });
            }

            //check empty
            if (!req.body.email) {
                return res.status(400).json({ message: 'Email is required !!!' });
            }
            if (!req.body.password) {
                return res.status(400).json({ message: 'Password is required !!!' });
            }
            if (!req.body.name) {
                return res.status(400).json({ message: 'Name is required !!' });
            }
            if (!req.body.phone) {
                return res.status(400).json({ message: 'Phone is required !!' });
            }
            if (req.body.phone.length > 13 || req.body.phone.length < 10) {
                return res.status(400).json({ message: 'Phone Invalid!! (10 -13 number)' });
            }

            //Create New User
            const newUser = await new User({
                name: name,
                email: email,
                password: hashed,
                phone: phoneNumber,
                apartment: req.body.apartment,
                street: req.body.street,
                provider: req.body.provider,
                district: req.body.district,
                city: req.body.city
            });
            const user = await newUser.save();
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    //Login 
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (!user) {
                res.status(404).json({ message: "Email or Password is incorrect" })
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                res.status(401).json({ message: 'Invalid email or password' })
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