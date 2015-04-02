var expect = chai.expect;

describe('Fidem provider', function () {
  var fidem, $httpBackend, $window, $rootScope, $q, $timeout, interceptors,
    logAction, expectRequest;

  beforeEach(module('fidem', function (fidemProvider, $provide) {
    fidemProvider.setApiEndpoint('http://services.fidemapps.com');
    fidemProvider.setApiKey('myApiKey');
    interceptors = fidemProvider.interceptors;

    $provide.value('$window', {
      config: 'myConfig',
      navigator: {}
    });
  }));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    fidem = $injector.get('fidem');
    $window = $injector.get('$window');
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');

    $httpBackend.whenPUT('http://services.fidemapps.com/api/members/MEMBER_ID/link/LINK_MEMBER_ID')
      .respond(200, {});

    linkMembers = function (memberId, linkMemberId, reason, done) {
      fidem.linkMembers(memberId, linkMemberId, reason).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (data) {
      $httpBackend.expectPUT(
        'http://services.fidemapps.com/api/members/MEMBER_ID/link/LINK_MEMBER_ID',
        data,
        function (headers) {
          return headers['X-Fidem-AccessApiKey'] === 'myApiKey';
        }
      );
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('call addLinkMembers', function () {
    it('should assign link members', function (done) {
      expectRequest({"link_reason": "LINK_REASON"});

      linkMembers('MEMBER_ID', 'LINK_MEMBER_ID', 'LINK_REASON', done);

      $httpBackend.flush();
    });
  });
});