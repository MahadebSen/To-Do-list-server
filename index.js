const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
