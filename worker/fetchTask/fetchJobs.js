const fetch = require("node-fetch");
//require("dotenv").config();
const { MongoClient } = require("mongodb");
//const { MongoCron } = require("mongodb-cron");

const url =
  "mongodb+srv://dancan:Dancan2020@search--jobs.sp1it.mongodb.net/search--jobs?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });

//try mongodb cron
//const db = client.db("search--jobs");
async function fetchGit() {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("search--jobs");
    const col = db.collection("jobsToStore");
    const options = { ordered: true };
    const APIUrl = "https://jobs.github.com/positions.json";
    let page = 0;
    let numOfJobs = 0;
    const jobs = [];
    do {
      const res = await fetch(`${APIUrl}?page=${page}`);
      var data = await res.json();
      numOfJobs = data.length;
      jobs.push(...data);
      page++;
    } while (numOfJobs > 0);

    console.log(jobs.length);
    const result = await col.insertMany(jobs, options);

    console.log(`${result.insertedCount} documents were inserted`);
    //const myDoc = await col.findOne();
    //console.log(myDoc);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
fetchGit().catch(console.dir);
module.exports = fetchGit;
