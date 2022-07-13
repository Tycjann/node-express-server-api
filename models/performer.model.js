const mongoose = require('mongoose');

const performersSchema = new mongoose.Schema({

  name: { type: String, required: true },
},
  {
    versionKey: false
  });

module.exports = mongoose.model('Performer', performersSchema);