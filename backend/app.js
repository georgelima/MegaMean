//DEPENDENCIAS

var app = require('./config/express.js')(); //CONFIG express
require('./config/db.js')('mongodb://192.168.1.5/acashare'); //CONFIG mongoose
