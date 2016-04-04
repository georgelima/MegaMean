(function(angular, undefined){
  'use strict'
  angular.module('AcaShare').factory('socket', function(configApi, socketFactory){
    var myIoSocket = io.connect(configApi.urlBase);
    mySocket = socketFactory({
      ioSocket: myIoSocket
    });
    return mySocket;
  });
})(angular);
