require('./db');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Expense = mongoose.model('Expense');
const session = require('express-session');
const sessionOptions = {
    secret: 'secret',
    resave: true,
    saveUninitialized: true
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use(session(sessionOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// homepage
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/home/addExpense', (req, res) => {
    res.render('addExpense');
});

app.get('/home/balance', (req, res) => {
    res.render('index');
});

app.get('/home/settle', (req, res) => {
    res.render('index');
});

app.get('/home/addFriend', (req, res) => {
    res.render('addExpense');
});

app.get('/home/friends', (req, res) => {
    res.render('addExpense');
});

app.get('*', function (req, res) {
    res.render("404page");
});

app.listen(3000);