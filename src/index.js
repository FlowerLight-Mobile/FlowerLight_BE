const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//import router
const authRoute = require('./routes/auth')

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

//Routes
app.use('/api/v1/auth', authRoute)

app.listen(8080, () => {
    console.log('Server running.......')
})