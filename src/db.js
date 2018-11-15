const mongoose = require('mongoose');

const User = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, 
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

const Expense = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    totalAmount: { type: Number, min: 0.01, required: true },
    paidBy: { type: String, required: true },
    splitBetween: { type: Array, required: true },
    createdAt: { type: Date, required: true },
});

const Friend = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, 
});

mongoose.model("User", User);
mongoose.model("Expense", Expense);
mongoose.model("Friend", Expense);

mongoose.connect("mongodb://localhost/finalProject", { useNewUrlParser: true });