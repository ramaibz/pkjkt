function articleController($http, ArticleService) {
  var vm = this;
  vm.article = {};
  CKEDITOR.replace('articlecontent');

  $(document).foundation();

  vm.preview = function() {
    vm.article.content = CKEDITOR.instances.articlecontent.getData();
  }

  vm.saveArticle = function() {
    var newArticle = new ArticleService({
      title: vm.article.title,
      tags: vm.article.tags,
      content: CKEDITOR.instances.articlecontent.getData()
    });

    newArticle.$save(function(response) {
      vm.article = {};
      vm.getArticles();
    }, function(err) {
      vm.notif = JSON.stringify(err);
    });
  }

  vm.getArticles = function() {
    ArticleService.query(function(data) {
        vm.articles = data;
      }, function(error) {
        vm.notif = error;
      });
  }

  vm.getArticles();

}

angular
  .module('pkjkt')
  .controller('ArticleController', articleController);

angular.module('pkjkt')
  .filter('trusted', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]);

angular
  .module('pkjkt')
  .filter('arrayToString', function() {
    return function(stat) {
      var newArr = [];
      for(var i = 0; i < stat.length; i++) {
        newArr[i] = '<a ui-sref=tags/'+ stat[i] +'>' + stat[i] + '</a>';
      }
      return newArr.join(', ') || 'Error';
    };
  });
