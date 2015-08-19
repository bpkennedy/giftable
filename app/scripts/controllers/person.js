'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:PersonCtrl
 * @description
 * # PersonCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('PersonCtrl', function ($scope, $routeParams, PersonSvc, Ref, $firebaseArray, ModalService, $timeout, $location) {
    var authData = Ref.getAuth();

    $scope.id = $routeParams.id;
    $scope.person = new PersonSvc($scope.id);
    $scope.people = $scope.people = $firebaseArray(Ref.child('person').orderByChild('created_by').equalTo(authData.uid));
    $scope.gifts = $firebaseArray(Ref.child('person/' + $scope.id + '/gifts'));
    $scope.events = $firebaseArray(Ref.child('person/' + $scope.id + '/events'));

    $scope.deleteGiftee = function() {
      ModalService.showModal({
        templateUrl: 'views/deleteGiftee.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {
        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.formData = result;
          if ($scope.formData === 'Delete' && $scope.person.created_by === authData.uid) {
              $scope.people.$remove($scope.people.$getRecord($scope.id)).then(function() {
                switchRouteToPeople();
              }).catch(alert);
          }
        });
      });
    };

    $scope.addGift = function() {
      ModalService.showModal({
        templateUrl: 'views/addGift.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.formData = result;
          if ($scope.formData !== 'Cancel') {
            // push a message to the end of the array
            $scope.gifts.$add({
              title: result.title,
              description: result.description,
              cost: result.cost,
              interest_level: result.interest_level,
              status: 'New',
              createdAt: Date.now() / 1000
            })
              // display any errors
              .catch(alert);
          }
          //console.log(result);
        });
      });
    };

    $scope.addEvent = function() {
      ModalService.showModal({
        templateUrl: 'views/addEvent.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.formData = result;
          if ($scope.formData !== 'Cancel') {
            // push a message to the end of the array
            $scope.events.$add({
              title: result.title,
              description: result.description,
              event_date: '1408295376000',
              created_at: Date.now() / 1000
            })
              // display any errors
              .catch(alert);
          }
          //console.log(result);
        });
      });
    };

    $scope.isCreator = function() {
      if ($scope.person.created_by === authData.uid) {
        return true;
      } else {
        return false;
      }
    };

    function switchRouteToPeople() {
      $location.path('/people');
    }

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }

  });
