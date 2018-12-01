const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, 
    username: { type: String, required: true, unique: true },
    password: { type: String},
    calc: { type: Object, required: true}
}, { minimize: false });

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    totalAmount: { type: Number, min: 0.01, required: true },
    paidBy: { type: String, required: true },
    splitBetween: { type: Array, required: true },
    notes: { type: String},
    splitCalc: { type: Array, require: true}
}, { timestamps: { createdAt: 'created_at'} }
);

const friendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},

});

userSchema.plugin(passportLocalMongoose);

mongoose.model("User", userSchema);
mongoose.model("Expense", expenseSchema);
mongoose.model("Friend", friendSchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/finalProject';
}


mongoose.connect(dbconf, { useNewUrlParser: true });