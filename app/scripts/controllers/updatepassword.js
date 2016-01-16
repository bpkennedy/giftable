'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:UpdatepasswordCtrl
 * @description
 * # UpdatepasswordCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('UpdatepasswordCtrl', function ($scope, Auth, Ref, toastr, $location, Analytics) {
      $scope.pageClass = 'page-update-password';
      $scope.updatePassword = function(email, oldPass, newPass, confirm) {
        $scope.err = null;
        if( !oldPass || !newPass ) {
          error('Please enter all fields');
        }
        else if( newPass !== confirm ) {
          error('Passwords do not match');
        }
        else {
          Auth.$changePassword({email: email, oldPassword: oldPass, newPassword: newPass})
            .then(function() {
              success('Password changed.  Redirecting for login...');
              Analytics.trackEvent('profile', 'password changed', email);
            }, error)
            .then(function() {
              $location.path('/login');
            });
        }
      };

      $scope.cancel = function() {
          $location.path('/');
      };

      function error(err) {
        toastr.error(err);
      }

      function success(msg) {
        toastr.success(msg);
      }
  });
