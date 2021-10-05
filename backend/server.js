const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Set up express
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json());

// Set up the database
let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});
// Uncomment this line to create the table
// db.run('CREATE TABLE budget(categoryID numbereger primary key autoincrement, Name varchar(255), Amount double);');


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
            res.status(500).json({message: "Error adding to database"});
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
            res.status(500).json({message: "Error reading from database"});
        } else {
        row == undefined
            ? console.log(`No category found with the id ${categoryID}`)
            : console.log(`Returned budget with categoryId ${categoryID}`);
          res.status(200).json({result: row});
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
            res.status(500).json({message: "Error updating database"});
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
            res.status(500).json({message: "Error deleting from database"});
        }
        res.status(200).json({message: "Deleted succesfully"});
      });
});

app.listen(5000, () => {
    // Verify request format
    console.log('Server listening on port 5000');
});
