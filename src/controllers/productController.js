const Product = require('../models/Product');
const multer = require('multer');

// Xử lý hình ảnh
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function(req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const upload = multer({ storage: storage }).single('image');

const productController = {
    createProduct: async(req, res) => {
        try {
            upload(req, res, async(err) => {
                if (err) {
                    return res.status(400).json({ message: 'Error uploading image' });
                }
                const file = req.file;
                if (!file) return res.status(400).send('No image in the request');

                const fileName = file.filename;
                const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

                // Validate fields
                function validateName(name) {
                    const re = /^[a-zA-Z ]*$/;
                    return re.test(name);
                }
                const name = req.body.name;
                if (!validateName(name)) {
                    return res.status(400).json({ message: 'Invalid Name! Please try again!' });
                }

                function validateLocalProduct(localProduct) {
                    const re = /^[a-zA-Z ]*$/;
                    return re.test(localProduct);
                }
                const localProduct = req.body.localProduct;
                if (!validateLocalProduct(localProduct)) {
                    return res.status(400).json({ message: 'Invalid Local Product! Please try again!' });
                }

                const price = req.body.price;
                if (/[^0-9]/.test(price)) {
                    return res.status(400).json({ message: 'Price number can only contain numbers' });
                };
                const countInStock = req.body.countInStock;
                if (/[^0-9]/.test(countInStock)) {
                    return res.status(400).json({ message: 'Count In Stock number can only contain numbers' });
                };

                // Check Empty
                if (!req.body.name) {
                    return res.status(400).json({ message: 'Name is required!' });
                }

                if (!req.body.takeCare) {
                    return res.status(400).json({ message: 'Take Care is required!' });
                }

                if (!req.body.localProduct) {
                    return res.status(400).json({ message: 'Local My Product is required!' });
                }

                if (!req.body.price) {
                    return res.status(400).json({ message: 'Price My Product is required!' });
                }

                if (!req.body.countInStock) {
                    return res.status(400).json({ message: 'Count In Stock is required!' });
                }

                // Check value và length
                if (req.body.price.length > 5) {
                    return res.status(400).json({ message: 'Price Product (0-9999)!' });
                }

                if (req.body.price < 0 || req.body.price > 9999) {
                    return res.status(400).json({ message: 'Price Product (0-9999)!' });
                }
                if (req.body.countInStock.length > 4 || req.body.countInStock < 0 || req.body.countInStock > 999) {
                    return res.status(400).json({ message: 'Count In Stock (0-999)!' });
                }

                const newProduct = await new Product({
                    name: name,
                    description: req.body.description,
                    takeCare: req.body.takeCare,
                    image: `${basePath}${fileName}`,
                    localProduct: localProduct,
                    price: price,
                    countInStock: countInStock,
                });

                const product = await newProduct.save();
                return res.status(200).json(product);
            });
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    getProducts: async(req, res) => {
        try {
            const products = await Product.find()
            res.status(200).json(products)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    getProductbById: async(req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            if (product) {
                res.status(200).json(product)
            } else {
                return res.status(401).json({ message: 'Product does not exist !' });
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },
    updateProduct: async(req, res) => {
        try {
            upload(req, res, async(err) => {
                if (err) {
                    return res.status(400).json({ message: 'Error uploading image' });
                }

                const file = req.file;
                if (!file) return res.status(400).send('No image in the request');

                const fileName = file.filename;
                const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

                function validateName(name) {
                    const re = /^[a-zA-Z ]*$/;
                    return re.test(name);
                }
                const name = req.body.name;
                if (!validateName(name)) {
                    return res.status(400).json({ message: 'Invalid Name! Please try again!' });
                }

                function validateLocalProduct(localProduct) {
                    const re = /^[a-zA-Z ]*$/;
                    return re.test(localProduct);
                }
                const localProduct = req.body.localProduct;
                if (!validateLocalProduct(localProduct)) {
                    return res.status(400).json({ message: 'Invalid Local Product! Please try again!' });
                }

                const price = req.body.price;
                if (/[^0-9]/.test(price)) {
                    return res.status(400).json({ message: 'Price number can only contain numbers' });
                }
                const countInStock = req.body.countInStock;
                if (/[^0-9]/.test(countInStock)) {
                    return res.status(400).json({ message: 'Count In Stock number can only contain numbers' });
                }

                // Check Empty
                if (!req.body.name) {
                    return res.status(400).json({ message: 'Name is required!' });
                }

                if (!req.body.takeCare) {
                    return res.status(400).json({ message: 'Take Care is required!' });
                }

                if (!req.body.localProduct) {
                    return res.status(400).json({ message: 'Local My Product is required!' });
                }

                if (!req.body.price) {
                    return res.status(400).json({ message: 'Price My Product is required!' });
                }

                if (!req.body.countInStock) {
                    return res.status(400).json({ message: 'Count In Stock is required!' });
                }

                // Check value và length
                if (req.body.price.length > 5) {
                    return res.status(400).json({ message: 'Price Product (0-9999)!' });
                }

                if (req.body.price < 0 || req.body.price > 9999) {
                    return res.status(400).json({ message: 'Price Product (0-9999)!' });
                }
                if (req.body.countInStock.length > 4 || req.body.countInStock < 0 || req.body.countInStock > 999) {
                    return res.status(400).json({ message: 'Count In Stock (0-999)!' });
                }

                const updatedFields = {
                    name: name,
                    image: `${basePath}${fileName}`,
                    localProduct: localProduct,
                    price: price,
                    countInStock: countInStock,
                };

                const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
                    new: true,
                });

                if (!updatedProduct) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                return res.status(200).json(updatedProduct);
            });
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    deleteProduct: async(req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id)
            if (!product) {
                return res.status(401).json({ message: 'Product does not exist !' })
            } else {
                res.status(200).json({ message: 'Delete Product Successfully !' })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
};


module.exports = productController;