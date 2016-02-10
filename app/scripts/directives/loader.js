'use strict';

/**
 * @ngdoc directive
 * @name giftableApp.directive:loader
 * @description
 * # loader
 */
angular.module('giftableApp')
  .directive('loader', function () {
    return {
        restrict: 'EA',
        templateUrl: '/scripts/directives/loader.html',
        controller: 'LoaderCtrl',
        // note: This would be 'ExampleController' (the exported controller name, as string)
        // if referring to a defined controller in its separate file.
        bindToController: true // because the scope is isolated
    };
  });

angular.module('giftableApp').controller('LoaderCtrl', function ($scope, loaderSvc) {
    $scope.loaderProperties = loaderSvc.getLoadingStatus;
});

angular.module('giftableApp').factory('loaderSvc', function() {
    var loaderProperties = {
        isLoading: false,
        loadMsg: 'Loading...'
    };

    function toggleOn(msg) {
        loaderProperties.isLoading = true;
        loaderProperties.loadMsg = msg ? msg : 'Loading';
    }

    function toggleOff() {
        loaderProperties.isLoading = false;
        loaderProperties.loadMsg = '';
    }

    function getLoadingStatus() {
        return loaderProperties;
    }

    return {
        getLoadingStatus: getLoadingStatus,
        toggleOn: toggleOn,
        toggleOff: toggleOff
    };
});
