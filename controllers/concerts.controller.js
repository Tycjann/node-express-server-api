const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');
const Performer = require('../models/performer.model.js');
const Genre = require('../models/genre.model.js');
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {

    const findConcerts = await Concert.find().populate('performer').populate('genre');

    const freeSeats = async (day) => {
      
      const totalSeatsOnConcert = 50;
      const seats = await Seat.find({ day: day });
      const how = totalSeatsOnConcert - seats.length;
      console.log('seats.length:', how);
      return how;

    }
    // const findConcertsNew = findConcerts.map(async (data) => {
    //   const ticket = await freeSeats(data._doc.day);
    //   // return ({ ...data._doc, ticket: ticket })
    //   return ({ ...data._doc, ticket })
    // });
    
    const findConcertsNew = findConcerts.map((data) => ({ ...data._doc, ticket: freeSeats(data._doc.day) }));
    res.json(findConcertsNew);
    
    console.log('findConcertsNew:', findConcertsNew);

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

  performer = sanitize(performer);
  genre = sanitize(genre);
  price = sanitize(price);
  day = sanitize(day);
  image = sanitize(image);

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

// More concerts
exports.getByPerformer = async (req, res) => {
  try {
    res.json(await Concert.find({ performer: req.params.performer }).populate('performer').populate('genre'));
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    res.json(await Concert.find({ genre: req.params.genre }).populate('performer').populate('genre'));
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getByDay = async (req, res) => {
  try {
    // console.log('req.params.day:', req.params.day);
    res.json(await Concert.find({ day: req.params.day }).populate('performer').populate('genre'));
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getPriceMinMax = async (req, res) => {
  try {
    // console.log('req.params.price_min:', req.params.price_min);
    // console.log('req.params.price_max:', req.params.price_max);
    // req.params.price_min = 21;
    // req.params.price_max = 25;
    // res.json(await Concert.find({ $and: [{ price: { $gte: req.params.price_min } }, { price: { $lte: req.params.price_max } }] }).populate('performer').populate('genre'));
    // res.json(await Concert.find({ price: { $gte: req.params.price_min, $lte: req.params.price_max } }).populate('performer').populate('genre'));
    res.json(await Concert.find(
      { 
        $or: [
          { price: { $gt: req.params.price_min} },
          { price: { $lt: req.params.price_max } },
          { price: { $eq: req.params.price_min } },
          { price: { $eq: req.params.price_max } }
          // { $and: [{price: { $gt: req.params.price_min}}, {price: {$lte: req.params.price_max} }] }
        ]
      }).populate('performer').populate('genre'));
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getFreeSeats = async (req, res) => {
  try {
    const totalSeatsOnConcert = 50;
    const seats = await Seat.find({ day: req.params.day });
    const freeSeats = totalSeatsOnConcert - seats.length;
    
    res.json({freeSeats: freeSeats});
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};