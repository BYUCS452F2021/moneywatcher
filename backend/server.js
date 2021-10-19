const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require("cors");

// Set up express
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json());
var corsOptions = {
    origin: "http://localhost:5000"
};
app.use(cors());

// Set up the database
let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});
// Uncomment this line to create the table

// Create the expenses table if it doesn't already exist
db.run(`CREATE TABLE IF NOT EXISTS budget(
    categoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(255),
    Amount DOUBLE)`);
db.run(`CREATE TABLE IF NOT EXISTS vendor(
    vendorID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(255),
    Description VARCHAR(255))`);
db.run(`CREATE TABLE IF NOT EXISTS expenses(
    expenseID INTEGER PRIMARY KEY AUTOINCREMENT,
    Day VARCHAR(255),
    categoryID NUMBER,
    Amount DOUBLE,
    vendorID NUMBER,
    Description VARCHAR(255),
    FOREIGN KEY(categoryID) REFERENCES budget(categoryID),
    FOREIGN KEY(vendorID) REFERENCES vendors(vendorID)
    )`);

/**
 * Create a row in the budget table.
 *
 * @apiParam (Request body) {String} name The category name
 * @apiParam (Request body) {float} amount The budget amount
 *
 * @apiReturn (Result body) {number} categoryID The id of the newly created category
 */
app.post('/budget/create', (req, res) => {
    // Verify request format
    let name = req.body.name;
    let amount = req.body.amount;
    if (name === null ||
        amount === null ||
        typeof name !== "string" ||
        typeof amount !== "number"
    ) {
        console.log(name, typeof name, amount, typeof amount);
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    let sql = `INSERT INTO budget(name, amount) VALUES(?, ?)`;
    let stmt = db.prepare(sql);
    stmt.run([name, amount], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error adding to budget table in database"});
        } else {
            res.status(200).json({categoryID: this.lastID});
        }
    });
});

/**
 * Read a row in the budget table.
 *
 * @apiParam (Request body) {number} categoryID The category ID of the row to return
 */
 app.post('/budget/read', (req, res) => {
     // Verify request format
    let categoryID = req.body.categoryID;
    if (categoryID === null ||
        typeof categoryID !== "number"
    ) {
        console.log(categoryID, typeof categoryID);
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    // Execute the query
    let sql = `SELECT * FROM budget WHERE CategoryId = ?`;
    db.get(sql, [categoryID], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error reading from budget table in database"});
        } else {
            row == undefined
                ? console.log(`No category found with the id ${categoryID}`)
                : console.log(`Returned budget with categoryId ${categoryID}`);
            res.status(200).json({result: row});
        }
      });

});

/**
 * Read all rows row in the budget table.
 */
 app.get('/budget/read_all', (req, res) => {
    // (No need to verify request)

    // Execute the query
    let sql = `SELECT * FROM budget`;
    db.all(sql, [], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error reading all from budget table in database"});
        } else {
            data == undefined
                ? console.log(`No data found in the budget table`)
                : console.log(`Returned entire budget table`);
            res.status(200).json({result: data});
            }
        });

});

/**
 * Update a row in the budget table.
 *
 * @apiParam (Request body) {number} categoryID The category ID of the row to update
 * @apiParam (Request body) {String} name The category name
 * @apiParam (Request body) {float} amount The budget amount
 */
 app.post('/budget/update', (req, res) => {
     // Verify request format
    let categoryID = req.body.categoryID;
    let name = req.body.name;
    let amount = req.body.amount;
    if (categoryID === null ||
        name === null ||
        amount === null ||
        typeof categoryID !== "number" ||
        typeof name !== "string" ||
        typeof amount !== "number"
    ) {
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    let sql = `UPDATE budget SET name = ?, amount = ? WHERE categoryID = ?`;
    db.run(sql, [name, amount, categoryID], function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error updating budget table in database"});
        }
        console.log(`Row(s) updated: ${this.changes}`);
        res.status(200).json({message: "Updated succesfully"});
      });
});

