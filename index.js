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
    const eventCollection = client.db("eventManagement").collection("allEvents");

    // add car : Post

      app.post("/addEvent", async (req, res) => {
      const newEvent = req.body;
      console.log(newEvent);
      newEvent.addedAt = new Date().toISOString();
      newEvent.datetime = new Date(req.body.datetime);


      const result = await eventCollection.insertOne(newEvent);
      res.send(result);
    });

    // get all events: GET
app.get("/event", async (req, res) => {
  try {
    const events = await eventCollection
      .find()
      .sort({ datetime: -1 }) // descending order: latest datetime first
      .toArray();

    res.send({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send({ message: "Failed to fetch events" });
  }
});

// PATCH: Join Event
app.patch("/event/:id", async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const event = await eventCollection.findOne({ _id: new ObjectId(id) });
    if (!event) return res.status(404).send({ message: "Event not found" });

    if (event.joinedUsers?.includes(email)) {
      return res.send({ success: false, message: "User already joined" });
    }

    const result = await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { attendeeCount: 1 },
        $addToSet: { joinedUsers: email },
      }
    );

    res.send({ success: true, result });
  } catch (error) {
    console.error("Join event error:", error);
    res.status(500).send({ message: "Server error" });
  }
});




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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