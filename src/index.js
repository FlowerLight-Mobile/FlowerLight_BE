const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//import router
const authRoute = require('./routes/authRoutes')
const userRoute = require("./routes/userRoutes")
const productRoute = require('./routes/productRoutes')

dotenv.config();
const app = express()

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('CONNECTED TO MONGO DB')
    })
    .catch((err) => {
        console.error('FAILED TO CONNECT TO MONGO DB:', err)
    })

app.use(cors());
app.use(cookieParser())
app.use(express.json())
app.use('/public/uploads', express.static('public/uploads'));


//Routes Auth
app.use('/api/v1/auth', authRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/products", productRoute)
app.listen(8080, () => {
    console.log('Server running.......')
})