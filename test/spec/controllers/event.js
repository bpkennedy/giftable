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

  describe('On init', function () {
      it('scope page class to be page-event', function () {
        expect(scope.pageClass).toBe('page-event');
      });
      it('scope edit mode to be true by default', function () {
        expect(scope.editMode).toBe(false);
      });
      it('scope eventId should be routeParam', function () {
        expect(scope.eventId).toBe(1);
      });
      it('scope status opened should be false', function () {
        expect(scope.status.opened).toBe(false);
      });
      it('open notification should set status to openedNotification', function () {
        scope.openNotification();
        expect(scope.status.openedNotification).toBe(true);
      });
      it('open event should set status to openedEventTime', function () {
        scope.openEvent();
        expect(scope.status.openedEventTime).toBe(true);
      });
      it('should have editMode false by default and true on edit', function () {
        expect(scope.editMode).toBe(false);
        scope.edit();
        expect(scope.editMode).toBe(true);
      });
      it('should set edit mode to Cancel when cancel', function () {
        scope.editMode = true;
        scope.cancel();
        expect(scope.editMode).toBe(false);
      });
  });

});
