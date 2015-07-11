var expect = chai.expect;

describe('Fidem provider', function () {
  var fidem, $httpBackend, $window, $rootScope, $q, $timeout, interceptors,
    logAction, expectRequest;

  beforeEach(module('fidem', function (fidemProvider, $provide) {
    fidemProvider.setApiEndpoint('http://dev-services.fidemapps.com');
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

    $httpBackend.whenPOST('http://dev-services.fidemapps.com/api/members')
      .respond(200, {});

    createMember = function (member, done) {
      fidem.createMember(member).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (data) {
      $httpBackend.expectPOST(
        'http://dev-services.fidemapps.com/api/members',
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

  describe('call createMember', function () {
    it('should create member', function (done) {
      expectRequest({email: 'test@test.com'});

      createMember({email: 'test@test.com'}, done);

      $httpBackend.flush();
    });
  });
});