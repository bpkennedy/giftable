'use strict';

/**
 * @ngdoc service
 * @name giftableApp.eventSvc
 * @description
 * # eventSvc
 * Service in the giftableApp.
 */
angular.module('giftableApp')
  .service('EventSvc', function (Ref, $firebaseArray, $firebaseObject) {
    var allEvents = Ref.child('events');

    function getEvents() {
        return $firebaseArray(allEvents);
    }

    function getEventRaw(eventId) {
        return allEvents.child(eventId);
    }

    function getEvent(eventId) {
        return $firebaseObject(allEvents.child(eventId));
    }

    return {
        getEvents: getEvents,
        getEvent: getEvent,
        getEventRaw: getEventRaw
    };

  });
