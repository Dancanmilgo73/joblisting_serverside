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

    let page = 0;
    let numOfJobs = 0;
    let countries = [
      "gb",
      "at",
      "au",
      "br",
      "ca",
      "de",
      "fr",
      "in",
      "it",
      "nl",
      "nz",
      "pl",
      "ru",
      "sg",
      "us",
      "za",
    ];
    let countryLen = countries.length;
    const jobs = [];
    while (countryLen > 0) {
      const APIUrl = `http://api.adzuna.com/v1/api/jobs/${
        countries[countryLen - 1]
      }/search/1?app_id=a26ccfa3&app_key=d61ce5e20a189f11648fba513dd855d4&results_per_page=50&what=javascript%20developer&content-type=application/json`;
      do {
        const res = await fetch(`${APIUrl}`); /* ?page=${page} */
        var data = await res.json();
        numOfJobs = data.length;
        console.log(data.results);
        jobs.push(...data.results);
        page++;
      } while (numOfJobs > 0);

      countryLen--;
    }

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
