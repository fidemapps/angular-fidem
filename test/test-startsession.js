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

    $httpBackend.whenPOST('http://services.fidemapps.com/api/sessions')
      .respond(200, {});

    startSession = function (memberId, done) {
      fidem.startSession(memberId).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (data) {
      $httpBackend.expectPOST(
        'http://services.fidemapps.com/api/sessions',
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

  describe('without member identifier', function () {
    it('should start session without member identifier', function (done) {
      expectRequest({});

      startSession(undefined, done);

      $httpBackend.flush();
    });
  });

  describe('with member identifier', function () {
    it('should start session with a member identifier', function (done) {
      expectRequest({
        member_id: 'MEMBER_ID'
      });

      startSession('MEMBER_ID', done);

      $httpBackend.flush();
    });
  });

});