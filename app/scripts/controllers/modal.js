'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:AddgifteeCtrl
 * @description
 * # AddgifteeCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('ModalCtrl', function ($scope, close) {
    var tomorrow = new Date();
    var afterTomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.rate = 7;
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
    };

    $scope.imageCropStep = '1';
    $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
    ];
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.status = {
        opened: false
    };

    $scope.close = function(result, eventTime, notificationTime) {
        result.eventTime = eventTime;
        result.notificationTime = calculateNotificationDate(new Date(eventTime), notificationTime);
        result.notificationDays = notificationTime;
     	close(result, 500); // close, but give 500ms for bootstrap to animate
     };

     //datetimepicker stuff
     $scope.today = function() {
       $scope.dt = new Date();
     };
     $scope.today();

     $scope.clear = function () {
       $scope.dt = null;
     };

     // Disable weekend selection
     $scope.disabled = function(date, mode) {
       return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };

     $scope.toggleMin = function() {
       $scope.minDate = $scope.minDate ? null : new Date();
     };
     $scope.toggleMin();

     $scope.openEvent = function() {
       $scope.status.openedEventTime = true;
     };

     $scope.openNotification = function() {
       $scope.status.openedNotification = true;
     };

     $scope.getDayClass = function(date, mode) {
       if (mode === 'day') {
         var dayToCheck = new Date(date).setHours(0,0,0,0);

         for (var i=0;i<$scope.events.length;i++){
           var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

           if (dayToCheck === currentDay) {
             return $scope.events[i].status;
           }
         }
       }

       return '';
     };

     $scope.confirm = function(confirm) {
         var result = {};
         result.confirm = confirm;
         close(result, 500);
     };

     function calculateNotificationDate(eventDate, numDaysPrior) {
         var notificationDate = eventDate.setDate(eventDate.getDate() - numDaysPrior);
         return new Date(notificationDate);
     }
  });
