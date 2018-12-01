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
const Friend = mongoose.model('Friend');
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
    
    if (req.isAuthenticated()){
        Expense.find({user: req.user._id}, (err, expenses) => {
            if (err) {
                console.log(err); 
                return res.render('index', { message: err });
            }
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

    Friend.find({ user: req.user._id }, (err, friends) => {
        if (err) {
            console.log(err);
            return res.render('add-bill', { message: err });
        }
        else if (friends.length > 0){
            return res.render("add-bill", { friends: friends });
        }
        else{
            return res.render("add-bill");
        }
    });
});

app.post('/home/addBill', isLoggedIn, (req, res) => {

    let splitCalc = [];
    if (typeof req.body.splitBetween === "string"){
        const splitAmount = (req.body.totalAmount / 2);
        const tempObj = {};
        const tempStr = req.body.splitBetween.replace(/\./g, '\\uff0e');
        tempObj[tempStr] = splitAmount;
        splitCalc.push(tempObj);
    }
    else{
        const temp = req.body.splitBetween.map(ele =>{
            return ele.replace(/\./g, '\\uff0e');
        });

        const splitAmount = (req.body.totalAmount / (req.body.splitBetween.length + 1));
        splitCalc = temp.map(ele => {
            const tempObj = {};
            tempObj[`${ele}`] = splitAmount;
            return tempObj;
        });
    }

    req.body.paidBy = req.user.email;
    const newBill = {
        user: req.user._id,
        description: req.body.description,
        totalAmount: req.body.totalAmount,
        paidBy: req.body.paidBy,
        splitBetween: req.body.splitBetween,
        splitCalc: splitCalc,
        notes: req.body.notes,
    };

    new Expense(newBill).save((err) => {
        if (err){
            console.log(err);
            return res.render('add-bill', { message: err });
        }
        else{
            Expense.find({ user: req.user._id }, (err, expense) => {
                if (err) {
                    console.log(err);
                    return res.render('add-bill', { message: err });
                }
                else {
                    const allCalcs = [];
                    const allCalcsObj = {};
                    expense.forEach(element => {
                        element.splitCalc.forEach(ele => {
                            allCalcs.push(ele);
                        });
                    });
                    allCalcs.forEach(ele => {
                        const key = Object.keys(ele)[0];
                        if (!(allCalcsObj[key])){
                            allCalcsObj[key] = [];
                            allCalcsObj[key].push(ele[key]);
                        }
                        else{
                            allCalcsObj[key].push(ele[key]);
                        }
                    });
                    
                    const frens = Object.keys(allCalcsObj);
                    frens.forEach(frand => {
                        allCalcsObj[frand] = allCalcsObj[frand].reduce((accumulator, currentValue) => 
                        accumulator + currentValue
                        );
                    });
                    
                    const placeholder = {};
                    placeholder['calc'] = allCalcsObj;
                    User.findOneAndUpdate({ _id: req.user._id }, { $set: placeholder }, (err) => {
                        if (err) {
                            console.log(err);
                            return res.render('add-bill', { message: err });
                        }
                        else{
                            res.redirect("/");
                        }
                    });
                }
            });
        }
    });
});

// Copied isEmpty function from following url:
// https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
function isEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)){
            return false;
        }
    }
    return true;
}

app.get('/home/balance', isLoggedIn, (req, res) => {
    
    User.find({_id: req.user._id}, (err, user) => {
        if (err){
            console.log(err);
            return res.render('balance', {message: err});
        }
        else if (isEmpty(user[0].calc)){
            res.render('balance');
        }

        else{
            const oldKeys = Object.keys(user[0].calc);
            const temp = oldKeys.map(ele => {
                return ele.replace(/\\uff0e/g, '.');
            });

            let counter = 0;
            const finalBalance = temp.map(ele => {
                const tempObj = {};
                tempObj.email = ele;
                tempObj.balance = user[0].calc[oldKeys[counter]].toFixed(2);
                counter += 1;
                return tempObj;
            });
          
            res.render('balance', {finalBalance: finalBalance});
        }  
    });
});

app.get('/home/settle', isLoggedIn, (req, res) => {

    Friend.find({ user: req.user._id }, (err, friends) => {
        if (err) {
            console.log(err);
            return res.render('settle', { message: err });
        }
        else if (friends.length > 0) {
            Expense.find({ user: req.user._id }, (err, expenses) => {
                if (err) {
                    console.log(err);
                    return res.render('/home/settle', { message: err });
                }
                else if (expenses.length > 0){
                    if (req.query.greater) {
                        return res.render("settle", { friends: friends, message: "Amount greater than what's owed" });
                    }
                    else{
                        return res.render("settle", { friends: friends });
                    }
                }
                else{
                    return res.render("settle");
                }
            });
        }
        else {
            return res.render("settle");
        }
    });
});

app.post('/home/settle', isLoggedIn, (req, res) => {

    req.body.payer = req.body.payer.replace(/\./g, '\\uff0e');

    User.find({_id: req.user._id}, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("settle", {message: err});
        }
        else{
            const value = user[0].calc[req.body.payer].toFixed(2);
            const afterSettle = value - req.body.settleAmount;
            if (afterSettle < 0){
                return res.redirect("/home/settle?greater=true");
            }
            else{
                const placeholder = {};
                placeholder['calc.' + req.body.payer] = afterSettle;
                User.findOneAndUpdate({ _id: req.user._id }, { $set: placeholder }, (err) => {
                    if (err) {
                        console.log(err);
                        return res.render("settle", { message: err });
                    }
                    else{
                        res.redirect('/home/balance');
                    }
                });
            }
        }
    });
});

app.get('/home/addFriend', isLoggedIn, (req, res) => {
    res.render('add-friend');
});

app.post('/home/addFriend', isLoggedIn, (req, res) => {

    const newFriend = {
        user: req.user._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    req.body.email = req.body.email.replace(/\./g, '\\uff0e');
    const key = `${req.body.email}`;
    const value = 0;
    const placeholder = {};
    placeholder['calc.'+key] = value;

    User.findOneAndUpdate({ _id: req.user._id }, { $set: placeholder}, (err)=>{
        if (err){
            console.log(err);
            return res.render('add-friend', { message: err });
        }
    });

    new Friend(newFriend).save((err) => {
        if (err) {
            console.log(err);
            return res.render('add-friend', { message: err });
        }
        else {
            res.redirect("friends");
        }
    });
});

app.get('/home/friends', isLoggedIn, (req, res) => {
    
    Friend.find({ user: req.user._id }, (err, friends) => {
        if (err) {
            console.log(err); 
            return res.render('friends', { message: err });
            }
        else {
            res.render("friends", { friends: friends });
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register');
}); 

app.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        calc: {}
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