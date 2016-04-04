(function(angular, undefined){
  angular.module('AcaShare').factory('serviceApi', ['configApi','$http', function(configApi, $http){

    var _getFiles = function(){
      return $http.get(configApi.urlBase);
    }

    var _getFile = function(name_file){
      return $http({
        method: 'GET',
        cache: false,
        url: configApi.urlBase + name_file,
        responseType: 'arraybuffer'
      });
    }

    var _deleteFile = function(id){
      return $http.delete(configApi.urlBase + id);
    }

    var _saveFile = function(file){
      return $http.post(configApi.urlBase, file);
    }

    return {
        getFiles: _getFiles,
        getFile: _getFile,
        deleteFile: _deleteFile,
        saveFile: _saveFile
    }
  }]);
})(angular);
