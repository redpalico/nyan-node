const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS logs (text TEXT, timestamp TEXT)");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <form action="/" method="POST">
      <input type="text" name="userInput"/>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/', (req, res) => {
  const userInput = req.body.userInput + 'AAA';
  const timestamp = new Date().toISOString();

  db.run("INSERT INTO logs (text, timestamp) VALUES (?, ?)", [userInput, timestamp], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.send(`You submitted: ${userInput}`);
  });
});

app.get('/log.html', (req, res) => {
  db.all("SELECT * FROM logs", [], (err, rows) => {
    if(err) {
      throw err;
    }

    const html = rows.map(row => `${row.text} at ${row.timestamp}`).join('<br>');
    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
