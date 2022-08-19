const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middleware for posting
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zslia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("crudOperation");
        const userCollection = database.collection("users");
        const bookCollection = database.collection("books");
        console.log('mongodb is added');

        // POST method
        app.post('/users', async(req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('got new product', req.body);
            console.log('got new product', result);
            res.json(result);
        })

        // GET method for all users
        app.get('/users', async(req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // GET method for all books
        app.get('/books', async(req, res) => {
            const cursor = bookCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // DELETE METHOD for users
        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            console.log('Deleted product id ', result);
            res.json(result);
        })

        // GET single user
        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            console.log('loaded product', id);
            res.send(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })

//   hard code 
// client.connect(err => {
//   const collection = client.db("databaseName").collection("users");
//   // perform actions on the collection object
//   console.log('Hitting the database');
//   const user = {id:1, name: 'xyz', email: "xyz@gmail.com" };
//   collection.insertOne(user)
//     .then(() => {
//     console.log('insert successfully');
//   })
//   // client.close();
// });



// const userstest = [
//     {id: 1, name: 'abc', email:'abc@gmail.com'},
//     {id: 2, name: 'def', email:'abc@gmail.com'},
//     {id: 3, name: 'zxvc', email:'abc@gmail.com'},
// ]



// app.post('/userstest', (req, res) => {
//     const newUser = req.body;
//     newUser.id = userstest.length;
//     userstest.push(newUser);
//     res.json(newUser);
//     res.send("hitted")
//     console.log("inside the post", req.body);
// })

// app.get('/userstest/:id', (req, res) => {
//     // console.log(req.params.id);
//     const id = req.params.id;
//     const user = users[id];
//     res.send(user);
// })