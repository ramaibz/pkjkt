function routes($stateProvider, $urlRouterProvider, $locationProvider) {
  var defaultUrl = window.location.pathname;
  var finalUrl = defaultUrl.replace(new RegExp('/[^/]*$'), '/');

  //$urlRouterProvider.otherwise('/');
  $stateProvider
    .state('menu', {
      url: finalUrl + 'menu',
      templateUrl: '/views/partial/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'vm'
    })
    .state('addArticle', {
      url: finalUrl + 'article',
      templateUrl: '/views/partial/articles.html',
      controller: 'ArticleController',
      controllerAs: 'vm'
    })
    .state('addPhotos', {
      url: finalUrl + 'photos',
      templateUrl: '/views/partial/photos.html',
      controller: 'PhotosController',
      controllerAs: 'vm'
    })
    .state('member', {
      url: finalUrl + 'member',
      templateUrl: '/views/partial/member.html',
      controller: 'MemberController',
      controllerAs: 'vm'
    })
    .state('broadcast', {
      url: finalUrl + 'broadcast',
      templateUrl: '/views/partial/broadcast.html',
      controller: 'BroadcastController',
      controllerAs: 'vm'
    })

  $locationProvider.html5Mode(true);
}
