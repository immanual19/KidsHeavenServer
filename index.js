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

app.get('/',(req,res)=>{
  res.send('Welcome to the database of KidsHeaven');
})

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
    const adminsCollection = client.db("kidsHeaven").collection("admins");
    adminsCollection.insertOne(emailId)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });





  //Get one from All services

  app.post('/getFromAllServices',(req,res)=>{
    const id=req.body.id;
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
  });

  //Post Payment Information to database

  app.post('/postPaymentInfo',(req,res)=>{
    const paymentInfo=req.body;
    const paymentsCollection=client.db("kidsHeaven").collection("payments");
    paymentsCollection.insertOne(paymentInfo)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  //Fetching all orders

  app.get('/getAllOrder',(req,res)=>{
    const ordersCollection=client.db("kidsHeaven").collection("payments");
    ordersCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });



//Specific user order

app.post('/myOrder',(req,res)=>{
        const email=req.body.email;
        const ordersCollection=client.db("kidsHeaven").collection("payments");
        ordersCollection.find({userEmail:email})
        .toArray((err,documents)=>{
          res.send(documents);
        })

});

//Order status update

app.patch('/updateOrderStatus',(req,res)=>{
  const modified=req.body;
  const {id,status}=modified;
  const ordersCollection=client.db("kidsHeaven").collection("payments");
  ordersCollection.updateOne({_id:ObjectId(id)},
  {
    $set:{serviceStatus:status}
  })
  .then(result=>{
    res.send(result.modifiedCount>0)
  })
});


//Delete 1 basic Service

app.post('/deleteBasicService',(req,res)=>{
  const id=req.body.id;
  
  const basicServicesCollection=client.db("kidsHeaven").collection("basicServices");
  basicServicesCollection.deleteOne({
    _id:ObjectId(id)
  })
  .then(result=>{
    res.send(result.deletedCount>0)
  })
});

//Delete 1 premium Service
app.post('/deletePremiumService',(req,res)=>{
const id=req.body.id;
const premiumServicesCollection=client.db("kidsHeaven").collection("services");
premiumServicesCollection.deleteOne({
  _id:ObjectId(id)
})
.then(result=>{
  res.send(result.deletedCount>0)
})

});

//Add a branch

app.post('/addABranch',(req,res)=>{
  const branchInfo=req.body;
  const branchesCollection=client.db("kidsHeaven").collection("branches");
  branchesCollection.insertOne(branchInfo)
  .then(result=>{
    res.send(result.insertedCount>0)
  });


});
  //Show all Branch
app.get('/getAllBranches',(req,res)=>{
  const branchesCollection=client.db("kidsHeaven").collection("branches");
  branchesCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents);
  })
});
});


app.listen(port, () => {
  console.log(`Kids Heaven listening at http://localhost:${port}`)
})