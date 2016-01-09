'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('NavCtrl', function ($scope, $location, Ref, $firebaseObject) {
    function getAuth() {
        if (Ref.getAuth() === null) {
            return;
        } else {
            var authData = Ref.getAuth();
            $scope.currentUser = $firebaseObject(Ref.child('users').child(authData.uid));
        }
    }

    getAuth();

    $scope.isCurrentPath = function (path) {
      return $location.path() === path;
    };
  });
