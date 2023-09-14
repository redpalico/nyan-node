const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.run('CREATE TABLE IF NOT EXISTS logs(text TEXT, timestamp TEXT)', (err) => {
  if (err) {
    console.error(err.message);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/submit', (req, res) => {
  const userInput = req.body.userInput + 'AAA';
  const timestamp = new Date().toISOString();
  db.run(`INSERT INTO logs(text, timestamp) VALUES(?, ?)`, [userInput, timestamp], (err) => {
    if (err) {
      return console.log(err.message);
    }
  });
  res.redirect('/');
});

app.get('/log.html', (req, res) => {
  db.all("SELECT * FROM logs", [], (err, rows) => {
    if (err) {
      throw err;
    }
    let html = '<ul>';
    rows.forEach((row) => {
      html += `<li>${row.text} - ${row.timestamp}</li>`;
    });
    html += '</ul>';
    res.send(html);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

