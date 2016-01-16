'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:PersonmodalsvcCtrl
 * @description
 * # PersonmodalsvcCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('PersonModalCtrl', function ($scope, close, firstName, lastName, city, state, address, zipcode) {
      $scope.person = {
          firstName: firstName,
          lastName: lastName,
          city: city,
          state: state,
          address: address,
          zipcode: zipcode
      };

      $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
       };
  });
