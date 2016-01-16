'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('PeopleCtrl', function ($scope, toastr, Ref, $firebaseArray, $timeout, $location, ModalService, Analytics) {
    $scope.pageClass = 'page-people';

    var authData = Ref.getAuth();
    $scope.people = [];
    $timeout(function() {
      $scope.people = $firebaseArray(Ref.child('person').orderByChild('createdBy').equalTo(authData.uid));
      $scope.people.$loaded().catch(alert);
    });

    $scope.goToPerson = function(personId) {
      if (personId) {
        $location.path('/person/' + personId);
      }
    };

    $scope.addGiftee = function() {
      ModalService.showModal({
        templateUrl: 'views/addGiftee.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.formData = result;
          if ($scope.formData !== 'Cancel') {
            $scope.people.$add({
                firstName: result.firstName,
                lastName: result.lastName,
                city: result.city || '',
                state: result.state || '',
                address: result.address || '',
                zipcode: result.zipcode || '',
                createdAt: new Date().toJSON(),
                createdBy: authData.uid
            })
              .catch(alert).then(function(){
                toastr.success('Giftee created!');
                Analytics.trackEvent('giftee', 'added', result.firstName + result.lastName);
              });
          }
        });
      });
    };

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }

  });
