const express = require('express');
const router = express.Router();
const database = require('../db');
const { v4: uuidv4 } = require('uuid');

// get all
router.route('/seats').get((req, res) => {
  const db = database.seats;
  res.json(db);
});

// get single or random
router.route('/seats/:id').get((req, res) => {
  const db = database.seats;

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
router.route('/seats/').post((req, res) => {
  const db = database.seats;
  const { day, seat, client, email } = req.body;

  if (performer && genre && price && day && image) {
    res.json({ message: 'Save' });
    const obj = {
      id: uuidv4(),
      day: day,
      seat: seat,
      client: client,
      email: email,
    };

    db.push(obj);
  }
  else {
    res.json({ message: 'You can\'t leave fields empty!' });
  }
});

// update
router.route('/seats/:id').put((req, res) => {
  const db = database.seats;
  const { day, seat, client, email } = req.body;

  const results = db.find(obj => {
    return obj.id == req.params.id;
  })

  results.performer = performer,
  results.genre = genre,
  results.price = price,
  results.day = day,
  results.image = image,

  res.json({ message: 'Update OK' });
});

// delete
router.route('/seats/:id').delete((req, res) => {
  const db = database.seats;
  const id = parseInt(req.params.id);
  const removeIndex = db.map(function (item) { return item.id; }).indexOf(id);
  if (parseInt(removeIndex) >= 0) db.splice(removeIndex, 1);
  res.json({ message: 'Delete OK' });
});

module.exports = router;