(function(angular, undefined){
  angular.module('AcaShare', ['ngRoute', 'ngFileUpload', 'ngLoagScript']).config(function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'partials/upload.html',
      controller: 'UploadController'
    });

    $routeProvider.when('/files', {
      templateUrl: 'partials/files.html',
      controller: 'FilesController'
    })
  });
})(angular);
