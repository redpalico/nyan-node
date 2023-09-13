const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize the database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE user_data (info TEXT, timestamp TEXT)");
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/', (req, res) => {
  const userInput = req.body.userInput;
  const timestamp = new Date().toISOString();

  db.run("INSERT INTO user_data VALUES (?, ?)", [userInput, timestamp], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A new row has been inserted with rowid ${this.lastID}`);
  });

  res.send(`${userInput}AAA - ${timestamp}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
