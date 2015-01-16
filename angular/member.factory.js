// Resource
angular
  .module('pkjkt')
  .factory('UserData', userFactory)

function userFactory($resource) {
  return $resource('/api/member/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  })
}

// Member
angular
  .module('pkjkt')
  .factory('Profile', setProfile);

function setProfile($http, $q, $window) {
  var dataService = {};
  dataService.getProfile = function() {
    var datapromise = $q.defer();
    $http
      .get('/api/profile')
      .success(function (data) {
        datapromise.resolve(data);
      })
    return datapromise.promise;
  }
  dataService.getFbToken = function() {
    return $http
      .get('/fbtoken')
      .success(function(data) {
        $window.localStorage.token = data.token;
      })
      .error(function(data) {
        console.log(data);
      })
  }
  return dataService;
}
