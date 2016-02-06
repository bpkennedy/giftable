'use strict';

describe('Service: postmail', function () {

  // load the service's module
  beforeEach(module('giftableApp'));

  // instantiate service
  var postmail;
  beforeEach(inject(function (_postmail_) {
    postmail = _postmail_;
  }));

  it('should do something', function () {
    expect(!!postmail).toBe(true);
  });

});
