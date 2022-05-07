const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

 
// middleware
app.use(cors());
app.use(express.json());
 
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnakg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjenz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db("inventory").collection('product');
        const deliveryCollection = client.db("inventory").collection('delivery');


        // inventories API
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.limit(6).toArray();
            res.send(inventories);
        });
        app.get('/manageInventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await inventoryCollection.findOne(query);
            res.send(service);
        });

        // post
        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        })
        // delete
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        })

        // delivered collection api

        app.post('/delivered', async (req, res) => {
            console.log('delivered')
            const order = req.body;
            const result = await inventoryCollection.insertOne(order);
            res.send(result);

        })



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('Running Islams Vehicle Corporation Successfully!!')
})
  app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})
