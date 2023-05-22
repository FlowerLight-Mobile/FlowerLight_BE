const User = require("../models/User")

const userController = {
    //get all user
    getAllUsers: async(req, res) => {
        try {
            const user = await User.find()
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    //Get User
    getUser: async(req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(401).json({ message: 'User does not exist !' })
            };
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateInfoUser: async(req, res) => {
        try {
            function validateName(name) {
                const re = /^[a-zA-Z ]*$/;
                return re.test(name);
            }
            const name = req.body.name;
            if (!validateName(name)) {
                return res.status(401).json({ message: 'Invalid name' });
            }
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                name: name,
                apartment: req.body.apartment,
                street: req.body.street,
                provider: req.body.provider,
                district: req.body.district,
                city: req.body.city,
            });
            if (updateUser) {
                return res.status(200).json(updateUser);
            } else {
                return res.status(401).json({ message: 'User does not exist !' });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    //Reset Password
    resetPassword: async(req, res) => {
        try {

        } catch (err) {
            return res.status(500).json(err);
        }
    },
    //ChangePass
    changePassword: async(req, res) => {
        try {

        } catch (err) {
            return res.status(500).json(err);
        }
    },
    //Delete User
    deleteUser: async(req, res) => {
        try {

            const user = await User.findByIdAndDelete(req.params.id)
            if (user) {
                res.status(200).json({ message: "Delete Success !!" })
            } else {
                res.status(401).json({ message: 'User does not exist !' })
            }
        } catch (err) {
            res.status(500).json(err)

        }
    }
};
//DELETE USER


module.exports = userController;