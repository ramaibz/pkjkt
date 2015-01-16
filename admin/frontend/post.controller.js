angular
  .module('pkjkt')
  .controller('BroadcastController', broadcastController);

function broadcastController($http) {
  var vm = this;
  vm.submit = function(stat) {
    var getData = {};
    if(stat === 'training') {
      getData = {
        date: vm.post.date,
        time: vm.post.time,
        place: vm.post.place
      }
    }
    if(stat === 'general') {
      getData = {
        content: vm.post.content
      }
    }

    $http
      .post('/api/post/broadcast/' + stat, getData)
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      })
  }
}
