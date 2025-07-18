const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;


// Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wrus3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  

    
    // await client.connect();
    const eventCollection = client.db("eventManagement").collection("colleges");
    const userCollection = client.db("eventManagement").collection("users");
    const admissionCollection = client.db("eventManagement").collection("admissions");
    
    

// get all Colleges
app.get("/colleges", async (req, res) => {
  try {
    const colleges = await eventCollection.find().toArray();

    res.send(colleges);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).send({ message: "Failed to fetch colleges" });
  }
});

app.get("/colleges/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const college = await eventCollection.findOne({ _id: new ObjectId(id) });

    if (!college) {
      return res.status(404).send({ message: "College not found" });
    }

    res.send(college);
  } catch (error) {
    console.error("Error fetching college details:", error);
    res.status(500).send({ message: "Failed to fetch college details" });
  }
});




// user post in the database

app.post("/users", async (req, res) => {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
});



// post Admission


app.post("/admissions", async (req, res) => {
  try {
    const data = req.body;
    const result = await admissionCollection.insertOne(data);
    res.send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error saving admission:", error);
    res.status(500).send({ success: false, message: "Failed to submit form" });
  }
});




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res) => {

    res.send('Event Management Server is Running')
})

app.listen(port, ()=>{

console.log(`Event Management Server is running on Port: ${port}`)

})