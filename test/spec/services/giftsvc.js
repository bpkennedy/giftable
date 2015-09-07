'use strict';

describe('Service: giftSvc', function () {

  // load the service's module
  beforeEach(module('giftableApp'));

  // instantiate service
  var giftSvc;
  beforeEach(inject(function (_giftSvc_) {
    giftSvc = _giftSvc_;
  }));

  it('should do something', function () {
    expect(!!giftSvc).toBe(true);
  });

});
