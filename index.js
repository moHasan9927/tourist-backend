const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Tourist");
    const spotsCollection = database.collection("spots");

    // ADD TOURIST SPOT
    app.post("/tourist-spots", async (req, res) => {
      const newSpot = req.body;
      const result = await spotsCollection.insertOne(newSpot);
      res.send(result);
    });

    // GET ALL SPOTS
    app.get("/tourist-spots", async (req, res) => {
      const result = await spotsCollection.find().toArray();
      res.send(result);
    });

    // GET SINGLE SPOT
    app.get("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotsCollection.findOne(query);
      res.send(result);
    });

    // GET USER SPOTS
    app.get("/my-spots/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await spotsCollection.find(query).toArray();
      res.send(result);
    });

    // UPDATE SPOT
    app.put("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const updatedSpot = req.body;

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedSpot,
      };

      const result = await spotsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // DELETE SPOT
    app.delete("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotsCollection.deleteOne(query);
      res.send(result);
    });

    console.log("MongoDB connected successfully");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourist Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
