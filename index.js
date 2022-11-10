const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
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

//-----------
//-----------
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

//-----------
//-----------

async function run() {
    try {
        //---------------
        const dataCollection = client.db('oralCare').collection('blogs');
        const services = client.db('oralCare').collection('services');
        const reviewsCollection = client.db('oralCare').collection('reviews');
        //--------------
        //--------------

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })
        //--------------
        //---------------
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = dataCollection.find(query);
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
        app.get('/serviceshome', async (req, res) => {
            const query2 = {};
            const cursor2 = services.find(query2).limit(3);
            const allServices = await cursor2.toArray();
            res.send(allServices);
            // console.log(allServices)
        });
        //---------------
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const quary3 = { _id: ObjectId(id) };
            const result = await services.findOne(quary3);
            res.send(result);

        });
        //---------------
        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewsCollection.insertOne(review)
            res.send(result);
        });
        //---------------
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { serviceId: id };
            const allReviews = reviewsCollection.find(query).sort({ time: -1 })
            const reviews = await allReviews.toArray();
            res.send(reviews);
            // console.log(reviews)
        });
        //---------------
        app.get('/myreviews', verifyJWT, async (req, res) => {

            let query = {};

            if (req.query.email) {
                query = {
                    useremail: req.query.email
                }
            }

            const cursor = reviewsCollection.find(query).sort({ time: -1 })
            const retiews = await cursor.toArray();
            res.send(retiews);
            console.log(query)
            // console.log(retiews)
        });
        //--------------
        app.post('/serviceadd', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await services.insertOne(service)
            res.send(result);
        });
        //--------------
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })
        //--------------
        app.get('/edit/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await reviewsCollection.findOne(query);
            res.send(user);
        })
        //--------------
        app.put('/edit/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            console.log(review);
            const option = { upsert: true };
            const updateReview = {
                $set: {
                    name: review.name,
                    comment: review.comment,
                    url: review.url,
                    rating: review.rating,
                    time: review.time,
                }
            }
            const result = await reviewsCollection.updateOne(filter, updateReview, option);
            res.send(result);
        })
        //--------------
        //--------------


    }

    finally {

    }
}

run().catch(error => console.log(error));




app.get('/', (req, res) => {
    res.send('Oral care server running')
})



app.listen(port, () => {
    console.log(`Server running on ${port}`);
})











