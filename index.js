const { MongoClient, ServerApiVersion } = require("mongodb");
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
     




    app.get("/campanyLimit", async (req, res) => {
        const filter = {}
        const result = await companiceCollections.find(filter).limit(3).toArray()
        res.send(result)
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
