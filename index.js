// BRING IN THE PACKAGES
const express = require("express");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const app = express();
const port = 3000;

//SET UP THE DATABASE - the data lices in a file called db.json, in this project folder
const adapter = new JSONFile("db.json");
//what the database looks like before anyone saves anything: an empty list of moods
const defaultData = { moods: [] };
const db = new Low(adapter, defaultData);

// ROUTE 1: SERVE THE STATIC PAGE AT "/"
app.use(express.static("public"));

// let the server read json sent from the page
app.use(express.json());

//ROUTE 2: STORE NEW DATA AT "/new-data"
app.post("/new-data", async function (req, res) {
  //load the latest saved data from db.json
  await db.read();

  //build the new entry from what the page sent, plus today's date
  const newEntry = {
    mood: req.body.mood,
    note: req.body.note,
    date: new Date().toLocaleDateString(),
  }

  //add the new entry to the moods list, then save the file
  db.data.moods.push(newEntry);
  await db.write();

  //tell the page it worked - send a success note
  res.json({ message: "Data saved!" });
});

//ROUTE 3: SERVE STORED DATA AT "/data"
app.get("/data", async function (req, res) {
  //load the latest saved data from db.json
  await db.read();

  //send the list of moods back to the page
  res.json(db.data.moods);
});

//START LISTENING (keep this at the bottom)
app.listen(port, function () {
  console.log("Server is running on http://localhost:" + port);
});