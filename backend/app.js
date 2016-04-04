//DEPENDENCIAS

var app = require('./config/express.js')(); //CONFIG express
require('./config/db.js')('mongodb://192.168.1.4/acashare'); //CONFIG mongoose
