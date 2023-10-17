const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

app.get('/',async(req,res)=>{
    res.send('The brand cars server is running')
})
app.listen(port, ()=>{
    console.log(`The sever is running on port ${port}`)
})

