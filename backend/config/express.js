//DEPENDENCIAS
var load = require('express-load');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

app.set('port', '3000');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
//ALLOW CORS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

load('models').then('controllers').then('routes').into(app);

app.controllers.arquivo.server.listen(app.get('port') || process.env.PORT,function(){
  console.log('Rodando na porta 3000');
});

module.exports = function(){
  return app;
};
