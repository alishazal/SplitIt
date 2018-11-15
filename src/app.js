require('./db');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = mongoose.model('User');
const Expense = mongoose.model('Expense');
const Friend = mongoose.model('Expense');
const session = require('express-session');
const sessionOptions = {
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    console.log(req.user);
    res.render('index');
});

app.get('/home/addBill', isLoggedIn, (req, res) => {
    res.render('add-bill');
});

app.get('/home/balance', isLoggedIn, (req, res) => {
    res.render('balance');
});

app.get('/home/settle', isLoggedIn, (req, res) => {
    res.render('settle');
});

app.get('/home/addFriend', isLoggedIn, (req, res) => {
    res.render('addFriend');
});

app.get('/home/friends', isLoggedIn, (req, res) => {
    res.render('friends');
});

app.get('/register', (req, res) => {
    res.render('register');
}); 

app.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    User.register(newUser, req.body.password, (err, user) => {
        if (err){
            console.log(err);
            return res.render('register', {message: err});
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/home');
        });
    });
}); 

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
    })
);

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/home");
});

app.get('*', function (req, res) {
    res.render("404page");
});

app.listen(3000);