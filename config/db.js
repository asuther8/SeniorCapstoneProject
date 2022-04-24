const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const config = require('config');
const uri = config.get('mongoURI');
const database = config.get('database');

const client = new MongoClient(uri);
const bcrypt = require("bcrypt");

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
      // Salting passwords referenced from: https://www.loginradius.com/blog/engineering/hashing-user-passwords-using-bcryptjs/
      const salt = await bcrypt.genSalt(10);
      jsonData.password = await bcrypt.hash(jsonData.password, salt);
      await users.insertOne(jsonData);
      console.log("Inserted 1 document");
    } else {
      ret = false;
      console.log("username already in use");
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
  return ret;
};

// Insert a user into the database if the username does not already exist
// data: expects two JSON entries (username, password)
const loginUser = async (data) => {
  console.log("Attempting to login");
  var ret = false;
  const collection = "users";
  try {
    await client.connect();
    const jsonData = JSON.parse(data);

    const db = client.db(database);
    const users = db.collection(collection);
    const user = await users.findOne({username: jsonData.username});
    const validPassword = await bcrypt.compare(jsonData.password, user.password);

    console.log(user.password);
    
    if (user !== null && validPassword) {
      ret = true;
      console.log("Login successful");
    } else {
      ret = false;
      console.log("Bad username/password");
    }
  } catch (error) {
    console.log(error);
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
exports.loginUser = loginUser;