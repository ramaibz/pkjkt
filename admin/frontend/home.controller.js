function homeController($window, Profile) {
  var vm = this;

  var setProfile = function() {
    Profile.getProfile().then(function(data) {
        vm.profil = data.name;
        vm.test = data.role;
      });
  }

  $window.localStorage.login === 'facebook'
    ? Profile.getFbToken().then(setProfile)
    : setProfile();

  vm.logOut = function() {
    $window.localStorage.clear();
    $window.location.href = '/anggota';
  }
}

angular
  .module('pkjkt')
  .controller('HomeController', homeController);
