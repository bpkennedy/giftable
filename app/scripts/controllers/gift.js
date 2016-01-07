'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:GiftCtrl
 * @description
 * # GiftCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('GiftCtrl', function ($scope, $timeout, Ref, $routeParams, GiftSvc, ModalService, $location, toastr) {
    //var authData = Ref.getAuth();
    $scope.giftId = $routeParams.id;
    $scope.gift = new GiftSvc($scope.giftId);
    var giftRef = Ref.child('gifts/' + $scope.giftId);
    var personGift = {};
    //TODO the below needs to be properly async handled using a promise instead of this nasty timeout.
    $timeout(function() {
        personGift = Ref.child('person/' + $scope.gift.createdFor + '/gifts/' + $scope.giftId);
    }, 500);


    $scope.editMode = true;
    $scope.edit = function(){
       $scope.editMode = false;
       // Your code here and set it to false when your are done with it
   };
    $scope.save = function(gift){
        console.log($scope.giftForm.$error);
        console.log(gift);
        giftRef.update({
            'title':gift.title,
            'cost':gift.cost || '',
            'description':gift.description || '',
            'interestLevel':gift.interestLevel || '',
            'status':gift.status || ''
        }, trySave);
        $scope.cancel();
    };
    $scope.cancel = function() {
        $scope.editMode = true;
    };
    $scope.return = function(createdFor) {
        $location.path('/person/' + createdFor);
    };
    $scope.delete = function() {
        var personView = $scope.gift.createdFor;
        personGift.remove(tryDelete);
        giftRef.remove(tryDelete);
        $scope.return(personView);
    };

    $scope.deleteItem = function() {
      ModalService.showModal({
        templateUrl: 'views/confirm.html',
        controller: 'ModalCtrl'
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        modal.close.then(function(result) {
            if (result.confirm === 'yes') {
                $scope.delete();
            } else {
                console.log('said no');
            }
        });
      });
    };

    var trySave = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
        console.log('Synchronization failed');
      } else {
        toastr.success('Changes saved!');
        console.log('Synchronization succeeded');
      }
    };

    var tryDelete = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
        console.log('Synchronization failed');
      } else {
        toastr.success('Item deleted');
        console.log('Synchronization succeeded');
      }
    };
  });
