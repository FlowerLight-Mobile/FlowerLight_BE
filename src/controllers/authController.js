const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

let refeshTokens = [];
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

    //ACESSTOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.isAdmin,
        }, process.env.ACCESS_KEY, { expiresIn: '3h' })
    },
    //Refesh Token
    generateRefeshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.isAdmin,
        }, process.env.REFESH_KEY, { expiresIn: '365d' });
    },
    //Login 
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (!user) {
                res.status(401).json({ message: "Email or Password is incorrect" })
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                res.status(401).json({ message: 'Invalid email or password' })
            }
            if (user && validPassword) {

                const token = authController.generateAccessToken(user);
                const refeshToken = authController.generateRefeshToken(user)
                refeshTokens.push(refeshToken);
                //Luu cookie
                res.cookie("refeshToken", refeshToken, {
                    httpOnly: true,
                    //secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...other } = user._doc;
                res.status(200).json({...other, token })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },
    //RequestToken
    requestRefeshToken: async(req, res) => {
        //Take refesh token from user
        const refeshToken = req.cookies.refeshToken;
        if (!refeshToken)
            return res.status(401).json({ message: 'You are not authenticated !' });
        if (!refeshTokens.includes(refeshToken)) {
            return res.status(403).json("Refesh Token is not valid !")
        }
        jwt.verify(refeshToken, process.env.REFESH_KEY, (err, user) => {
            if (err) {
                console.log(err)
            }
            refeshTokens = refeshTokens.filter((token) => token !== refeshToken)
                //create new access and refesh token
            const newAccessToken = authController.generateAccessToken(user);
            const newrefeshToken = authController.generateRefeshToken(user);

            refeshTokens.push(newrefeshToken);
            res.cookie("refeshToken", newrefeshToken, {
                httpOnly: true,
                //secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ token: newAccessToken })
        })

    },
    userLogout: async(req, res) => {
        res.clearCookie('refeshToken');
        refeshTokens = refeshTokens.filter((token) => token !== req.cookies.refeshToken)
        res.status(200).json({ message: 'Logout Successfully !' })
    }
}
module.exports = authController;