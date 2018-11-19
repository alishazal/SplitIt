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
    
    // console.log(req.user);
    if (req.isAuthenticated()){
        Expense.find({user: req.user._id}, (err, expenses) => {
            if (err) { console.log(err); }
            else {
                res.render("index", { expenses: expenses });
            }
        });
    }
    else{
        res.render("index");
    }
    
});

app.get('/home/addBill', isLoggedIn, (req, res) => {
    res.render('add-bill');
});

app.post('/home/addBill', isLoggedIn, (req, res) => {
    
    // Logic to ensure there's no duplicate email
    // const split = req.body.splitBetween.split(",");
    // if (split.indexOf(req.body.paidBy) !== -1){
    //     console.log(req.body.paidBy);
    //     console.log(split.remove(req.body.paidBy));
    //     console.log(split);
    // }

    const newBill = {
        user: req.user._id,
        description: req.body.description,
        totalAmount: req.body.totalAmount,
        paidBy: req.body.paidBy,
        splitBetween: req.body.splitBetween,
        notes: req.body.notes,
        // createdAt: write something here
    };

    new Expense(newBill).save((err) => {
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    });

});

app.get('/home/balance', isLoggedIn, (req, res) => {
    res.render('balance');
});

app.get('/home/settle', isLoggedIn, (req, res) => {
    res.render('settle');
});

app.get('/home/addFriend', isLoggedIn, (req, res) => {
    res.render('add-friend');
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

app.listen(process.env.PORT || 3000);