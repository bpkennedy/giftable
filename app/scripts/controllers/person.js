'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:PersonCtrl
 * @description
 * # PersonCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('PersonCtrl', function ($scope, toastr, $routeParams, PersonSvc, Ref, $firebaseArray, ModalService, $timeout, $location, Analytics, moment) {
    var authData = Ref.getAuth();
    $scope.pageClass = 'page-person';
    $scope.id = $routeParams.id;
    $scope.giftsRef = new Firebase.util.NormalizedCollection(
      [Ref.child('person/' + $scope.id + '/gifts'), 'person'],
      [Ref.child('gifts'), 'gifts']
    ).select(
      'gifts.title',
      'gifts.cost',
      'gifts.description',
      'gifts.interestLevel',
      'gifts.status',
      {'key':'person.$value','alias':'test'}
    ).ref();
    $scope.eventsRef = new Firebase.util.NormalizedCollection(
      [Ref.child('person/' + $scope.id + '/events'), 'person'],
      [Ref.child('events'), 'events']
    ).select(
      'events.eventTitle',
      'events.eventDescription',
      'events.eventDate',
      'events.createdBy',
      'events.createdAt',
      'events.createdFor',
      {'key':'person.$value','alias':'test'}
    ).ref();

    $scope.person = new PersonSvc($scope.id);
    $scope.people = $firebaseArray(Ref.child('person').orderByChild('createdBy').equalTo(authData.uid));
    $scope.globalGifts = $firebaseArray(Ref.child('gifts'));
    $scope.globalEvents = $firebaseArray(Ref.child('events'));
    $scope.personGifts = $firebaseArray(Ref.child('person/' + $scope.id + '/gifts'));
    $scope.joinedGifts = $firebaseArray($scope.giftsRef);
    $scope.joinedEvents = $firebaseArray($scope.eventsRef);

    $scope.events = $firebaseArray(Ref.child('person/' + $scope.id + '/events'));
    $scope.max = 5;
    $scope.isReadonly = true;

    var eventList = Ref.child('person/' + $scope.id + '/events');
    var giftList = Ref.child('person/' + $scope.id + '/gifts');
    var globalEventsRef = Ref.child('events');
    var globalGiftsRef = Ref.child('gifts');
    var today = moment(new Date());

    $scope.editGiftee = function() {
      ModalService.showModal({
        templateUrl: 'views/editGiftee.html',
        controller: 'PersonModalCtrl',
        inputs: {
            firstName: $scope.person.firstName,
            lastName: $scope.person.lastName,
            city: $scope.person.city,
            state: $scope.person.state,
            address: $scope.person.address,
            zipcode: $scope.person.zipcode
        }
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
            $scope.formData = result;
            if ($scope.formData !== 'Cancel') {
                $scope.person.firstName = result.firstName;
                $scope.person.lastName = result.lastName;
                $scope.person.city = result.city || '';
                $scope.person.state = result.state;
                $scope.person.address = result.address || '';
                $scope.person.zipcode = result.zipcode || '';
                $scope.person.$save()
                  .catch(alert).then(function(){
                    toastr.success(result.firstName + ' updated');
                    Analytics.trackEvent('giftee', 'updated', result.firstName + ' ' + result.lastName);
                });
            }
        });
      });
    };

  $scope.deleteGiftee = function() {
    ModalService.showModal({
      templateUrl: 'views/confirm.html',
      controller: 'ModalCtrl'
    }).then(function(modal) {

      //it's a bootstrap element, use 'modal' to show it
      modal.element.modal();
      modal.close.then(function(result) {
          if (result.confirm === 'yes') {
              //handle the firebase deletion now for events, gifts, and the person
              deleteGifteeEvents();
              deleteGifteeGifts();
              deleteGiftee();
          }
      });
    });
  };

  function deleteGifteeEvents() {
      var collectedEvents = {};
      $scope.joinedEvents.forEach(function(event) {
          collectedEvents[event.$id] = null;
          globalEventsRef.update(collectedEvents);
      });
  }

  function deleteGifteeGifts() {
      var collectedGifts = {};
      $scope.joinedGifts.forEach(function(gift) {
          collectedGifts[gift.$id] = null;
          globalGiftsRef.update(collectedGifts);
      });
  }

  function deleteGiftee() {
      var personName = $scope.person.firstName;
      var personLastname = $scope.person.lastName;
      $scope.person.$remove();
      $location.path('/people');
      toastr.success(personName + ' has been deleted');
      Analytics.trackEvent('giftee', 'deleted', personName + ' ' + personLastname);
  }

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
            $scope.globalGifts.$add({
              title: result.title,
              description: result.description,
              url: result.url || '',
              cost: result.cost,
              interestLevel: result.interestLevel || '',
              status: 'new',
              createdAt: new Date().toJSON(),
              createdBy: authData.uid,
              createdFor: $scope.id
            })
              .catch(alert).then(function(ref){
                var giftUid = ref.key();
                $scope.createNewGiftOnPerson(giftUid);
                toastr.success('Gift created!');
                Analytics.trackEvent('gift', 'added', result.title);
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
            $scope.globalEvents.$add({
              eventTitle: result.title,
              eventDescription: result.description,
              eventDate: result.eventTime.toJSON(),
              createdAt: new Date().toJSON(),
              createdFor: $scope.id,
              createdBy: authData.uid,
              notificationTime: result.notificationTime.toJSON(),
              notificationDays: result.notificationDays,
              notification: 'pending'
            })
              .catch(alert).then(function(ref){
                var eventUid = ref.key();
                $scope.createNewEventOnPerson(eventUid);
                toastr.success('Event created!');
                Analytics.trackEvent('event', 'added', result.title);
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

    $scope.isCreator = function() {
      if ($scope.person.createdBy === authData.uid) {
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

    $scope.calculateDaysAway = function(eventDate) {
        var eventDay = moment(eventDate),
            daysUntil = eventDay.diff(today, 'days');
        if (daysUntil < 0) {
            daysUntil = 0;
        }
        return daysUntil;
    };

    $scope.getProximityColor = function(eventDate) {
        var days = $scope.calculateDaysAway(eventDate);
        if (days > 14) {
            return 'green';
        } else if (days > 7 && days < 14) {
            return 'yellow';
        } else if (days > 0 && days < 7){
            return 'red';
        } else if (days === 0){
            return 'death';
        }
    };

    $scope.getGiftStatusColor = function(status) {
        var colorClasses = {
            'new':'newGift',
            'ordered':'orderedGift',
            'ready':'readyGift',
            'given':'givenGift'
        };
        return colorClasses[status];
    };

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }


  });
