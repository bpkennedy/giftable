'use strict';

describe('Service: eventSvc', function () {

  // load the service's module
  beforeEach(module('giftableApp', 'firebase'));

  // instantiate service
  var eventSvc;
  beforeEach(inject(function (_EventSvc_) {
    eventSvc = _EventSvc_;
  }));

  it('should do something', function () {
    //expect(!!eventSvc).toBe(true);
  });

});
