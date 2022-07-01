const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sq8c4jl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const newTasksCollection = client.db("To-do").collection("newTasks");
    const completedTasksCollection = client
      .db("To-do")
      .collection("completedTasks");

    //get all new tasks
    app.get("/newtasks", async (req, res) => {
      const query = {};
      const cursor = newTasksCollection.find(query);
      const newTasks = await cursor.toArray();
      res.send(newTasks);
    });

    //get all completed tasks
    app.get("/completedtasks", async (req, res) => {
      const query = {};
      const cursor = completedTasksCollection.find(query);
      const completedTasks = await cursor.toArray();
      res.send(completedTasks);
    });

    //insert a new task
    app.post("/addnewtask", async (req, res) => {
      const doc = await req.body;
      const result = await newTasksCollection.insertOne(doc);
      res.send(result);
    });

    //delete a completed task
    app.delete("/deletecompletedtask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await completedTasksCollection.deleteOne(query);
      res.send(result);
    });

    //delete a new task
    app.delete("/deletenewtask/:id", async (req, res) => {
      const x = req.params.id;
      const query = { _id: ObjectId(x) };
      const result = await newTasksCollection.deleteOne(query);
      res.send(result);
    });

    //insert task into completedTasks
    app.post("/addcompletedtask", async (req, res) => {
      const doc = await req.body;
      const result = await completedTasksCollection.insertOne(doc);
      res.send(result);
    });

    //update new task
    app.put("/updatetask/:id", async (req, res) => {
      const id = req.params.id;
      const edited = await req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: edited,
      };
      const result = await newTasksCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hellow from to-do server");
});

app.listen(port, () => {
  console.log("to-do server is running...");
});
