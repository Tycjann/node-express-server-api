const Testimonial = require('../models/testimonial.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Testimonial.find());
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Testimonial.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const dep = await Testimonial.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.addOne = async (req, res) => {
  const { author, text } = req.body;
  if (author && text) {
    try {
      const newTestimonial = new Testimonial({
        author: author,
        text: text
      });
      await newTestimonial.save();
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
    const { author, text } = req.body;
    let dep = await Testimonial.findById(req.params.id);
    if (dep) {
      await Testimonial.updateOne({ _id: req.params.id }, {
        $set: {
          author: author,
          text: text
        }
      });
      dep = await Testimonial.findById(req.params.id);
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
    const dep = await Testimonial.findById(req.params.id);
    if (dep) {
      await Testimonial.deleteOne({ _id: req.params.id });
      res.json(dep);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};