/**
 * Delete a row in the budget table.
 *
 * @apiParam (Request body) {number} categoryID The category ID of the row to delete
 */
 app.post('/budget/delete', (req, res) => {
     // Verify request format
    let categoryID = req.body.categoryID;
    if (categoryID === null ||
        typeof categoryID !== "number"
    ) {
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    let sql = `DELETE FROM budget WHERE categoryID = ?`;
    db.run(sql, [categoryID], function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error deleting from budget table in database"});
        }
        res.status(200).json({message: "Deleted succesfully"});
      });
});

/**
 * Create a row in the vendor table.
 *
 * @apiParam (Request body) {String} name The vendor name
 * @apiParam (Request body) {String} description The vendor description
 *
 * @apiReturn (Result body) {number} vendorID The id of the newly created vendor
 */
app.post('/vendor/create', (req, res) => {
  // Verify request format
  let name = req.body.name;
  let description = req.body.description;
  if (name === null ||
      description === null ||
      typeof name !== "string" ||
      typeof description !== "string"
  ) {
      res.status(400).json({error: "Invalid request body"});
      return;
  }

  let sql = `INSERT INTO vendor(name, description) VALUES(?, ?)`;
  let stmt = db.prepare(sql);
  stmt.run([name, description], function (err) {
      if (err) {
          console.error(err);
          res.status(500).json({message: "Error adding to vendor table in database"});
      } else {
          res.status(200).json({vendorID: this.lastID});
      }
  });
});

/**
 * Read a row in the vendor table.
 *
 * @apiParam (Request body) {number} vendorID The vendor ID of the row to return
 */
app.post('/vendor/read', (req, res) => {
  // Verify request format
 let vendorID = req.body.vendorID;
 if (vendorID === null ||
     typeof vendorID !== "number"
 ) {
     res.status(400).json({error: "Invalid request body"});
     return;
 }

 // Execute the query
 let sql = `SELECT * FROM vendor WHERE vendorID = ?`;
 db.get(sql, [vendorID], (err, row) => {
     if (err) {
         console.error(err);
         res.status(500).json({message: "Error reading from vendor table in database"});
     } else {
         row == undefined
             ? console.log(`No vendor found with the id ${vendorID}`)
             : console.log(`Returned vendor with vendorID ${vendorID}`);
         res.status(200).json({result: row});
     }
   });
});

/**
 * Read all rows row in the vendor table.
 */
app.get('/vendor/read_all', (req, res) => {
  // (No need to verify request)

  // Execute the query
  let sql = `SELECT * FROM vendor`;
  db.all(sql, [], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({message: "Error reading all from vendor table in database"});
    } else {
      data == undefined
        ? console.log(`No data found in the vendor table`)
        : console.log(`Returned entire vendor table`);
      res.status(200).json({result: data});
    }
  });
});

/**
 * Update a row in the vendor table.
 *
 * @apiParam (Request body) {number} vendorID The vendor ID of the row to update
 * @apiParam (Request body) {String} name The vendor name
 * @apiParam (Request body) {String} description The vendor description
 */
app.post('/vendor/update', (req, res) => {
  // Verify request format
 let vendorID = req.body.vendorID;
 let name = req.body.name;
 let description = req.body.description;
 if (vendorID === null ||
     name === null ||
     description === null ||
     typeof vendorID !== "number" ||
     typeof name !== "string" ||
     typeof description !== "string"
 ) {
     res.status(400).json({error: "Invalid request body"});
     return;
 }

 let sql = `UPDATE vendor SET name = ?, description = ? WHERE vendorID = ?`;
 db.run(sql, [name, description, vendorID], function(err) {
     if (err) {
         console.error(err);
         res.status(500).json({message: "Error updating vendor table in database"});
     }
     console.log(`Row(s) updated: ${this.changes}`);
     res.status(200).json({message: "Updated succesfully"});
   });
});

/**
 * Delete a row in the vendor table.
 *
 * @apiParam (Request body) {number} vendorID The vendor ID of the row to delete
 */
