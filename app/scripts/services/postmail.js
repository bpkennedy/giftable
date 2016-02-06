'use strict';

/**
 * @ngdoc service
 * @name giftableApp.postmail
 * @description
 * # postmail
 * Factory in the giftableApp.
 */
angular.module('giftableApp')
  .factory('postmail', function ($http) {
      function registerEmail(emailData) {
        var jsonData = emailData;
        JSON.stringify(jsonData);
        $http.post('/postEmail', jsonData);
      }

    return {
      registerEmail: registerEmail
    };
  });
