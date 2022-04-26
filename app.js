// app.js

const express = require('express');
const db = require('./config/db');
const User = require('./models/User');
const cors = require('cors');
const bodyParser = require("body-parser");
const router = express.Router();

const app = express();

app.use(cors());

db.connectDB();

app.get('/', (req, res) => res.send('Landing Page'));

// Setup bodyParser for parsing JSON requests
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Register: try to add a new user to the database
app.post('/register', (req, res) => {
    console.log("\nAttempting to register new user");
    console.log(JSON.stringify(req.body));
    var ret = db.addUser(JSON.stringify(req.body));
    ret.then(result => {
        res.send(result);
    })
});

// Login: try to login an existing user in the database
app.post('/login', (req, res) => {
    console.log("\nAttempting to login user");
    console.log(JSON.stringify(req.body));
    var ret = db.loginUser(JSON.stringify(req.body));
    ret.then(result => {
        res.send(result);
    })
});

// Recovery: user attempting to retrieve a forgotten password
app.post('/recovery', (req, res) => {
    console.log("\nUser attempting password recovery");
    console.log(JSON.stringify(req.body));
    var ret = db.recoverAccount(JSON.stringify(req.body));
    ret.then(result => {
        res.send(result);
    })
});

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));