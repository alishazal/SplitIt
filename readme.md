# SplitIt

## Overview

Splitting food and grocery bills get complicated when you're in college and hanging out with the same group of friends. Its a hassle to keep a track of who owes whom and how much, specially when the number of bills starts increasing. And that is why we have SplitIt!

SplitIt is a web app that records all your bills and allows you to keep a track of shared expenses so that you get paid the right amount! Users can register and log in. Once they're logged in, they can create, view and get a summary of all expenses. They can also settle up expenses and remind friends about pending payments.

## Data Model
The application will store Users, Expenses and Friends. Users can have multiple Expenses and Friends, both via references.

An example user:

This will contain the username, password, email, and full name of the user.

```javascript
{
    firstName: "Ali",
    lastName: "Shazal",
    email: "as10505@nyu.edu",
    username: "alishazal",
    salt: "c50cfb4ff39e7",
    hash: "74cca9cb59250c50cfb4ff39e75406219250c50cfb4ff39"
}
```

An example expense:

This will have a reference to the user who created the expense, its description, total amount in dollars, if the user paid for it, how many people it was split between, among whom it was split and at what date/time it was created.

```javascript
{
    user: // a reference to a User object
    description: "Chipotle on Nov 7, 2018",
    totalAmount: 13.75,
    paidBy: "Ali",
    splitBetween: ["Joe", "Sam"],
    notes: "Just transfer the money online in my account",
    createdAt: // timestamp
}
```

An example friend:

This will have a reference to the user who created it, full name and email address.

```javascript
{
    user: // a reference to a User object
    firstName: "Joe",
    lastName: "Versoza",
    email: "jversoza@nyu.edu",
}
```

## [Link to Commented First Draft Schema](src/db.js) 

## Wireframes

/login and /register - Pages for login and sign up

![login](documentation/login.jpeg)

/home - Page for showing all expenses associated to an account

![home](documentation/home.jpeg)

/home/addBill - Page for adding an expense using a form

![add](documentation/add.jpeg)

/home/balance - Page for showing balance between each friend

![balance](documentation/balance.jpeg)

/home/settle

![settle](documentation/settle.jpeg)

## Site map

![sitemap](documentation/sitemap.png)

## User Stories

1. As non-registered user, I can only register a new account with the site.
2. As a registered user, I can log in to the site
3. As an authenticated user, I can:
    * create a new expense
    * edit existing expenses.
    * delete existing expenses.
    * view all of the expenses I've created in a single list
    * view a summary of balances
    * settle up
    * log out

## Research Topics

* (6 points) User authentication using PassportJS
    * Only authenticated users will be able to use my app.
    * I will use PassportJS for this.
    * Passport is very simple and easy to use, which is great since I only have 3 weeks for my project.
    * It can easily be integrated with Express. 
    * I'll also have the option to intergrate 3rd party authentication (via Facebook, Google, etc).

* (2 points) Unit Testing using Mocha/Chai
    * I will write unit tests to check the back-end logic.
    * The most popular frameworks in this regards are Mocha and Chai.
    * In class, we've been using these frameworks from assignment, so I want to learn them by implementing them myself.

**8 points total out of 8 required points** 


## [Link to Initial Main Project File](src/app.js) 

## Annotations / References Used
None as of Milestone 1.

Milestone 2: [Udemy Tutorial](https://www.udemy.com/the-web-developer-bootcamp/) for passport authentication.
