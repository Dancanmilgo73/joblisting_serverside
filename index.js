const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://dancan:Dancan2020@search--jobs.sp1it.mongodb.net/search--jobs?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("search--jobs");
    const collection = database.collection("jobsToStore");
    // query for movies that have a runtime less than 15 minutes
    // const query = { runtime: { $lt: 15 } };
    // const options = {
    // sort returned documents in ascending order by title (A->Z)
    //sort: { title: 1 },
    // Include only the `title` and `imdb` fields in each returned document
    // projection: { _id: 0, title: 1, imdb: 1 },
    // };
    const cursor = collection.find({});
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    app.get("/", async (req, res) => {
      const jobs = await cursor.toArray();
      res.send(jobs); /* && jobs.replace(/(<([^>]+)>)/gi, "")) */
    });

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
    // replace console.dir with your callback to access individual elements
    //await cursor.forEach(console.dir);
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);
