const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Pass}@cluster0.49cfwvw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {


  try {

    await client.connect();

    const brandCarsCollection = client.db("brandsCardDB").collection('brandsCars')
    const brandsNameCollection = client.db("brandsCardDB").collection('brandNames')
    const brandsSldierCollection = client.db("brandsCardDB").collection('brandSlider')
 

    //  create data from client server 

    app.post('/brandNames', async (req, res) => {
      const brands = req.body;
      const result = await brandCarsCollection.insertOne(brands)
      res.send(result)
    })

// load all 6 brands name and images
    app.get('/brandNames', async (req, res) => {
      const brands = req.body;
     const cursor =  brandsNameCollection.find()
     const result = await cursor.toArray()
     res.send(result)
    })

    // load single brands slider
    app.get('/brandNames/:brandName', async(req,res)=>{
      const name = req.params.brandName;
      const query = { brandName: name}
      const result = await brandsSldierCollection.findOne(query);
      res.send(result)
    })
   


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.send('The brand cars server is running')
})
app.listen(port, () => {
  console.log(`The sever is running on port ${port}`)
})

