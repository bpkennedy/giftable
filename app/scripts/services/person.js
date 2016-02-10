'use strict';

/**
 * @ngdoc service
 * @name giftableApp.person
 * @description
 * # person
 * Service in the giftableApp.
 */
angular.module('giftableApp')
  .factory('PersonSvc', function (Ref, $firebaseArray, $firebaseObject) {
    var allPersons = Ref.child('person');

    function getPersons() {
        return $firebaseArray(allPersons);
    }

    function getPerson (personId) {
        return $firebaseObject(allPersons.child(personId));
    }

    function getPersonEvents (personId) {
        return $firebaseArray(allPersons.child(personId + '/events'));
    }

    function getPersonEvent (personId, eventId) {
        return $firebaseObject(allPersons.child(personId + '/events/' + eventId));
    }

    return {
        getPerson: getPerson,
        getPersons: getPersons,
        getPersonEvents: getPersonEvents,
        getPersonEvent: getPersonEvent
    };

  });
