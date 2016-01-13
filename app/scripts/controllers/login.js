'use strict';
/**
 * @ngdoc function
 * @name giftableApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('giftableApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, Analytics, toastr, ModalService) {
    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      if (!email) {
          $scope.err = 'Please enter your email address';
      }
      else if (!pass) {
          $scope.err = 'Please enter a password';
      }
      else {
          Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true}).then(
          redirect, showError
        );
      }
    };

    $scope.forgotPassword = function() {
        ModalService.showModal({
          templateUrl: 'views/forgotpassword.html',
          controller: 'ModalCtrl'
        }).then(function(modal) {
          //it's a bootstrap element, use 'modal' to show it
          modal.element.modal();
          modal.close.then(function(result) {
            $scope.formData = result;
            if ($scope.formData !== 'Cancel') {
              console.log('would have reset here');
              console.log(result.email);
              Auth.$resetPassword({
                  email: result.email
              })
              .then(function() {
                  success('Password reset.  Email sent to the specified address with instructions.');
                  $location.path('views/updatePassword.html');
              }, showError);
            }
          });
        });
    };

    $scope.createAccount = function(email, pass, name, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if ( !name ) {
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
        var ref = Ref.child('users/' + user.uid), def = $q.defer();
        ref.set({email: email, name: name}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              toastr.success('Account created');
              Analytics.trackEvent('profile', 'account created', user.uid);
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

    function success(msg) {
      toastr.success(msg);
    }

  });
