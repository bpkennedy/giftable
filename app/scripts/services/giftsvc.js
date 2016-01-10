'use strict';

/**
 * @ngdoc service
 * @name giftableApp.giftSvc
 * @description
 * # giftSvc
 * Service in the giftableApp.
 */
angular.module('giftableApp')
  .service('GiftSvc', function ($firebaseObject) {
    var baseRef = new Firebase('https://giftable.firebaseio.com').child('gifts');

    return function(giftId) {
      return $firebaseObject(baseRef.child(giftId));
    };

  });
