'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('NavCtrl', function ($scope, $location, Ref, $firebaseObject, $firebaseAuth) {
    var auth = $firebaseAuth(Ref);
    auth.$onAuth(function(authData){
        $scope.currentUser = $firebaseObject(Ref.child('users').child(authData.uid));

    }); // Check user status

    $scope.isCurrentPath = function (path) {
      return $location.path() === path;
    };
  });
