'use strict';

var TrashCtrl = angular.module('TrashApp', ['ngMaterial', 'ngSanitize']);
TrashCtrl.controller('TrashCtrl', function($scope, $mdDialog, $mdToast, $mdSidenav) {
  $scope.isTrash = true;
  $scope.cannotSubmit = false;
  $scope.volume = 'small';
  $scope.severity = 'low';
  $scope.lat = 0;
  $scope.lon = 0;
  $scope.reportTrashButtonTitle = 'Report Trash';

  var endpoint = "wss://jgbml2yj.api.satori.com";
  var appKey = "6Efba84ebC1628e5bcAc67BE0639BE8f";
  var channel = "SmartTrash";

  var client = new RTM(endpoint, appKey);
  client.on('enter-connected', function () {
    console.log('Connected to Satori RTM!');
  });
  client.start();
  
  $scope.reportTrashIncident = function() {
    var trash = {
      type: "incident",
      lat: $scope.lat,
      lon: $scope.lon,
      type: $scope.isTrash ? 'trash' : 'recycle',
      volume: $scope.volume,
      severity: $scope.severity
    };
    client.publish(channel, trash, function(pdu) {
      if (pdu.action.endsWith("/ok")) {
        $scope.reportTrashButtonTitle = "Trash is published";
      } else {
        $scope.reportTrashButtonTitle = "Publish request failed: " + pdu.body.error + " - " + pdu.body.reason;
      }
      $scope.cannotSubmit = true;
      $scope.$digest();
    });
  }
  
  var watchID = navigator.geolocation.watchPosition(function(position) {
    if ($scope.lat != position.coords.latitude || $scope.lon != position.coords.longitude) {
      console.log('position', $scope.lat, position.coords.latitude, $scope.lon, position.coords.longitude);
      $scope.reportTrashButtonTitle = 'Report Trash';
      $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;
      $scope.cannotSubmit = false;
      $scope.$digest();
    }
  });
});
