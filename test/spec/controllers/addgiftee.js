'use strict';

describe('Controller: AddgifteeCtrl', function () {

  // load the controller's module
  beforeEach(module('giftableApp'));

  var AddgifteeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddgifteeCtrl = $controller('AddgifteeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
