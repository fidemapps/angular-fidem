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

    $httpBackend.whenGET('http://services.fidemapps.com/api/contests?memberId=MEMBER_ID')
      .respond(200, {});

    getContests = function (memberId, done) {
      fidem.getContests(memberId).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (memberId) {
      var url = 'http://services.fidemapps.com/api/contests?memberId=' + memberId;
      $httpBackend.expectGET(url,
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

  describe('get member contests', function () {
    it('should get contest', function (done) {
      expectRequest('MEMBER_ID');

      getContests('MEMBER_ID', done);

      $httpBackend.flush();
    });
  });

});