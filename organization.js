'use strict';

var TrashOrganizationCtrl = angular.module('TrashOrganization', ['ngMaterial', 'ngSanitize']);
TrashOrganizationCtrl.controller('TrashOrganizationCtrl', function($scope, $mdDialog, $mdToast, $mdSidenav) {

  $scope.incidentVolume;
  $scope.incidentSeverity;
  $scope.trashVolume;
  $scope.trashSeverity;

  $scope.trashIncidents = [];
  $scope.trashCans = [];

  var endpoint = "wss://jgbml2yj.api.satori.com";
  var appKey = "6Efba84ebC1628e5bcAc67BE0639BE8f";
  var channelName = "SmartTrash";

  var client = new RTM(endpoint, appKey);
  client.on('enter-connected', function () {
    console.log('Connected to Satori RTM!');
  });
  client.start();

  // Incidents
  var channelIncidents = client.subscribe('Incident', RTM.SubscriptionMode.SIMPLE, {
    filter: 'SELECT * FROM `Incident` WHERE type = "incident"'
  });
  channelIncidents.on('enter-subscribed', function () {
    console.log('Subscribed to: ' + channelIncidents.subscriptionId);
  });

  channelIncidents.on('rtm/subscription/data', function(pdu) {
    console.log('pdu', pdu.body.messages);
    $scope.trashIncidents = pdu.body.messages.concat($scope.trashIncidents);
    if ($scope.trashIncidents.length > 20) {
      $scope.trashIncidents.splice($scope.trashIncidents.length - 10, 10)
    }
    $scope.$digest();
  });
  
  channelIncidents.on('rtm/subscribe/error', function(pdu) {
    console.log('Error', pdu);
  });
  
  // Trash Cans
  var channelTrashCans = client.subscribe('Trashcan', RTM.SubscriptionMode.SIMPLE);
  channelTrashCans.on('enter-subscribed', function () {
    console.log('Subscribed to: ' + channelTrashCans.subscriptionId);
  });

  channelTrashCans.on('rtm/subscription/data', function(pdu) {
    console.log('pdu', $scope.trashCans.length);
    $scope.trashCans = pdu.body.messages.concat($scope.trashCans);
    if ($scope.trashCans.length > 20) {
      $scope.trashCans.splice($scope.trashCans.length - 10, 10)
    }
    $scope.$digest();
  });
  
  channelTrashCans.on('rtm/subscribe/error', function(pdu) {
    console.log('Error', pdu);
  });
});
