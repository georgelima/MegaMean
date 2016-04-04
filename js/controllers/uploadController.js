(function(angular, undefined){
  angular.module('AcaShare').controller('UploadController', ['$scope', 'Upload','configApi', function($scope, Upload, configApi){

    var socket = io('http://192.168.1.4:3000');

    socket.on('server-envia', function(data){
      Materialize.toast('Um novo arquivo foi enviado!', 3000, 'rounded')
    });

    $scope.ajaxUp = false;
    $scope.enviaForm = function(file){
      var name_file = file.name_file;
      var description = file.description;
      var file = file.file;

      var upload = Upload.upload({
        url: configApi.urlBase,
        data: { file: file, name_file: name_file, description: description }
      }).then(function(err){
        $scope.message = 'Erro ao enviar o Arquivo!';
      }, function(file){
        $scope.ajaxUp = false;
        $scope.message = 'Arquivo enviado!';
      }, function(evt){
        $scope.ajaxUp = true;
      });
    }

  }]);
})(angular);
