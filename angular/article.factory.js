angular
  .module('pkjkt')
  .factory('ArticleService', articleService)

function articleService($resource) {
  return $resource('/api/article/:id', { id: '@_id'}, {
    update: {
      method: 'PUT'
    }
  })
}
