const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Seat.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const dep = await Seat.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.addOne = async (req, res) => {
  const { day, seat, client, email } = req.body;
  if (day && seat && client && email) {
    try {
      const newSeat = new Seat({
        day: day,
        seat: seat,
        client: client,
        email: email
      });
      await newSeat.save();

      // websocket
      await req.io.emit('seatsUpdated', db);

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
    const { day, seat, client, email } = req.body;
    let dep = await Seat.findById(req.params.id);
    if (dep) {
      await Seat.updateOne({ _id: req.params.id }, {
        $set: {
          day: day,
          seat: seat,
          client: client,
          email: email
        }
      });
      dep = await Seat.findById(req.params.id);
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
    const dep = await Seat.findById(req.params.id);
    if (dep) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json(dep);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};