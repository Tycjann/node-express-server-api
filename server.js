const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Datebase
const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
]; 

const app = express();

// ? Greg: Ja to chyba źle uruchamiam? 
const corsOptions = {
  "origin": "http://localhost:8000/", //origin sets domains that we approve
  "methods": "GET,POST", //we allow only GET and POST methods
}

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// All
app.get('/testimonials', cors(corsOptions), (req, res) => {
  res.json(db);
});

// Single or Random
app.get('/testimonials/:id', cors(corsOptions), (req, res) => {

  if (req.params.id === 'random') {
    res.json(db[Math.floor(Math.random() * db.length)]);
  }
  else {
    const results = db.find(obj => {
      return obj.id == req.params.id;
    })
    if (results)
      res.json(results);
    else
      res.json({ message: '404: Page not found!' });
  }
});

// Add
app.post('/testimonials/', cors(corsOptions), (req, res) => {
  const {author, text} = req.body;

  if (author && text) {
    res.json({ message: 'Save' });
    const obj = {
      id: uuidv4(),
      author: author,
      text: text,
    };

    db.push(obj);
  }
  else {
    res.json({ message: 'You can\'t leave fields empty!' });
  }
  // res.json(db);
  console.log(db);
});

// Update
app.put('/testimonials/:id', (req, res) => {
  const { author, text } = req.body;

  const results = db.find(obj => {
    return obj.id == req.params.id;
  })
  results.author = author;
  results.text = text;

  res.json({ message: 'Update = id: ' + req.params.id + ' - author: ' + author + ' - text: ' + text });
  // console.log(db);
});

// Delete
app.delete('/testimonials/:id', (req, res) => {
  
  const id = parseInt(req.params.id);
  
  const removeIndex = db.map(function (item) { return item.id; }).indexOf(id);

  if (parseInt(removeIndex) >= 0) db.splice(removeIndex, 1);

  res.json({ message: 'Delete = id: ' + id });
  // console.log('req.params.id: ', id);
  // console.log('removeIndex: ', removeIndex);
  console.log(db);
});

// Endpoint: not found pages
app.use((req, res) => {
  if (res.status(404)) res.json({ message: '404: Page not found!' });
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});