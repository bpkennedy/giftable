'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('EventsCtrl', function ($scope, Ref, $firebaseArray, $timeout, $location, ModalService, blockUI) {
      var authData = Ref.getAuth();
      //$scope.people = $firebaseArray(Ref.child('person').limitToLast(10));
      $scope.events = [];
      $timeout(function() {
          blockUI.start();
        $scope.events = $firebaseArray(Ref.child('events').orderByChild('createdBy').equalTo(authData.uid));
        // display any errors
        $scope.events.$loaded(function() {
            console.log($scope.events);
            blockUI.stop();
        }).catch(alert);
      });

      // provide a method for adding a message
      $scope.addToEvents = function(newEvent) {
        if( newEvent ) {
          // push a message to the end of the array
          $scope.events.$add({
              eventTitle: result.title,
              eventDescription: result.description,
              //eventDate: result.eventTime.getTime() / 1000,
              eventDate: result.eventTime.toJSON(),
              createdAt: Date.now() / 1000,
              createdFor: $scope.id,
              createdBy: authData.uid,
              notificationTime: result.notificationTime.toJSON(),
              notification: 'pending'
            })
            // display any errors
            .catch(alert);
        }
      };

      $scope.goToEvent = function(eventId) {
        if (eventId) {
          $location.path('/events/' + eventId);
        }
      };

      $scope.showEventModal = function() {
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
              $scope.globalEvents.$add({
                eventTitle: result.title,
                eventDescription: result.description,
                //eventDate: result.eventTime.getTime() / 1000,
                eventDate: result.eventTime.toJSON(),
                createdAt: Date.now() / 1000,
                createdFor: $scope.id,
                createdBy: authData.uid,
                notificationTime: result.notificationTime.toJSON(),
                notification: 'pending'
              })
                // display any errors
                .catch(alert);
            }
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
