// app.js

const express = require('express');
const connectDB = require('./config/db');
const user = require('./routes/api/user');

const app = express();

connectDB();

//app.get('/', (req, res) => res.send('Landing Page'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use('/', user);