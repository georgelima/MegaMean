var multiparty = require('connect-multiparty');

module.exports = function(app){
  var controller = app.controllers.arquivo;

    app.route('/api/files')
      .get(controller.listaArquivos)
      .post(multiparty(), controller.salvaArquivo)
      .put(controller.atualizaArquivo);

    app.route('/api/files/:id')
      .get(controller.mostraArquivo)
      .delete(controller.deletaArquivo);
}
