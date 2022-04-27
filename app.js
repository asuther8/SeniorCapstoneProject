// app.js

const express = require('express');
const session = require('express-session');
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
app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
app.use(express.static(__dirname + '/client/src'));


// Homepage: Login page if no session, else redirect to user's dashboard
app.get('/',(req,res) => {
    sess = req.session;
    console.log("app.get /");
    res.redirect("https://www.google.com");
    if(sess.email) {
        return res.redirect('/admin');
    }
    res.sendFile('index.html');
});

app.get('/admin',(req,res) => {
    console.log("at /admin");
    res.send("hello");
    sess = req.session;
    if(sess.email) {
        return res.redirect('/');
    }
    //res.sendFile(__dirname + "/client/src/components/user/login.js");
});


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
        sess = req.session;
        sess.email = req.body.email;
        console.log(result);
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