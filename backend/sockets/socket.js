// 'use strict'
//
// module.exports = function(io){
//   var countClient = 0;
//
//   io.on('connection', function (socket) {
//     countClient++;
//     console.log('Client connection' + '(Clientes ativos: '+ countClient +')');
//
//     socket.emit('server-envia', 'Arquivo Chegou!');
//
//     //EVENTO DE DISCONEXAO
//     socket.on('disconnect', function(){
//       countClient--;
//       console.log('Client disconnect' + '(Clientes ativos: '+ countClient +')');
//     });
//   });
// };
