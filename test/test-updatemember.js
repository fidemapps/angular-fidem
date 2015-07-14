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

    $httpBackend.whenPUT('http://services.fidemapps.com/api/members/MEMBER_ID')
      .respond(200, {});

    updateMemberProfile = function (memberId, member, done) {
      fidem.updateMemberProfile(memberId, member).then(function () {
        done();
      });
      $rootScope.$digest();
    };

    expectRequest = function (data) {
      $httpBackend.expectPUT(
        'http://services.fidemapps.com/api/members/MEMBER_ID',
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

  describe('call updateMember', function () {
    it('should update the member', function (done) {
      expectRequest({"email": "test@test.com"});

      updateMemberProfile('MEMBER_ID', {email: 'test@test.com'}, done);

      $httpBackend.flush();
    });
  });
});