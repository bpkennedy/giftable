'use strict';

/**
 * @ngdoc service
 * @name giftableApp.person
 * @description
 * # person
 * Service in the giftableApp.
 */
angular.module('giftableApp')
  .service('PersonSvc', function ($firebaseObject) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var baseRef = new Firebase("https://giftable.firebaseio.com").child('person');

    return function(personId) {
      return $firebaseObject(baseRef.child(personId));
    }
    
  });
