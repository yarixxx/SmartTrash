'use strict';

var TrashCtrl = angular.module('TrashApp', ['ngMaterial', 'ngSanitize']);
TrashCtrl.controller('TrashCtrl', function($scope, $mdDialog, $mdToast, $mdSidenav) {

  $scope.title = 'Bart Watcher';
  $scope.status = 'none';
  $scope.stations = [];

  var endpoint = "wss://open-data.api.satori.com";
  var appKey = "82AE48a0fAbAfCe5eB42f4617DFA6e5e";
  var channel = "trash";

  var client = new RTM(endpoint, appKey);
  client.on('enter-connected', function () {
    console.log('Connected to Satori RTM!');
  });
  client.start();
});
