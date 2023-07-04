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




    app.get("/job/:companyName", async (req, res ) => {
      const name = req.params.companyName
      const filter ={companyName:name}
      const data = await jobPostDataCollections.find(filter).toArray()
      res.send(data)
    })






  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);















app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Remotely job portal app listening on port ${port}`);
});
