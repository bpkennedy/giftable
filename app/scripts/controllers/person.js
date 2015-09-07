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
    $scope.giftsRef = new Firebase.util.NormalizedCollection(
      [Ref.child("person/" + $scope.id + "/gifts"), "person"],
      [Ref.child("gifts"), "gifts"]
    ).select(
      "gifts.title",
      "gifts.cost",
      "gifts.description",
      "gifts.interest_level",
      "gifts.status",
      "gifts.picture",
      {"key":"person.$value","alias":"test"}
    ).ref();
    $scope.eventsRef = new Firebase.util.NormalizedCollection(
      [Ref.child('person/' + $scope.id + '/events'), 'person'],
      [Ref.child('events'), 'events']
    ).select(
      "events.event_title",
      "events.event_description",
      "events.event_date",
      "events.created_by",
      "events.created_at",
      "events.created_for",
      {"key":"person.$value","alias":"test"}
    ).ref();

    $scope.person = new PersonSvc($scope.id);
    $scope.people = $firebaseArray(Ref.child('person').orderByChild('created_by').equalTo(authData.uid));
    $scope.globalGifts = $firebaseArray(Ref.child('gifts'));
    $scope.globalEvents = $firebaseArray(Ref.child('events'));
    $scope.personGifts = $firebaseArray(Ref.child('person/' + $scope.id + '/gifts'));
    $scope.joinedGifts = $firebaseArray($scope.giftsRef);
    $scope.joinedEvents = $firebaseArray($scope.eventsRef);

    $scope.events = $firebaseArray(Ref.child('person/' + $scope.id + '/events'));

    var eventList = Ref.child('person/' + $scope.id + '/events');
    var giftList = Ref.child('person/' + $scope.id + '/gifts');


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
            $scope.globalGifts.$add({
              title: result.title,
              description: result.description,
              cost: result.cost,
              picture: result.picture,
              interest_level: result.interest_level,
              status: 'New',
              created_at: Date.now() / 1000,
              created_by: authData.uid,
              created_for: $scope.id
            })
              // display any errors
              .catch(alert).then(function(ref){
                var giftUid = ref.key();
                $scope.createNewGiftOnPerson(giftUid);
              });
          }
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
            $scope.globalEvents.$add({
              event_title: result.title,
              event_description: result.description,
              event_date: result.eventTime.getTime() / 1000,
              created_at: Date.now() / 1000,
              created_for: $scope.id,
              created_by: authData.uid
            })
              // display any errors
              .catch(alert).then(function(ref){
                var eventUid = ref.key();
                $scope.createNewEventOnPerson(eventUid);
              });
          }
        });
      });
    };

    $scope.createNewGiftOnPerson = function(giftUid) {
      //setting up this because variables can't be passed inside object literals for the .set() func below.
      var giftId = giftUid,
          value = 'true',
          obj = {};
      obj[giftId] = value;
      giftList.update(obj);
    };

    $scope.createNewEventOnPerson = function(eventUid) {
      //setting up this because variables can't be passed inside object literals for the .set() func below.
      var eventId = eventUid,
          value = 'true',
          obj = {};
      obj[eventId] = value;
      eventList.update(obj);
    };

    /*$scope.addEvent = function() {
      ModalService.showModal({
        templateUrl: 'views/addEvent.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          console.log(result.eventTime);
          $scope.formData = result;
          if ($scope.formData !== 'Cancel') {
            // push a message to the end of the array
            $scope.events.$add({
              title: result.title,
              description: result.description,
              event_date: result.eventTime.getTime() / 1000,
              created_at: Date.now() / 1000
            })
              // display any errors
              .catch(alert);
          }
          //console.log(result);
        });
      });
    };*/

    $scope.isCreator = function() {
      if ($scope.person.created_by === authData.uid) {
        return true;
      } else {
        return false;
      }
    };

    $scope.goToGift = function(giftId) {
      if (giftId) {
        $location.path('/gift/' + giftId);
      }
    };

    $scope.goToEvent = function(eventId) {
      if (eventId) {
        $location.path('/event/' + eventId);
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
