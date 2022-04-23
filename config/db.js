const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const config = require('config');
const uri = config.get('mongoURI');
const database = config.get('database');

const client = new MongoClient(uri);

const connectDB = async () => {
  try {
    await mongoose.connect(
      uri,
      {
        useNewUrlParser: true
      }
    );

    console.log('MongoDB is connected to ' + uri);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Insert a user into the database if the username does not already exist
// data: expects two JSON entries (username, password)
const addUser = async (data) => {
  var ret = false;
  const collection = "users";
  try {
    await client.connect();
    const jsonData = JSON.parse(data);

    const db = client.db(database);
    const users = db.collection(collection);
    const user = await users.findOne({username: jsonData.username});

    if (user === null) {
      ret = true;
      await users.insertOne(jsonData);
      console.log("Inserted 1 document");
    } else {
      ret = false;
      console.log("username already in use");
    }
  } finally {
    client.close();
  }
  return ret;
};

// Update/add user information only if the user already exists
const updateUser = async (data) => {
  const collection = "users";
  const jsonData = JSON.parse(data);
  const username = jsonData.username;
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    const users = dbo.collection(collection);

    const query = users.find(username);
    const update = {$set:jsonData};
    const options = {upsert: true };
    users.updateOne(query, update, options, function(err, res) {
      if (err) throw err;
      const updated = res.modifiedCount;
      if (updated) {
        console.log("1 document updated");
      } else {
        console.log("user not found");
      }
      db.close();
    });
  });
};

exports.connectDB = connectDB;
exports.addUser = addUser;
exports.updateUser = updateUser;