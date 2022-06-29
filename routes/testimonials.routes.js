const express = require('express');
const router = express.Router();
const database = require('../db');
const { v4: uuidv4 } = require('uuid');

// get all
router.route('/testimonials').get((req, res) => {
  const db = database.testimonials;

  res.json(db);
  
  // console.log(db);
});

// get single or random
router.route('/testimonials/:id').get((req, res) => {
  const db = database.testimonials;

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

// add 
router.route('/testimonials/').post((req, res) => {
  const db = database.testimonials;

  const { author, text } = req.body;

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
  // console.log(db);
});

// update
router.route('/testimonials/:id').put((req, res) => {
  const db = database.testimonials;

  const { author, text } = req.body;

  const results = db.find(obj => {
    return obj.id == req.params.id;
  })
  results.author = author;
  results.text = text;

  res.json({ message: 'Update = id: ' + req.params.id + ' - author: ' + author + ' - text: ' + text });
  // console.log(db);
});

// delete
router.route('/testimonials').delete((req, res) => {
  const db = database.testimonials;

  const id = parseInt(req.params.id);

  const removeIndex = db.map(function (item) { return item.id; }).indexOf(id);

  if (parseInt(removeIndex) >= 0) db.splice(removeIndex, 1);

  res.json({ message: 'Delete = id: ' + id });
  // console.log('req.params.id: ', id);
  // console.log('removeIndex: ', removeIndex);
  // console.log(db);
});


module.exports = router;