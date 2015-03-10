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

    $httpBackend.whenGET('http://services.fidemapps.com/api/content/page/PAGE_ID')
      .respond(200, {});
    $httpBackend.whenGET('http://services.fidemapps.com/api/content/page/PAGE_ID?member_id=MEMBER_ID')
      .respond(200, {});

    getPage = function (memberId, done) {
      fidem.getPage('PAGE_ID', memberId).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (data) {
      var url = 'http://services.fidemapps.com/api/content/page/PAGE_ID';
      if (data) {
        url = url + '?member_id=' + data;
      }
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

  describe('without member identifier', function () {
    it('should get page without member identifier', function (done) {
      expectRequest();

      getPage(undefined, done);

      $httpBackend.flush();
    });
  });

  describe('with member identifier', function () {
    it('should get page with a member identifier', function (done) {
      expectRequest('MEMBER_ID');

      getPage('MEMBER_ID', done);

      $httpBackend.flush();
    });
  });

});