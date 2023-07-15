const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;




// middleware use
app.use(cors());
app.use(express.json());
require("dotenv").config()




async function run() {


  try {
    const uri =`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.hcgdznz.mongodb.net/?retryWrites=true&w=majority`
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });


    const companiceCollections = client.db("remotelyDatabase").collection("companys")
    const jobPostDataCollections = client.db("remotelyDatabase").collection("jobPostData")
    const newUserDataCollections = client.db("remotelyDatabase").collection("newUserData") 




    app.get("/campanyLimit", async (req, res) => {
        const filter = {}
        const result = await companiceCollections.find(filter).limit(3).toArray()
        res.send(result)
    })

    app.get("/allCompany", async (req, res )=> {
       const filter = {}
       const allData = await companiceCollections.find(filter).toArray()
       res.send(allData)
    })


    app.get("/singleCompanydatails/:id", async (req, res) => {
        const id = req.params.id
        const filter = { _id: new ObjectId(id)}
        const data = await companiceCollections.findOne(filter)
        res.send(data)
    })


    // jobpost collection operation start 

    app.get("/job/:companyName", async (req, res ) => {
      const name = req.params.companyName
      const filter ={companyName:name}
      const data = await jobPostDataCollections.find(filter).toArray()
      res.send(data)
    })


    app.get("/jobSingle/:id", async (req, res ) => {
       const id = req.params.id
       const filter ={ _id : new ObjectId(id)}
       const jobpost = await jobPostDataCollections.findOne(filter)
       res.send(jobpost)
    })


    // user data post 
    app.post("/newUserData", async (req, res)=> {
      const data = req.body
      const result = await newUserDataCollections.insertOne(data)
      res.send(result)
    })





  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);















app.get("/", (req, res) => {
  res.send("Remotely server is runing..!");
});

app.listen(port, () => {
  console.log(`Remotely job portal app listening on port ${port}`);
});
