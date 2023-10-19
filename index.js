const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const cartCollection = client.db("brandsCardDB").collection('cart')

    
    //  create data from client server 
    app.post('/brandNames', async (req, res) => {
      const brands = req.body;
      const result = await brandCarsCollection.insertOne(brands)
      res.send(result)
    })

    // Read multiple product brand wise
    app.get('/brandNames/:brandName', async (req, res) => {
      const name = req.params.brandName;
      const query = { brandName: name }
      const cursor = brandCarsCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // Read single product brand wise
    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId (id) }
      console.log(query)
      const result = await brandCarsCollection.findOne(query)
      res.send(result)
    })

    app.put('/brandNames/:id',async(req,res)=>{
      const update = req.body;
      const id= req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedDoc = {

        // name, brandName, type, description, price, rating, brandImage

          $set: {
              name:update.name,
              brandName:update.brandName, 
              type:update.type, 
              description:update.description, 
              price:update.price, 
              rating:update.rating,
              brandImage:update.brandImage,
             
          }
      }

      const result = await brandCarsCollection.updateOne(query,updatedDoc,options)
      res.send(result)
  })
  
    // load all 6 brands name and images
    app.get('/brandNames', async (req, res) => {
      const brands = req.body;
      const cursor = brandsNameCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // 
    app.post("/addTocart", async (req, res) => {
      const cart = req.body;
      console.log("new post ", cart);
      const result = await cartCollection.insertOne(cart);
      console.log(result);
      res.send(result);
  });

  // 
  app.get("/addTocart/:email", async (req, res) => {
    const find = req.params.email;
    console.log(find);
    const query = { email: find };
    const cursor = cartCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
});

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

