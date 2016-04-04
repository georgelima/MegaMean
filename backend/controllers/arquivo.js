var sanitize = require('mongo-sanitize');
var fs = require('fs');
var mega = require('mega');
var fileType = require('file-type');
var path = require('path');
var stream = require('stream');

var mega_email = process.argv[2];
var mega_senha = process.argv[3];

if (!mega_email || !mega_senha){
  console.log('Você não informou o email ou senha da sua conta Mega');
}

//INICIA A SESSÃO COM O MEGA
var storage = mega({email: mega_email, password:mega_senha}, function(){
  console.log('Conectado ao serviço do MEGA');
});

module.exports = function(app){

  var server = require('http').Server(app);
  var io = require('socket.io')(server);

  var countClient = 0;
    io.on('connection', function (socket) {
      countClient++;
      console.log('Client connection' + '(Clientes ativos: '+ countClient +')');

      //EVENTO DE DISCONEXAO
      socket.on('disconnect', function(){
        countClient--;
        console.log('Client disconnect' + '(Clientes ativos: '+ countClient +')');
      });
    });

  var Arquivo = app.models.arquivo;
  var controller = {};
  //CARREGA OS ARQUIVOS PARA USAR POSTERIORMENTE
  var arquivos = [];

  controller.server = server;

  storage.on('ready', function(){
    console.log('Storage loaded');
    for (var id in storage.files){
      var f = storage.files[id];
      if (!f.directory){
        arquivos.push({id: id, name_file: f.name});
      }
    }
    console.log(arquivos);
    return arquivos;
  });

  function carregaArquivos(){
    console.log(arquivos);
    arquivos = [];
      for (var id in storage.files){
        var f = storage.files[id];
        if (!f.directory){
          if (f.name){
            arquivos.push({id: id, name_file: f.name});
          }
        }
      }
      return arquivos;
  }
  //LISTA ARQUIVOS
  controller.listaArquivos = function(req, res){
    Arquivo.find().exec().then(function(arquivos){
      res.status(200).json(arquivos);
    }, function(err){
      res.status(404).json(err);
    });
  }

  controller.salvaArquivo = function(req, res){
    //INFORMAÇÕES PARA O BANCO
    var name_file = req.files.file.name;
    var size = req.files.file.size;
    var up = storage.upload({
      'name': name_file,
      'size': size
    }, function(err, file){
      if (err) throw err;

      console.log('Uploaded',file.nodeId, file.name, file.size + 'B');
      //GERA O LINK DO DOWNLOAD
      file.link(function(err, link){
        if (err) throw err;
        console.log('Download from: ', link);
        //GERA JSON PARA O MONGO
        var dados = {
          name_file: sanitize(name_file),
          nodeId: file.nodeId,
          descritption: sanitize(req.body.description) || 'Nenhuma descrição informada',
          link: link,
        }
        //SALVA OS DADOS DO ARQUIVO NO BANCO
        Arquivo.create(dados).then(function(arquivo){
            console.log(arquivo);
            io.emit('server-envia', 'Arquivo Chegou!');
            res.redirect('http://192.168.1.3/AcaShare');
          }, function(err){
            res.status(500).json(err);
        });
      });
    });

    fs.createReadStream(req.files.file.path).pipe(up);

    up.on('progress', function (stats) {
      console.log(stats.bytesLoaded);
    });

    up.on('complete', function() {
      console.log('Enviado');
    });
  }
  controller.atualizaArquivo = function(req, res){
    var id = sanitize(req.body._id);
    var dados = {
      name_file: sanitize(req.body.name_file),
      descritption: sanitize(req.body.description)
    }
    Arquivo.findByIdAndUpdate(id, dados).exec().then(function(arquivo){
      res.status(201).json(arquivo);
    }, function(err){
      res.status(500).json(err);
    });
  }
  //BAIXA O ARQUIVO
  controller.mostraArquivo = function(req, res){
    // var id = sanitize(req.params.id);
    var name = req.params.id;
    Arquivo.findOne({ name_file: name }).exec().then(function(arquivo){
      mega.file(arquivo.link).loadAttributes(function(err, file){
        if (err) throw err;
        console.log('File: ' + file.name, file.size+'B');
        var dl = file.download();
        dl.pipe(res);

        dl.on('progress', function(stats){
          console.log(stats.bytesLoaded);
        });

        dl.on('end', function(){
          console.log('Arquivo baixado com sucesso!');
        });
      });
    }, function(err){
      res.status(404).json(err);
    });
  }

  controller.deletaArquivo = function(req, res){
    var id = sanitize(req.params.id);
    console.log(arquivos);
    carregaArquivos();
    Arquivo.findById(id).exec().then(function(arquivo){
     for (var i = 0; i < arquivos.length; i++){
      if (arquivos[i].id === arquivo.nodeId){
        storage.files[arquivos[i].id].delete(function(err){
          if (err) throw err;

          Arquivo.remove({ _id: arquivo.id }).exec().then(function(){
            var deletado = true;
            res.status(200).send(deletado);
          }, function(err){
            res.json(err);
          });
          carregaArquivos();
        });
      }
    }
    }, function(err){
      res.status(404).json(err);
    });
  }

  return controller;
}
