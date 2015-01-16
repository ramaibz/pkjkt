angular
  .module('pkjkt')
  .factory('AuthInterceptor', authInterceptor)
  .config(interceptor)

  // JWT Client Side
  function authInterceptor($rootScope, $q, $window) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config
      },
      response: function (response) {
        if (response != null && response.status == 200) {
            //console.log(response)
        }
        return response || $q.when(response);
      },

    /* Revoke client authentication if 401 is received */
      responseError: function(rejection) {
        if (rejection != null && rejection.status === 401) {
          //console.log(rejection);
        }

        return $q.reject(rejection);
    }
    }
  }

  function interceptor($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor')
  }
