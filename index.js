const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongo db
const uri =
  "mongodb+srv://mdnoyon956993:3Cd222ArQEVKWEtN@cluster0.zo35n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("movies");
    //get operation
    app.get("/users", async (request, response) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      response.send(result);
    });
    //specific data get
    app.get("/users/:id", async (request, response) => {
      const dynamicId = request.params.id;
      const query = { _id: new ObjectId(dynamicId) };
      const result = await userCollection.findOne(query);
      response.send(result);
    });
    //create operation
    app.post("/users", async (request, response) => {
      console.log("post is hitting");
      const user = request.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      response.send(result);
    });
    // update operation
    app.put("/users/:id", async (request, response) => {
      const dynamicId = request.params.id;
      // console.log(dynamicId);
      const user = request.body;
      console.log(user);
      const filter = { _id: new ObjectId(dynamicId) };
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateUser,
        options
      );
      response.send(result);
    });
    //delete
    app.delete("/users/:id", async (request, response) => {
      const id = request.params.id;
      console.log("delete from database by this id ", id);

      // Query for a movie that has title "Annie Hall"
      const query = { _id: new ObjectId(id) };
      // console.log("what is query ", query);

      const result = await userCollection.deleteOne(query);
      // console.log("what is deleted result ", result);

      response.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

//Request
app.get("/", (request, response) => {
  response.send("Initialized the basic server with basic structure");
});

app.listen(port, () => {
  console.log(`this server is run on this port ${port}`);
});
