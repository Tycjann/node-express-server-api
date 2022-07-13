const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({

  name: { type: String, required: true },
},
  {
    versionKey: false
  });

module.exports = mongoose.model('Genre', genresSchema);