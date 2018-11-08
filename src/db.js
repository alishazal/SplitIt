const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }]
});

const Expense = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    totalAmount: { type: Number, min: 0.01, required: true },
    iPaid: { type: Boolean, required: true },
    splitWays: { type: Number, min: 1, required: true },
    splitBetween: { type: Array, required: true },
    createdAt: { type: Date, required: true },
});

mongoose.model("User", User);
mongoose.model("Expense", Expense);

mongoose.connect("mongodb://localhost/finalProject", { useNewUrlParser: true });