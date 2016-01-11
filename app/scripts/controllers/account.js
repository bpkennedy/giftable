'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('giftableApp')
  .controller('AccountCtrl', function ($scope, user, Auth, Ref, $firebaseObject, $timeout, toastr, Analytics) {
    $scope.user = user;
    $scope.logout = function() { Auth.$unauth(); };
    $scope.messages = [];
    var profile = $firebaseObject(Ref.child('users/'+user.uid));
    profile.$bindTo($scope, 'profile');


    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        Auth.$changePassword({email: profile.email, oldPassword: oldPass, newPassword: newPass})
          .then(function() {
            success('Password changed');
            Analytics.trackEvent('profile', 'password changed', user.uid);
          }, error);
      }
    };

    $scope.save = function() {
        success('Display Name changed!');
        Analytics.trackEvent('profile', 'display name changed', user.uid);
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: profile.email})
        .then(function() {
          profile.email = newEmail;
          profile.$save();
          success('Email changed');
          Analytics.trackEvent('profile', 'email changed', user.uid);
        })
        .catch(error);
    };

    function error(err) {
      toastr.error(err);
    }

    function success(msg) {
      toastr.success(msg);
    }

  });
