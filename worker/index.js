var cron = require("node-cron");
const fetchGit = require("./fetchTask/fetchJobs");

cron.schedule("0 0 * * *", () => {
  console.log("running a task every midnight");
  fetchGit();
});
