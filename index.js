const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l0zxzgu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        //---------------
        const userCollection = client.db('oralCare').collection('blogs');
        const services = client.db('oralCare').collection('services');

        //---------------
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
            // console.log(blogs)
        });
        //---------------
        app.get('/services', async (req, res) => {
            const query2 = {};
            const cursor2 = services.find(query2);
            const allServices = await cursor2.toArray();
            res.send(allServices);
            // console.log(allServices)
        });
        //---------------
        app.get('/services', async (req, res) => {
            const query2 = {};
            const cursor2 = services.find(query2);
            const allServices = await cursor2.toArray();
            res.send(allServices);
            // console.log(allServices)
        });
        //---------------
        //---------------
        //---------------
    }

    finally {

    }
}

run().catch(error => console.log(error));




app.get('/', (req, res) => {
    res.send('genius car server is running')
})



app.listen(port, () => {
    console.log(`Server running on ${port}`);
})