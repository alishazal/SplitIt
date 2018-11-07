require('./db');

// enable express
const express = require("express");
const app = express();

// enable body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// enable static files
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// db
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Expense = mongoose.model('Expense');


// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

// view template
app.set('view engine', 'hbs');

// homepage
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000);