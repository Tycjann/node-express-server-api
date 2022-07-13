const Concert = require('../models/concert.model');
const Performer = require('../models/performer.model.js');
const Genre = require('../models/genre.model.js');

exports.getAll = async (req, res) => {
  try {
    res.json(await Concert.find().populate('performer').populate('genre'));
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Concert.findOne().populate('performer').populate('genre').skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const dep = await Concert.findById(req.params.id).populate('performer').populate('genre');
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.addOne = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  if (performer && genre && price && day && image) {
    try {
      const newConcert = new Concert({
        performer: performer,
        genre: genre,
        price: price,
        day: day,
        image: image
      });
      await newConcert.save();
      res.json({ message: 'OK' });

    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
  else {
    res.json({ message: 'You can\'t leave fields empty!' });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    let dep = await Concert.findById(req.params.id);
    if (dep) {
      await Concert.updateOne({ _id: req.params.id }, {
        $set: {
          performer: performer,
          genre: genre,
          price: price,
          day: day,
          image: image
        }
      });
      dep = await Concert.findById(req.params.id);
      res.json(dep);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const dep = await Concert.findById(req.params.id);
    if (dep) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(dep);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};