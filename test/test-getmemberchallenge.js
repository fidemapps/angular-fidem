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

    $httpBackend.whenGET('http://services.fidemapps.com/api/member/MEMBER_ID/challenges')
      .respond(200, {});

    getMemberChallenges = function (done) {
      fidem.getMemberChallenges('MEMBER_ID').then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function () {
      $httpBackend.expectGET(
        'http://services.fidemapps.com/api/member/MEMBER_ID/challenges',
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

  describe('call getMemberChallenges', function () {
    it('should get member challenges', function (done) {
      expectRequest();

      getMemberChallenges(done);

      $httpBackend.flush();
    });
  });
});