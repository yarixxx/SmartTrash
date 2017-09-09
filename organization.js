'use strict';

var TrashOrganizationCtrl = angular.module('TrashOrganization', ['ngMaterial', 'ngSanitize']);
TrashOrganizationCtrl.controller('TrashOrganizationCtrl', function($scope, $mdDialog, $mdToast, $mdSidenav) {

  $scope.trashList = [];

  var endpoint = "wss://jgbml2yj.api.satori.com";
  var appKey = "6Efba84ebC1628e5bcAc67BE0639BE8f";
  var channelName = "SmartTrash";

  var client = new RTM(endpoint, appKey);
  client.on('enter-connected', function () {
    console.log('Connected to Satori RTM!');
  });
  client.start();
  
  var channel = client.subscribe(channelName, RTM.SubscriptionMode.SIMPLE);
  channel.on('enter-subscribed', function () {
    console.log('Subscribed to: ' + channel.subscriptionId);
  });

  channel.on('rtm/subscription/data', function(pdu) {
    console.log('pdu.body.messages', pdu.body.messages);
    $scope.trashList = pdu.body.messages.concat($scope.trashList);
    $scope.$digest();
  });
  
  channel.on('rtm/subscribe/error', function(pdu) {
    console.log('Error', pdu);
  });
});
