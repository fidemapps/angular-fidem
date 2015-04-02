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

    $httpBackend.whenPUT('http://services.fidemapps.com/api/sessions/SESSION_ID/member/MEMBER_ID')
      .respond(200, {});

    assignMemberToSession = function (sessionId, memberId, done) {
      fidem.assignMemberToSession(sessionId, memberId).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (data) {
      $httpBackend.expectPUT(
        'http://services.fidemapps.com/api/sessions/SESSION_ID/member/MEMBER_ID',
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

  describe('call assignMemberToSession', function () {
    it('should assign member to session', function (done) {
      expectRequest({});

      assignMemberToSession('SESSION_ID', 'MEMBER_ID', done);

      $httpBackend.flush();
    });
  });
});