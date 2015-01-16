angular
  .module('pkjkt')
  .controller('LoginController', loginController);

function loginController($http, $window, $location) {
  var vm = this;

  vm.submit = function() {
    $http
      .post('/auth/local', vm.member)
      .success(function (data, status, headers, config) {
        $window.localStorage.token = data.token;
        $window.localStorage.login = 'local';
        $window.location.href = '/you-re/in/the/menu';
      })
      .error(function (data, status, headers, config) {
        $window.localStorage.clear();
        vm.notif = data;
      })
  }

  vm.facebookLogin = function() {
    $window.localStorage.login = 'facebook';
    $window.location.href = '/auth/facebook';
  }

  vm.getss = function() {
    vm.tokenvalue = $window.localStorage;
    $http
      .get('/api/testdrive/me')
      .success(function (data, status, headers, config) {
        console.log(data.username);
      })
      //delete $window.localStorage.clear();
  }
}


