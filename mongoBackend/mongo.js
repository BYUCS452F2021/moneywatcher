const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');
const cors = require("cors");

var corsOptions = {
    origin: "http://localhost:5000"
};
app.use(cors());

// connect to the database
mongoose.connect('mongodb://localhost:27017/moneywatcher', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const budgetSchema = new mongoose.Schema({
  Name: String,
  Amount: Number,
});

budgetSchema.virtual('categoryID')
  .get(function() {
    return this._id.toHexString();
  });

  budgetSchema.set('toJSON', {
  virtuals: true
});

const Budget = mongoose.model('Budget', budgetSchema);

app.get('/budget/read_all', async (req, res) => {
  try {
    let results = await Budget.find();
    console.log(results);
    res.send({result: results});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
/*
 app.post('/budget/read', (req, res) => {
     try {
       let results = await Budget.findOne({
           id: req.body.categoryID
       });
       console.log(results);
       res.send({result: results});
     } catch (error) {
       console.log(error);
       res.sendStatus(500);
     }
 });*/

app.post('/budget/create', async (req, res) => {
    const budget = new Budget({
    Name: req.body.name,
    Amount: req.body.amount
  });
  try {
    await budget.save();
    res.send({budget:budget});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/budget/delete', async (req, res) => {
  try {
    await Budget.deleteOne({
      id: req.body.categoryID
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
/*
app.post('/budget/update', (req, res) => {
    const options = { upsert: true };
    let oldItem = {id: req.body.categoryID};
    let newItem = { $set: {Name: req.body.name, Amount: req.body.amount } };
    try {
      await Budget.updateOne(oldItem, newItem, options);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});*/

app.listen(5000, () => console.log('Server listening on port 5000!'));
