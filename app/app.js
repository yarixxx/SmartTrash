'use strict';

var TrashCtrl = angular.module('TrashApp', ['ngMaterial', 'ngSanitize']);
TrashCtrl.controller('TrashCtrl', function($scope, $mdDialog, $mdToast, $mdSidenav) {
  $scope.isTrash = true;
  $scope.volume = 'small';
  $scope.severity = 'low';

  var endpoint = "wss://jgbml2yj.api.satori.com";
  var appKey = "6Efba84ebC1628e5bcAc67BE0639BE8f";
  var channel = "SmartTrash";

  var client = new RTM(endpoint, appKey);
  client.on('enter-connected', function () {
    console.log('Connected to Satori RTM!');
  });
  client.start();
  
  $scope.reportTrashIncident = function() {
    var lat = 37.773615 + (Math.random() / 100);
    var lon = -122.415987 + (Math.random() / 100);
    var trash = {
      who: "client" + Math.ceil(10*Math.random()),
      type: "incident",
      location: [lat, lon],
      trashData: {
        type: $scope.isTrash ? 'trash' : 'recycle',
        volume: $scope.volume,
        severity: $scope.severity
      }
    };
    client.publish(channel, trash, function(pdu) {
      if (pdu.action.endsWith("/ok")) {
        // Publish is confirmed by Satori RTM.
        console.log("Trash is published: " + JSON.stringify(trash));
      } else {
        console.log("Publish request failed: " + pdu.body.error + " - " + pdu.body.reason);
      }
    });
  }
});
