'use strict';

/**
 * @ngdoc service
 * @name giftableApp.eventSvc
 * @description
 * # eventSvc
 * Service in the giftableApp.
 */
angular.module('giftableApp')
  .service('EventSvc', function ($firebaseObject) {
    var baseRef = new Firebase('https://giftable.firebaseio.com').child('events');

    return function(eventId) {
      return $firebaseObject(baseRef.child(eventId));
    };
  });
