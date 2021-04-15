const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
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

  //admin check
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

  //Review Posting
  app.post('/postReview',(req,res)=>{
    const reviewsCollection = client.db("kidsHeaven").collection("reviews");
    const review=req.body;
    reviewsCollection.insertOne(review)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  //Premium service Post
  app.post('/addService',(req,res)=>{
    const servicesCollection=client.db("kidsHeaven").collection("services");
    const service=req.body;
    servicesCollection.insertOne(service)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  //Basic Service Post
  app.post('/addBasicService',(req,res)=>{
    const basicServicesCollection=client.db("kidsHeaven").collection("basicServices");
    const service=req.body;
    basicServicesCollection.insertOne(service)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  //Basic Service Get
  app.get('/getBasicService',(req,res)=>{
    const basicServicesCollection=client.db("kidsHeaven").collection("basicServices");
    basicServicesCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });

  //Premium Service Get
  app.get('/getPremiumService',(req,res)=>{
    const premiumServicesCollection=client.db("kidsHeaven").collection("services");
    premiumServicesCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });

  //Review Getting

  app.get('/getReview',(req,res)=>{
    const showReviewsCollection = client.db("kidsHeaven").collection("reviews");
    showReviewsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });

  //Make Admin

  app.post('/makeAdmin',(req,res)=>{
    const emailId=req.body;
    console.log('SSS: ',emailId);
    const adminsCollection = client.db("kidsHeaven").collection("admins");
    adminsCollection.insertOne(emailId)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });


  // //Get Single Basic

  // app.post('/getSingleBasicService',(req,res)=>{
  //   const id=req.body.id;
  //   const basicServicesCollection=client.db("kidsHeaven").collection("basicServices");
  //   basicServicesCollection.find({_id:ObjectId(id)})
  //   .toArray((err,documents)=>{
  //     res.send(documents);
  //   })
  // });

  // //Get single Premium
  // app.post('/getSinglePremiumService',(req,res)=>{
  //   const id=req.body.id;
  //   const premiumServicesCollection=client.db("kidsHeaven").collection("services");
  //   premiumServicesCollection.find({_id:ObjectId(id)})
  //   .toArray((err,documents)=>{
  //     res.send(documents);
  //   })
  // });


  //Get All services

  app.post('/getFromAllServices',(req,res)=>{
    const id=req.body.id;
    console.log('New Id is: ',id);
    const basicServicesCollection=client.db("kidsHeaven").collection("basicServices");
    const premiumServicesCollection=client.db("kidsHeaven").collection("services");
    basicServicesCollection.find({_id:ObjectId(id)})
    .toArray((err,document)=>{
      if(document.length!==0){
        res.send(document);
      }
      
    })
    premiumServicesCollection.find({_id:ObjectId(id)})
    .toArray((err,document)=>{
      if(document.length!==0){
        res.send(document);
      }
    })
  })

});




app.listen(port, () => {
  console.log(`Kids Heaven listening at http://localhost:${port}`)
})