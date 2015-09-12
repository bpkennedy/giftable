'use strict';

describe('Controller: GiftCtrl', function () {

  // load the controller's module
  beforeEach(module('giftableApp'));

  var GiftCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GiftCtrl = $controller('GiftCtrl', {
      $scope: scope,
      $routeParams: {id:1}
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
