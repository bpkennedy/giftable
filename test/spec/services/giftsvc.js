'use strict';

describe('Service: giftSvc', function () {

  // load the service's module
  beforeEach(module('giftableApp'));

  // instantiate service
  var giftSvc;
  beforeEach(inject(function (_GiftSvc_) {
    giftSvc = _GiftSvc_;
  }));

  it('should do something', function () {
    //expect(!!giftSvc).toBe(true);
  });

});
