'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('EventCtrl', function ($scope, Ref, $routeParams, EventSvc, $timeout, $location, ModalService, toastr) {
    //var authData = Ref.getAuth();
    $scope.eventId = $routeParams.id;
    $scope.event = new EventSvc($scope.eventId);
    var eventRef = Ref.child('events/' + $scope.eventId);
    var personEvent = {};
    //TODO the below needs to be properly async handled using a promise instead of this nasty timeout.
    $timeout(function() {
        personEvent = Ref.child('person/' + $scope.event.createdFor + '/events/' + $scope.eventId);
    }, 500);

    $scope.editMode = true;
    $scope.edit = function(){
       $scope.editMode = false;
       // Your code here and set it to false when your are done with it
   };
    $scope.save = function(event){
        console.log(event);
        eventRef.update({
            'eventTitle':event.eventTitle,
            'eventDescription':event.eventDescription,
            'eventDate':event.eventDate,
            'notificationTime':event.notificationTime
        }, trySave);
        $scope.cancel();
    };
    $scope.cancel = function() {
        $scope.editMode = true;
    };
    $scope.return = function(createdFor) {
        $location.path('/person/' + createdFor);
    };
    $scope.delete = function() {
        var personView = $scope.event.createdFor;
        personEvent.remove(tryDelete);
        eventRef.remove(tryDelete);
        $scope.return(personView);
    };

    $scope.deleteItem = function() {
      ModalService.showModal({
        templateUrl: 'views/confirm.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
            if (result.confirm === 'yes') {
                $scope.delete();
            } else {
                console.log('said no');
            }
        });
      });
    };

    var trySave = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
        console.log('Synchronization failed');
      } else {
        toastr.success('Changes saved!');
        console.log('Synchronization succeeded');
      }
    };

    var tryDelete = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
        console.log('Synchronization failed');
      } else {
        toastr.success('Item deleted');
        console.log('Synchronization succeeded');
      }
    };
  });
