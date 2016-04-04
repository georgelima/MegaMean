//DEPENDENCIAS
const mongoose = require('mongoose');

var _schema = mongoose.Schema({
  name_file: {
    type: String,
    required: true
  },
  nodeId: {
    type: String,
  },
  descritption: {
    type: String,
  },
  link: {
    type: String
  },
  date_post: {
    type: Date,
    default: Date.now
  }
});

var Arquivo = mongoose.model('Arquivo', _schema);
var stream = Arquivo.find().stream();

stream.on('error', function(err){
  console.log(err);
});

module.exports = function(app) {
  return Arquivo;
};
