'use strict'
//DEPENDENCIAS
var mongoose = require('mongoose');

module.exports = function(url){
  mongoose.connect(url);

  //EVENTS MONGOOSE
  mongoose.connection.on('connected', ()=>{
    console.log('Conectado ao mongoose');
  });

  mongoose.connection.on('disconnected', ()=>{
    console.log('Desconectado do mongoose');
  });

  mongoose.connection.on('error', (error)=>{
    console.log('Houve um error: ' + error);
  });
  //CLOSE THE PROCESS ON CTRL+C USER
  process.on('SIGINT', ()=>{
    console.log('Aplicação encerrada pelo usuário!');
    process.exit(0);
  })
}
