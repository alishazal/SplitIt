const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, 
    username: { type: String, required: true, unique: true },
    password: { type: String}
});

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    totalAmount: { type: Number, min: 0.01, required: true },
    paidBy: { type: String, required: true },
    splitBetween: { type: Array, required: true },
    createdAt: { type: Date, required: true },
});

const friendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, 
});

userSchema.plugin(passportLocalMongoose);

mongoose.model("User", userSchema);
mongoose.model("Expense", expenseSchema);
mongoose.model("Friend", friendSchema);

mongoose.connect("mongodb://localhost/finalProject", { useNewUrlParser: true });