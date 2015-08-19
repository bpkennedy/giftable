'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('PeopleCtrl', function ($scope, Ref, $firebaseArray, $timeout, $location, ModalService) {

    var authData = Ref.getAuth();
    //$scope.people = $firebaseArray(Ref.child('person').limitToLast(10));
    $scope.people = $firebaseArray(Ref.child('person').orderByChild('created_by').equalTo(authData.uid));

    // display any errors
    $scope.people.$loaded().catch(alert);


    // provide a method for adding a message
    $scope.addPerson = function(newPerson) {
      if( newPerson ) {
        // push a message to the end of the array
        $scope.people.$add({first_name: newPerson.first_name, last_name: newPerson.last_name, picture: newPerson.picture, created_by: authData.uid})
          // display any errors
          .catch(alert);
      }
    };

    $scope.goToPerson = function(personId) {
      if (personId) {
        $location.path('/person/' + personId);
      }
    };

    $scope.addGiftee = function() {
      ModalService.showModal({
        templateUrl: 'views/addGiftee.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.formData = result;
          if ($scope.formData !== 'Cancel') {
            // push a message to the end of the array
            $scope.people.$add({first_name: result.first_name, last_name: result.last_name, picture: result.picture, created_by: authData.uid})
              // display any errors
              .catch(alert);
          }
          //console.log(result);
        });
      });
    };

    $scope.deleteGiftee = function(personId) {
      ModalService.showModal({
        templateUrl: 'views/deleteGiftee.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.formData = result;
          if ($scope.formData !== 'Yes') {
            // delete Giftee from firebase
            $scope.people.$remove(personId)
              // display any errors
              .catch(alert);
          }
          //console.log(result);
        });
      });
    };

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }
  });
