const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('outlets'));
app.use(fileUpload());
const port = process.env.PORT || 8080;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q17pz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  app.post('/isAdmin',(req,res)=>{
    const adminsCollection = client.db("kidsHeaven").collection("admins");
    const email=req.body.email;
    adminsCollection.find({email:email})
    .toArray((err,admins)=>{
      if(admins.length===0){
        res.send(false);
      }
      else{
        res.send(true);
      }
    })
    
  });

  app.post('/postReview',(req,res)=>{
    const reviewsCollection = client.db("kidsHeaven").collection("reviews");
    const review=req.body;
    reviewsCollection.insertOne(review)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  app.post('/addService',(req,res)=>{
    const servicesCollection=client.db("kidsHeaven").collection("services");
    const service=req.body;
    servicesCollection.insertOne(service)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

});


app.listen(port, () => {
  console.log(`Kids Heaven listening at http://localhost:${port}`)
})