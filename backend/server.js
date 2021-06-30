const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const pinRoute = require('./routes/pins')
const userRote = require('./routes/users')

app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5000

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
}).then(() => {
    console.log('mongo running succesfully')
}).catch(err => {
    console.log(err)
})

app.use('/api/pins', pinRoute)
app.use('/api/users', userRote)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
