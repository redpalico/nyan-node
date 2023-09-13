const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const userInput = req.body.userInput;
  res.send(userInput + 'AAA');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
