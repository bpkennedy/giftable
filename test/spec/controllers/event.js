'use strict';

describe('Controller: EventCtrl', function () {

  // load the controller's module
  beforeEach(module('giftableApp'));

  var EventCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventCtrl = $controller('EventCtrl', {
      $scope: scope,
      $routeParams: {id:1}
    });
  }));

  it('should find some number', function () {
    expect(true).toBe(true);
  });
});