app.post('/vendor/delete', (req, res) => {
  // Verify request format
 let vendorID = req.body.vendorID;
 if (vendorID === null ||
     typeof vendorID !== "number"
 ) {
     res.status(400).json({error: "Invalid request body"});
     return;
 }

 let sql = `DELETE FROM vendor WHERE vendorID = ?`;
 db.run(sql, [vendorID], function(err) {
     if (err) {
         console.error(err);
         res.status(500).json({message: "Error deleting from vendor table in database"});
     }
     res.status(200).json({message: "Deleted succesfully"});
   });
});

/**
 * Create a row in the expenses table.
 *
 * @apiParam (Request body) {String} day The date the expense was incurred
 * @apiParam (Request body) {number} categoryID The id of the corresponding category
 * @apiParam (Request body) {float} amount The expenses amount
 * @apiParam (Request body) {number} vendorID The id of the corresponding vendor
 * @apiParam (Request body) {String} description A description of the expense
 *
 * @apiReturn (Result body) {number} expenseID The id of the newly created expense
 */
 app.post('/expenses/create', (req, res) => {
    // Verify request format
    let day = req.body.day;
    let categoryID = req.body.categoryID;
    let amount = req.body.amount;
    let vendorID = req.body.vendorID;
    let description = req.body.description;

    if (day === null ||
        categoryID === null||
        amount === null ||
        vendorID === null ||
        description === null ||
        typeof day !== "string" ||
        typeof categoryID !== "number" ||
        typeof amount !== "number" ||
        typeof vendorID !== "number" ||
        typeof description !== "string"
    ) {
        console.log(day, typeof day, categoryID, typeof categoryID, amount, typeof amount,
             vendorID, typeof vendorID, description, typeof description);
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    let sql = `INSERT INTO expenses(day, categoryID, amount, vendorID, description) VALUES(?, ?, ?, ?, ?)`;
    let stmt = db.prepare(sql);
    stmt.run([day, categoryID, amount, vendorID, description], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error adding to expenses table in database"});
        } else {
            res.status(200).json({expenseID: this.lastID});
        }
    });
});

/**
 * Read a row in the expenses table.
 *
 * @apiParam (Request body) {number} expenseID The id of the row to return
 */
 app.post('/expenses/read', (req, res) => {
     // Verify request format
    let expenseID = req.body.expenseID;
    if (expenseID === null ||
        typeof expenseID !== "number"
    ) {
        console.log(expenseID, typeof expenseID);
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    // Execute the query
    let sql = `SELECT * FROM expenses WHERE ExpenseID = ?`;
    db.get(sql, [expenseID], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error reading from expenses table in database"});
        } else {
            row == undefined
                ? console.log(`No expense found with the id ${expenseID}`)
                : console.log(`Returned expenses with expenseID ${expenseID}`);
            res.status(200).json({result: row});
        }
      });

});

/**
 * Read all rows row in the expenses table.
 */
 app.post('/expenses/read_all', (req, res) => {
    // (No need to verify request)

    // Execute the query
    let sql = `SELECT * FROM expenses`;
    db.all(sql, [], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error reading all from expenses table in database"});
        } else {
            data == undefined
                ? console.log(`No data found in the expenses table`)
                : console.log(`Returned entire expenses table`);
            res.status(200).json({result: data});
            }
        });

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
 app.post('/expenses/update', (req, res) => {
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
 app.post('/expenses/delete', (req, res) => {
     // Verify request format
    let expenseID = req.body.expenseID;
    if (expenseID === null ||
        typeof expenseID !== "number"
    ) {
        res.status(400).json({error: "Invalid request body"});
        return;
    }

    let sql = `DELETE FROM expenses WHERE expenseID = ?`;
    db.run(sql, [expenseID], function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({message: "Error deleting from expenses table in database"});
        }
        res.status(200).json({message: "Deleted succesfully"});
      });
});

// Start the server
app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
