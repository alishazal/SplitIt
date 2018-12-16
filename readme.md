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
    hash: "74cca9cb59250c50cfb4ff39e75406219250c50cfb4ff39",
    calc: {{"Sam": 10}, {"Joe": 10}}
}
```

An example expense:

This will have a reference to the user who created the expense, its description, total amount in dollars, if the user paid for it, how many people it was split between, among whom it was split and at what date/time it was created.

```javascript
{
    user: // a reference to a User object
    description: "Chipotle on Nov 7, 2018",
    totalAmount: 30,
    paidBy: "Ali",
    splitBetween: ["Joe", "Sam"],
    notes: "Just transfer the money online in my account",
    splitCalc: [{"Joe": 10}, {"Sam": 10}],
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

* Unit Testing using Mocha
    * I will write unit tests to check the back-end logic.
    * The most popular framework in this regards is Mocha.
