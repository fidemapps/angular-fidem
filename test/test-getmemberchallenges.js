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

    $httpBackend.whenGET('http://services.fidemapps.com/api/members/MEMBER_ID/challenges')
      .respond(200, {});
    $httpBackend.whenGET('http://services.fidemapps.com/api/members/MEMBER_ID/challenges/done')
      .respond(200, {});
    $httpBackend.whenGET('http://services.fidemapps.com/api/members/MEMBER_ID/challenges/todo')
      .respond(200, {});

    getMemberChallenges = function (done) {
      fidem.getMemberChallenges('MEMBER_ID').then(function () {
        done();
      });
      $rootScope.$digest();
    };

    getMemberChallengesDone = function (done) {
      fidem.getMemberChallengesDone('MEMBER_ID').then(function () {
        done();
      });
      $rootScope.$digest();
    };

    getMemberChallengesTodo = function (done) {
      fidem.getMemberChallengesTodo('MEMBER_ID').then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (path) {
      $httpBackend.expectGET(
        'http://services.fidemapps.com/api/members/MEMBER_ID/challenges' + path,
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
      expectRequest('');

      getMemberChallenges(done);

      $httpBackend.flush();
    });
  });

  describe('call getMemberChallengesDone', function () {
    it('should get member challenges done', function (done) {
      expectRequest('/done');

      getMemberChallengesDone(done);

      $httpBackend.flush();
    });
  });

  describe('call getMemberChallengesTodo', function () {
    it('should get member challenges todo', function (done) {
      expectRequest('/todo');

      getMemberChallengesTodo(done);

      $httpBackend.flush();
    });
  });
});