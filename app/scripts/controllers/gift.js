'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:GiftCtrl
 * @description
 * # GiftCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('GiftCtrl', function ($scope, $window, $timeout, Ref, $routeParams, GiftSvc, ModalService, $location, toastr, Analytics) {
    $scope.pageClass = 'page-gift';
    //var authData = Ref.getAuth();
    $scope.test = 'https://www.google.com';
    $scope.giftId = $routeParams.id;
    $scope.gift = new GiftSvc($scope.giftId);
    $scope.rate = 7;
    $scope.max = 5;
    $scope.isReadonly = true;

    var giftRef = Ref.child('gifts/' + $scope.giftId);
    var personGift = {};

    //TODO the below needs to be properly async handled using a promise instead of this nasty timeout.
    $timeout(function() {
        personGift = Ref.child('person/' + $scope.gift.createdFor + '/gifts/' + $scope.giftId);
    }, 500);


    $scope.editMode = true;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.edit = function(){
       $scope.editMode = false;
       $scope.isReadonly = false;
    };

    $scope.save = function(gift){
        giftRef.update({
            'title':gift.title,
            'cost':gift.cost || '',
            'description':gift.description || '',
            'url':gift.url || '',
            'interestLevel':gift.interestLevel || '',
            'status':gift.status || ''
        }, trySave);
        $scope.cancel();
    };

    $scope.cancel = function() {
        $scope.editMode = true;
        $scope.isReadyonly = true;
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
            }
        });
      });
    };

    $scope.goToGift = function(url) {
        $window.open(url, '_blank');
    };

    var trySave = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
      } else {
        toastr.success('Changes saved!');
        Analytics.trackEvent('gift', 'edited', $scope.gift.title);
      }
    };

    var tryDelete = function(error) {
      if (error) {
        toastr.error('Oops!', 'An error happened.  Detail: ' + error);
      } else {
        toastr.success('Item deleted');
        Analytics.trackEvent('gift', 'deleted', $scope.gift.title);
      }
    };
  });
