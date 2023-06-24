//mongodb collections configuration
require("dotenv").config();
const mongodb = require("mongodb");
const { ObjectId, MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URL);
const db = client.db("mongodrive");
client.connect();
const Users = db.collection("users");
const FileDetails= db.collection("fileDetails");
const FileBucket = new mongodb.GridFSBucket(db, { bucketName: "drive" });
module.exports = { Users, FileDetails, FileBucket, ObjectId };