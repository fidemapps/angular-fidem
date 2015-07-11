/*! Angular fidem | © 2014 Fidem | License MIT */
(function (window, angular, undefined) {
  'use strict';

  /**
   * GeoLocalisation options.
   */

  var geolocOptions = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 30000
  };

  /**
   * Fidem provider.
   * Log action to Fidem API
   */

  angular.module('fidem', []).provider('fidem', function () {

    /**
     * Provider configuration.
     */

    var config = {
      endpoint: null,
      key: null
    };

    /**
     * Define API endpoint.
     *
     * @param {string} endpoint
     * @returns {fidemProvider}
     */

    this.setApiEndpoint = function (endpoint) {
      config.endpoint = endpoint;
      return this;
    };

    /**
     * Define API key.
     *
     * @param {string} key
     * @returns {fidemProvider}
     */

    this.setApiKey = function (key) {
      config.key = key;
      return this;
    };

    /**
     * Interceptors used to modify action before sending it.
     */

    var interceptors = this.interceptors = [];

    /**
     * Fidem service getter.
     */

    this.$get = [
      '$http', '$window', '$q', '$rootScope', '$injector',
      function ($http, $window, $q, $rootScope, $injector) {
        // Fidem service.
        var fidem = {};

        /**
         * Logs an action.
         *
         * @example
         *
         * fidem.log({foo: 'bar'})
         *
         * @param {object} action Action to log
         * @returns {Promise}
         */

        fidem.log = function (action) {
          // Convert action to a promise.
          var promise = $q.when(action);

          // Chain of interceptors.
          var chain = [].concat(interceptors);

          // Push geoloc interceptor at the end.
          chain.push(geolocInterceptor);

          // Apply interceptors.
          angular.forEach(chain, function (interceptor) {
            promise = promise.then(function (action) {
              return interceptor(action, $injector);
            });
          });

          // Post action.
          return promise.then(function (action) {
            return $http.post(config.endpoint + '/api/gamification/actions', action, {
              headers: {
                'X-Fidem-AccessApiKey': config.key
              }
            });
          });
        };

        /**
         * Creates a member.
         *
         * @example
         *
         * fidem.createMember({
         *    email: 'test@test.com',
         *    first_name: 'Bob',
         *    last_name: 'Smith',
         * })
         *
         * @param {Object} member The member to create
         * @returns {Promise}
         */

        fidem.createMember = function (member) {
          return $http.post(config.endpoint + '/api/members', member, {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Starts a session.
         *
         * @example
         *
         * fidem.startSession()
         *
         * @param {string} [memberId] The member identifier
         * @returns {Promise}
         */

        fidem.startSession = function (memberId) {
          var sessionParameters = {};
          if (memberId) {
            sessionParameters.member_id = memberId;
          }
          return $http.post(config.endpoint + '/api/sessions', sessionParameters, {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Assigns a member to a session.
         *
         * @example
         *
         * fidem.assignMemberToSession('sessionIdentifier', 'memberIdentifier')
         *
         * @param {string} sessionId Session identifier
         * @param {string} memberId Member identifier
         * @returns {Promise}
         */

        fidem.assignMemberToSession = function (sessionId, memberId) {
          return $http.put(config.endpoint + '/api/sessions/' + sessionId + '/member/' + memberId, {}, {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets member profile.
         *
         * @example
         *
         * fidem.getMemberProfile('memberIdentifier')
         *
         * @param {string} memberId Member identifier
         * @returns {Promise}
         */

        fidem.getMemberProfile = function (memberId) {
          return $http.get(config.endpoint + '/api/members/' + memberId, {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Adds a link to a member.
         *
         * @example
         *
         * fidem.addLinkToMember('member_id', {
         *    email: 'test@test.com',
         *    first_name: 'Bob',
         *    last_name: 'Smith',
         *    link_reason: 'invite'
         * })
         *
         * @param {string} memberId The member identifier to get the new link
         * @param {Object} link The link data
         * @returns {Promise}
         */

        fidem.addLinkToMember = function (memberId, link) {
          return $http.post(config.endpoint + '/api/members/' + memberId + '/links', link, {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Adds a link to a member.
         *
         * @example
         *
         * fidem.linkMembers('member_id', 'link_member_id', 'invite')
         *
         * @param {string} memberId The member identifier to get the new link
         * @param {string} linkMemberId The link member identifier
         * @param {string} linkReason The link reason
         * @returns {Promise}
         */

        fidem.linkMembers = function (memberId, linkMemberId, linkReason) {
          return $http.put(config.endpoint + '/api/members/' + memberId + '/link/' + linkMemberId, {link_reason: linkReason}, {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets menus.
         *
         * @example
         *
         * fidem.getMenus()
         *
         * @param {string} [memberId] The member identifier
         * @returns {Promise}
         */

        fidem.getMenus = function (memberId) {
          var sessionParameters = {};
          if (memberId) {
            sessionParameters.member_id = memberId;
          }
          return $http.get(config.endpoint + '/api/content/menus', {
            params: sessionParameters,
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets a page.
         *
         * @example
         *
         * fidem.getPage('pageid')
         *
         * @param {string} pageId The page identifier
         * @param {string} [memberId] The member identifier
         * @returns {Promise}
         */

        fidem.getPage = function (pageId, memberId) {
          var sessionParameters = {};
          if (memberId) {
            sessionParameters.member_id = memberId;
          }
          return $http.get(config.endpoint + '/api/content/pages/' + pageId, {
            params: sessionParameters,
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets a news list.
         *
         * @example
         *
         * fidem.getNewsList('newsListId')
         *
         * @param {string} newsListId The news list identifier
         * @param {string} [memberId] The member identifier
         * @returns {Promise}
         */

        fidem.getNewsList = function (newsListId, memberId) {
          var sessionParameters = {};
          if (memberId) {
            sessionParameters.member_id = memberId;
          }
          return $http.get(config.endpoint + '/api/content/newslists/' + newsListId, {
            params: sessionParameters,
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets member challenges.
         *
         * @example
         *
         * fidem.getMemberChallenges('memberIdentifier')
         *
         * @param {string} memberId Member identifier
         * @returns {Promise}
         */

        fidem.getMemberChallenges = function (memberId) {
          return $http.get(config.endpoint + '/api/members/' + memberId + '/challenges', {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets member challenges done.
         *
         * @example
         *
         * fidem.getMemberChallengesDone('memberIdentifier')
         *
         * @param {string} memberId Member identifier
         * @returns {Promise}
         */

        fidem.getMemberChallengesDone = function (memberId) {
          return $http.get(config.endpoint + '/api/members/' + memberId + '/challenges/done', {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * Gets member challenges todo.
         *
         * @example
         *
         * fidem.getMemberChallengesTodo('memberIdentifier')
         *
         * @param {string} memberId Member identifier
         * @returns {Promise}
         */

        fidem.getMemberChallengesTodo = function (memberId) {
          return $http.get(config.endpoint + '/api/members/' + memberId + '/challenges/todo', {
            headers: {
              'X-Fidem-AccessApiKey': config.key
            }
          });
        };

        /**
         * GeoLocalisation interceptor.
         *
         * @param {object} action
         * @returns {object|Promise}
         */

        function geolocInterceptor(action) {
          // If not supported, do nothing.
          if (!$window.navigator || !$window.navigator.geolocation) {
            action.coordinates = null;
            return action;
          }

          var deferred = $q.defer();

          $window.navigator.geolocation.getCurrentPosition(function success(position) {
            // In case of success, we add coordinates to the action.
            $rootScope.$apply(function () {
              action.coordinates = {
                lat: position.coords.latitude,
                long: position.coords.longitude
              };

              deferred.resolve(action);
            });
          }, function error() {
            // In case of error, we set coordinates to null.
            $rootScope.$apply(function () {
              action.coordinates = null;
              deferred.resolve(action);
            });
          }, geolocOptions);

          return deferred.promise;
        }

        return fidem;
      }
    ];
  });

})(window, window.angular);