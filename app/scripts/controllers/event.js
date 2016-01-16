'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('EventCtrl', function ($scope, Ref, $routeParams, EventSvc, $timeout, $location, ModalService, toastr, Analytics) {
    $scope.pageClass = 'page-event';
    //var authData = Ref.getAuth();
    $scope.eventId = $routeParams.id;
    $scope.event = new EventSvc($scope.eventId);
    var eventRef = Ref.child('events/' + $scope.eventId);
    var personEvent = {};
    //TODO the below needs to be properly async handled using a promise instead of this nasty timeout.
    $timeout(function() {
        personEvent = Ref.child('person/' + $scope.event.createdFor + '/events/' + $scope.eventId);
    }, 500);

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.format = 'MMMM dd, yyyy';

    $scope.status = {
      opened: false
    };

    $scope.openNotification = function() {
      $scope.status.openedNotification = true;
    };

    $scope.openEvent = function() {
      $scope.status.openedEventTime = true;
    };

    $scope.editMode = true;
    $scope.edit = function(){
       $scope.editMode = false;
   };
    $scope.save = function(event){
        eventRef.update({
            'eventTitle':event.eventTitle,
            'eventDescription':event.eventDescription || '',
            'eventDate':event.eventDate,
            'notificationDays':event.notificationDays,
            'notificationTime': calculateNotificationDate(new Date(event.eventDate), event.notificationDays)
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
            }
        });
      });
    };

    var trySave = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
      } else {
        toastr.success('Changes saved!');
        Analytics.trackEvent('event', 'edited', $scope.event.eventTitle);
      }
    };

    var tryDelete = function(error) {
        if (error) {
            toastr.error('Oops!', 'An error happened.  Detail: ' + error);
        } else {
            toastr.success('Item deleted');
            Analytics.trackEvent('event', 'deleted', $scope.event.eventTitle);
        }
    };

    function calculateNotificationDate(eventDate, numDaysPrior) {
        var notificationDate = eventDate.setDate(eventDate.getDate() - numDaysPrior);
        return new Date(notificationDate);
    }
  });
