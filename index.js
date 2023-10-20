const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://brandcars8057:I7R5U8diheqH3tCn@cluster0.49cfwvw.mongodb.net/?retryWrites=true&w=majority`;

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

    // await client.connect();

    const brandCarsCollection = client.db("brandsCardDB").collection('brandsCars')
    const brandsNameCollection = client.db("brandsCardDB").collection('brandNames')
    const cartCollection = client.db("brandsCardDB").collection('cart')


    //  create cars collection 
    app.post('/brandNames', async (req, res) => {
      const brands = req.body;
      const result = await brandCarsCollection.insertOne(brands)
      res.send(result)
    })

    // Read multiple cars brand wise
    app.get('/brandNames/:brandName', async (req, res) => {
      const name = req.params.brandName;
      const query = { brandName: name }
      const cursor = brandCarsCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // Read single cars brand wise
    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query)
      const result = await brandCarsCollection.findOne(query)
      res.send(result)
    })

    // update cars information
    app.put('/brandNames/:id', async (req, res) => {
      const update = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {

        // name, brandName, type, description, price, rating, brandImage

        $set: {
          name: update.name,
          brandName: update.brandName,
          type: update.type,
          description: update.description,
          price: update.price,
          rating: update.rating,
          brandImage: update.brandImage,

        }
      }

      const result = await brandCarsCollection.updateOne(query, updatedDoc, options)
      res.send(result)
    })

    // load all 6 brands name and images
    app.get('/brandNames', async (req, res) => {
      const brands = req.body;
      const cursor = brandsNameCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // Create cart data
    app.post("/addTocart", async (req, res) => {
      const cart = req.body;
      console.log("new post ", cart);
      const result = await cartCollection.insertOne(cart);
      console.log(result);
      res.send(result);
    });

    // Read cart every single data
    app.get("/addTocart/:email", async (req, res) => {
      const find = req.params.email;
      console.log(find);
      const query = { email: find };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Delete cart data
    app.delete("/addTocart/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', async (req, res) => {
  res.send('The brand cars server is running')
})
app.listen(port, () => {
  console.log(`The sever is running on port ${port}`)
})

