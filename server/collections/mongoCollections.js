//mongodb collections configuration
require("dotenv").config();
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URL);
const db = client.db("mongodrive");
client.connect();
const Users = db.collection("users");
module.exports = { Users };