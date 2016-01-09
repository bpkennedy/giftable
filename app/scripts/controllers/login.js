'use strict';
/**
 * @ngdoc function
 * @name giftableApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('giftableApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, displayName, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if ( !displayName ) {
          $scope.err = 'Please enter a display name';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUser({email: email, password: pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
          })
          .then(createProfile)
          .then(redirect, showError);
      }

      function createProfile(user) {
         console.log('inside createProfile');
         console.log(user.uid);
        var ref = Ref.child('users/' + user.uid), def = $q.defer();
        ref.set({email: email, name: displayName}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(ref);
            }
          });
        });
        return def.promise;
      }
    };

    function redirect() {
      $location.path('/people');
    }

    function showError(err) {
        if (err) {
            switch (err.code) {
              case 'INVALID_EMAIL':
                $scope.err = 'Email is invalid.';
                break;
              case 'INVALID_PASSWORD':
                $scope.err = 'Password incorrect.';
                break;
              case 'INVALID_USER':
                $scope.err = 'User account does not exist.';
                break;
              case 'EMAIL_TAKEN':
                $scope.err = 'Email already taken.';
                break;
              case 'NETWORK_ERROR':
                $scope.err = 'An error occurred while attempting to contact the authentication server.';
                break;
              default:
                $scope.err = 'Error logging user in:' + err;
            }
        }
    }


  });
