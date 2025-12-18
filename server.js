const express = require('express');
const matchTexts = require('./matcher');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/match', (req, res) => {
  const { resume, job } = req.body;

  const result = matchTexts(resume, job);
  res.json(result);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
