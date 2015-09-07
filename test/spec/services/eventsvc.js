'use strict';

describe('Service: eventSvc', function () {

  // load the service's module
  beforeEach(module('giftableApp'));

  // instantiate service
  var eventSvc;
  beforeEach(inject(function (_eventSvc_) {
    eventSvc = _eventSvc_;
  }));

  it('should do something', function () {
    expect(!!eventSvc).toBe(true);
  });

});
