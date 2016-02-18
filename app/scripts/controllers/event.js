'use strict';

/**
* @ngdoc function
* @name giftableApp.controller:EventCtrl
* @description
* # EventCtrl
* Controller of the giftableApp
*/
angular.module('giftableApp')
.controller('EventCtrl', function ($scope, $q, Ref, $routeParams, EventSvc, PersonSvc, $location, ModalService, toastr, Analytics) {
    $scope.pageClass = 'page-event';
    $scope.eventId = $routeParams.id;
    $scope.event = EventSvc.getEvent($scope.eventId);
    $scope.eventRaw = EventSvc.getEventRaw($scope.eventId);
    $scope.event.$loaded().then(function() {
        $scope.personEvent = PersonSvc.getPersonEvent($scope.event.createdFor, $scope.eventId);
        $scope.event.eventDate = new Date($scope.event.eventDate);
    }) ;
    $scope.editMode = false;
    $scope.format = 'MMMM dd, yyyy';
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.status = {
        opened: false
    };

    $scope.openNotification = function() {
        $scope.status.openedNotification = true;
    };

    $scope.openEvent = function() {
        $scope.status.openedEventTime = true;
    };

    $scope.edit = function(){
        $scope.editMode = true;
    };

    $scope.save = function(event){
        $scope.eventRaw.update({
            'eventTitle':event.eventTitle,
            'eventDescription':event.eventDescription || '',
            'eventDate':event.eventDate,
            'notificationDays':event.notificationDays,
            'notificationTime': calculateNotificationDate(new Date(event.eventDate), event.notificationDays)
        }, function(error) {
            if (error) {
                toastError(error);
            } else {
                toastr.success('Changes saved!');
                Analytics.trackEvent('event', 'edited', $scope.event.eventTitle);
            }
        });
        $scope.cancel();
    };

    $scope.cancel = function() {
        $scope.editMode = false;
    };

    $scope.return = function(createdFor) {
        $location.path('/person/' + createdFor);
    };

    $scope.delete = function() {
        var personView = $scope.event.createdFor;
        $scope.personEvent.$remove().catch(toastError);
        $scope.event.$remove().catch(toastError).then(function() {
            toastr.success('Item deleted');
            Analytics.trackEvent('event', 'deleted', $scope.event.eventTitle);
        });
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

    function toastError(msg) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + msg);
    }

    function calculateNotificationDate(eventDate, numDaysPrior) {
        var notificationDate = eventDate.setDate(eventDate.getDate() - numDaysPrior);
        return new Date(notificationDate);
    }
});
