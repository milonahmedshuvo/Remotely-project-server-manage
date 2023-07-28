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
    const userInfoDataCollections = client.db("remotelyDatabase").collection("newUserData")
    const jobSeekerEmployerJobPostCollections = client.db("remotelyDatabase").collection("createNewJobPost") 




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






    // job Seeker query  
    app.get("/userInfo", async (req, res) => {
         const email = req.query.email
        const filter = {email:email, userIdentity:"Employer"}
        const result= await userInfoDataCollections.findOne(filter)
        res.send(result) 
    })



    // job seeker/employer job post 
    app.post("/jobSeeker/employerJobpost", async (req, res) => {
        const jobPost = req.body
        const result= await jobSeekerEmployerJobPostCollections.insertOne(jobPost)
        res.send(result)   
    } )



  //  get email query job post data 
  app.get("/getJobPostData", async (req, res) => {
     const email = req.query.email
     const filter = {email: email}
     const result= await jobSeekerEmployerJobPostCollections.find(filter).toArray()
     res.send(result)
  }) 


  app.delete("/jobPostDelete/:id", async (req, res) => {
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    console.log(query)
    const deletePost = await jobSeekerEmployerJobPostCollections.deleteOne(query)
    res.send(deletePost)
  })












// Finds job search
app.get("/findJobLocation", async (req, res) => {
  const filter = {}
  const result = await jobPostDataCollections.find(filter).project({jobTitle:1, companyName: 1}).toArray()
  res.send(result)
})

app.get("/alljobs", async (req, res) => {
  const filter = {}
  const result = await jobPostDataCollections.find(filter).toArray()
  res.send(result)
})

app.get("/jobSerchFilter", async (req, res)=> {
    const company = req.query.company
    const jobtitle = req.query.job
    const quary = {
      companyName:company,
      jobTitle:jobtitle 
    }
    console.log(quary)
    
    const data = await jobPostDataCollections.find(quary).toArray()
    if(data){
      res.send(data)
    }
    
    res.send({massage:"Data not found"})
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
