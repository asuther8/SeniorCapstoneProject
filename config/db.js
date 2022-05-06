const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const MongoDB = require("mongodb");
const config = require('config');
const uri = config.get('mongoURI');
const database = config.get('database');
const Joi = require("joi");
const crypto = require("crypto");
//const { User } = require("/../models/User");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const client = new MongoClient(uri);
const bcrypt = require("bcrypt");
//Email validation referenced from: https://www.npmjs.com/package/email-validator
const validator = require("email-validator");
//Nodemailer/sending emails referenced from: https://dev.to/cyberwolve/how-to-implement-password-reset-via-email-in-node-js-132m
const nodemailer = require("nodemailer");
const moment = require("moment");

const csvtojson = require('csvtojson');
const { usePapaParse } = require('react-papaparse');
const { find } = require('../models/token');

const connectDB = async () => {
  try {
    await mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
    const email = await users.findOne({email: jsonData.email});
    if (user === null && email === null && validator.validate(jsonData.email)) {
      ret = true;
      // Salting passwords referenced from: https://www.loginradius.com/blog/engineering/hashing-user-passwords-using-bcryptjs/
      const salt = await bcrypt.genSalt(10);
      jsonData.password = await bcrypt.hash(jsonData.password, salt);
      await users.insertOne(jsonData);
      console.log("Inserted 1 document");
    } else {
      ret = false;
      console.log("username or email already in use/invalid");
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
  var ret = false;
  const collection = "users";
  try {
    await client.connect();
    const jsonData = JSON.parse(data);
    const db = client.db(database);
    const users = db.collection(collection);
    const user = await users.findOne({username: jsonData.username});
    const validPassword = await bcrypt.compare(jsonData.password, user.password);
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

// Converts an arbitrary date string to ISO format YYYY-MM-DD hh:mm:ss
const convertDate = async (date) => {
  var date = new Date(date).toString();
  var year = date.slice(11,15);
  var month = date.slice(4,7);
  var day = date.slice(8, 10);
  var time = date.slice(16,24);
  switch(month){
    case "Jan":
      month = "01"; break;
    case "Feb":
      month = "02"; break;
    case "Mar":
      month = "03"; break;
    case "Apr":
      month = "04"; break;
    case "May":
      month = "05"; break;
    case "Jun":
      month = "06"; break;
    case "Jul":
      month = "07"; break;
    case "Aug":
      month = "08"; break;
    case "Sep":
      month = "09"; break;
    case "Oct":
      month = "10"; break;
    case "Nov":
      month = "11"; break;
    case "Dec":
      month = "12"; break;
  }
  return year + '-' + month + '-' + day + ' ' + time;
}

const fetchData = async (data) => {
  const collection = "users";
  console.log(data);
  try {
    await client.connect();
    const jsonData = JSON.parse(data);
    const db = client.db(database);
    const users = db.collection(collection);
    const user = await users.findOne({username: jsonData.username});
    if (user !== null) {
      console.log("Found user " + jsonData.username)
      return user;
      const data = await users.findOne({username: jsonData.username});
      console.log(data);
    } else {
      ret = false;
      console.log("Could not find username in database");
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
  return true;
};

const uploadFile = async (data) => {
  var ret = false;
  const collection = "users";
  try {
    await client.connect();
    const jsonData = JSON.parse(data);
    const db = client.db(database);
    const users = db.collection(collection);
    const user = await users.findOne({username: jsonData.username});
    const fileData = jsonData.fileData.data;
    var csv = "";
    for (var i = 0; i < fileData.length; i++){
      var count = 0;
      for (var property in fileData[i]){
        if (count === 9) csv += fileData[i][property] + "\n";
        else csv += fileData[i][property] + ",";
        count++;
      }
    }
    console.log(csv);
    if (user !== null) {
      var result = csvtojson().fromString(csv).then(async source => {
        await client.connect();
        const jsonData = JSON.parse(data);
        const db = client.db(database);
        const users = db.collection(collection);
        var arr = [];
        for (var i = 0; i < source.length; i++){
            var row = source[i];
            var date = await convertDate(source[i]["Date"]);
            var dataRow = "Data." + date;
            source[i]["Date"] = date;
            arr.push(row);
        }

        // Push timestamps to user's Data array and sort
        try{          
          await users.updateMany({username: jsonData.username},
          {
            $push: {
              "Data": {
                $each: arr,
                $sort: {"Date": 1}
              }
            }
          },
          {
            upsert: true
          });     
        } catch (err){
          console.log(err);
        }

        users.aggregate([
          { $match: { username: jsonData.username }},
          { $unwind: '$Data' },
          { $group: { _id: '$Data.Date', data: { $addToSet: '$Meta' }}}
        ]);

        /*
        users.aggregate([
          { $match: { username: jsonData.username }},
          {'$addFields': {'Data.Date': {'$setUnion': ['$Data.Date', []]}}}
        ])
        */
        
        users.find({username: jsonData.username}).forEach(async(doc) => {
          await doc.Data.forEach(async(d) => {
            //console.log(d["Date"]);
            /*
            if (last["Date"] === d["Date"]){
              console.log("Removing " + last["Date"] + " which matches " + d["Date"]);
              await users.updateOne({username: jsonData.username}, { $pull: { "Data": { Date: d["Date"]}}});
            }
            */
          })
        })
        

      }).catch(err => {
        console.log(err);
      }).finally(res => {
        client.close();
      })
      if (result) ret = true;

      console.log("Upload successful");
    } else {
      ret = false;
      console.log("Could not find username in database");
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
  return ret;
};

// Send an email to help user recover password.
// data: expects one JSON entries (email)
const recoverAccount = async (data) => {
  var ret = false;
  const collection = "users";
  try {
    await client.connect();
    const jsonData = JSON.parse(data);
    const db = client.db(database);
    const users = db.collection(collection);
    const user = await users.findOne({email: jsonData.email});
    if (user !== null) {
      ret = true;
      console.log("Found user with this email");
      var token = await users.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const link = `http://localhost:3000/password-reset?userID=${user._id}&token=${token.token}`;
      //const link = `http://localhost:3000/password-reset/${user._id}/${token.token}`;
      await sendEmail(user.email, "diabeasy - Password reset", link);
      console.log("Sent password reset link");
      ret = true;
    } else {
      ret = false;
      console.log("No user with this email");
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
  return ret;
};

const resetPassword = async (data) => {
  var ret = false;
  const collection = "users";
  try {
    await client.connect();
    const jsonData = JSON.parse(data); //password, queryID, queryToken
    const db = client.db(database);
    const users = db.collection(collection);
    console.log(await users.findOne({email: "diabeasy.noreply@gmail.com"}));
    const user = await users.findOne({_id: MongoDB.ObjectId(jsonData.queryID)});
    if (!user){
      console.log("Invalid or expired link");
      return ret;
    }
    const token = await Token.findOne({
        userId: user._id,
        token: jsonData.queryToken,
    })
    if (!token){
      console.log("Invalid or expired link");
      return ret;
    }
    console.log("Found user");
    const salt = await bcrypt.genSalt(10);
    jsonData.password = await bcrypt.hash(jsonData.password, salt);
    delete jsonData.queryID;
    delete jsonData.queryToken;
    const query = await users.findOne(user);
    const update = {$set: jsonData};
    const options = {upsert: false };
    users.updateOne(query, update, options, function(err, res) {
      if (err) throw err;
      const updated = res.modifiedCount;
      if (updated) {
        console.log("User updated password");
      } else {
        console.log("user not found");
      }
    });
    await token.delete();
    ret = true;
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
  return ret;
};

/*var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'my-node'
 });
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  
module.exports = connection; */

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

//send email, referenced from: https://www.tutsmake.com/forgot-reset-password-in-node-js-express-mysql/
/*function sendEmail(email, token) {
  var email = email;
  var token = token;
  var mail = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'diabeasy.noreply@gmail.com', // Your email id
          pass: 'dvnayxucnchhruyu' // Your password
      }
  });
  var mailOptions = {
      from: 'diabeasy.noreply@gmail.com',
      to: email,
      subject: 'Password Reset Link - Diabeasy',
      html: '<p>You requested for reset password, kindly use this <a href="http://localhost:3000/reset-password?token=' + token + '">link</a> to reset your password</p>'
  };
  mail.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.log(1)
      } else {
          console.log(0)
      }
  });
}*/

exports.connectDB = connectDB;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.recoverAccount = recoverAccount;
exports.loginUser = loginUser;
exports.resetPassword = resetPassword;
exports.uploadFile = uploadFile;
exports.fetchData = fetchData;