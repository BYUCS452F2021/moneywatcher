const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');
const cors = require("cors");
const { response } = require('express');

var db = mongoose.connection;

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

const expenseSchema = new mongoose.Schema({
    description: String,
    day: Number,
    amount: Number,
    vendor: String,
    categoryID: mongoose.ObjectId,
  });

budgetSchema.virtual('categoryID')
  .get(function() {
    return this._id.toHexString();
  });

  budgetSchema.set('toJSON', {
  virtuals: true
});

const Budget = mongoose.model('Budget', budgetSchema);
const Expense = mongoose.model('Expense', expenseSchema);

app.get('/budget/read_all', async (req, res) => {
  try {
    let results = await Budget.find();
    //console.log(results);
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

/**
 * Create a row in the expenses table.
 *
 * @apiParam (Request body) {String} day The date the expense was incurred
 * @apiParam (Request body) {number} categoryID The id of the corresponding category
 * @apiParam (Request body) {number} amount The expenses amount
 * @apiParam (Request body) {String} vendor The name of the vendor
 * @apiParam (Request body) {String} description A description of the expense
 *
 * @apiReturn (Result body) {number} expenseID The id of the newly created expense
 */
 app.post('/expenses/create', async (req, res) => {
    // Verify request format
    const expense = new Expense ({
        description: req.body.description,
        day: req.body.day,
        amount: req.body.amount,
        categoryID: req.body.categoryID,
        vendor: req.body.vendor,
    });

    try {
        await expense.save();
        res.send(expense);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Read a row in the expenses table.
 *
 * @apiParam (Request body) {number} expenseID The id of the row to return
 */
 app.post('/expenses/read', async (req, res) => {
    let id = req.body.expenseID;
    try {
        const expense = await Expense.find({ _id: id });
        res.send(expense);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Read all rows in the expenses table.
 */
 app.get('/expenses/read_all', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.send(expenses);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Read all rows in the expenses table.
 */
 app.post('/expenses/read_all_names', async (req, res) => {
    try {
        var expenses = await db.collection('expenses').aggregate([
            {$lookup:
                {
                    from: 'budgets',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'budget'
                }
                    
            }
        ]).toArray();
        res.send(expenses);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Read all rows in the expenses table, sorted by date.
 */
 app.post('/expenses/read_all_names_by_date', async (req, res) => {
    let month = req.body.month;
    let year = req.body.year.toString();
   
    try {
        var expenses = await db.collection('expenses').aggregate([
            {$lookup:
                {
                    from: 'budgets',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'budget'
                }
                    
            }
        ]).toArray();
        var indexArray = [];

        for (var i = expenses.length - 1; i >= 0; --i) {
            var expenseDate = new Date(expenses[i].day);

            var expenseMonth = (expenseDate.getMonth() + 1).toString();
            var expenseYear = expenseDate.getFullYear().toString();
            
            if (month != "NaN" && month != null) {
                if (expenseMonth != month || expenseYear != year) {
                    indexArray.push(i);
                }
            }
            else {
                if (expenseYear != year) {
                    indexArray.push(i);
                }
            }
            
        }

        while (indexArray.length > 0) {
            expenses.splice(indexArray[0], 1);
            indexArray.splice(0, 1);
        }

        res.send(expenses);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Update a row in the expenses table.
 *
 * @apiParam (Request body) {number} expenseID The expenseID of the row to update
 * @apiParam (Request body) {String} day The date the expense was incurred
 * @apiParam (Request body) {number} categoryID The id of the corresponding category
 * @apiParam (Request body) {float} amount The expenses amount
 * @apiParam (Request body) {number} vendorID The id of the corresponding vendor
 * @apiParam (Request body) {String} description A description of the expense
 *
 */
 app.post('/expenses/update', async (req, res) => {
    // Verify request format
   let expenseID = req.body.expenseID;
   let day = req.body.name;
   let categoryID = req.body.categoryID;
   let amount = req.body.amount;
   let vendorID = req.body.vendorID;
   let description = req.body.description;

   if (expenseID === null ||
       day === null ||
       categoryID === null||
       amount === null ||
       vendorID === null ||
       description === null ||
       typeof expenseID !== "number" ||
       typeof day !== "string" ||
       typeof categoryID !== "number" ||
       typeof amount !== "number" ||
       typeof vendorID !== "number" ||
       typeof description !== "string"
   ) {
       res.status(400).json({error: "Invalid request body"});
       return;
   }

   let sql = `UPDATE expenses SET day = ?, categoryID = ?, amount = ?, vendorID = ?, description = ? WHERE expenseID = ?`;
   db.run(sql, [day, categoryID, amount, vendorID, description, expenseID], function(err) {
       if (err) {
           console.error(err);
           res.status(500).json({message: "Error updating expenses table in database"});
       }
       console.log(`Row(s) updated: ${this.changes}`);
       res.status(200).json({message: "Updated succesfully"});
     });
});

/**
* Delete a row in the expenses table.
*
* @apiParam (Request body) {number} expenseID The expense ID of the row to delete
*/
app.post('/expenses/delete', async (req, res) => {
   try {
    await Expense.deleteOne({
      id: req.body.expenseID
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    }
});

app.listen(5000, () => console.log('Server listening on port 5000!'));
