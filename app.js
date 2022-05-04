// app.js

const express = require('express');
const session = require('express-session');
const db = require('./config/db');
//const User = require('./models/User');
const passwordReset = require("./routes/api/passwordReset");
const users = require("./routes/api/user");
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
app.use("/api/users", users);
app.use("/api/password-reset", passwordReset);

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
        res.send(result);
    })
});

// Recovery: user attempting to reset a forgotten password, send email to them
app.post('/recovery', (req, res) => {
    console.log("\nUser attempting password recovery");
    console.log(JSON.stringify(req.body));
    var ret = db.recoverAccount(JSON.stringify(req.body));
    ret.then(result => {
        res.send(result);
    })
});

// Recovery2: user changes their password
app.post('/password-reset', (req, res) => {
    //Req query referenced from: https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters
    console.log("\nUser attempting password reset");
    console.log(JSON.stringify(req.body));
    var ret = db.resetPassword(JSON.stringify(req.body));
    ret.then(result => {
        res.send(result);
    })
});

// Upload: try to upload a file to the user's uploads
app.post('/upload', (req, res) => {
    console.log("\nAttempting to upload file");
    console.log(JSON.stringify(req.body));
    var ret = db.uploadFile(JSON.stringify(req.body));
    ret.then(result => {
        sess = req.session;
        sess.email = req.body.email;
        res.send(result);
    })
});

const port = process.env.PORT || 8082;

/*
// update password to database, referenced from: https://www.tutsmake.com/forgot-reset-password-in-node-js-express-mysql/
app.post('/update-password', function(req, res, next) {
    var token = req.body.token;
    var password = req.body.password;
   connection.query('SELECT * FROM users WHERE token ="' + token + '"', function(err, result) {
        if (err) throw err;
        var type
        var msg
        if (result.length > 0) {
              var saltRounds = 10;
             // var hash = bcrypt.hash(password, saltRounds);
            bcrypt.genSalt(saltRounds, function(err, salt) {
                  bcrypt.hash(password, salt, function(err, hash) {
                   var data = {
                        password: hash
                    }
                    connection.query('UPDATE users SET ? WHERE email ="' + result[0].email + '"', data, function(err, result) {
                        if(err) throw err
                    });
                  });
              });
            type = 'success';
            msg = 'Your password has been updated successfully';
        } else {
            console.log('2');
            type = 'success';
            msg = 'Invalid link; please try again';
            }
        req.flash(type, msg);
        res.redirect('/');
    });
});*/

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));