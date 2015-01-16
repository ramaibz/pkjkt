function memberController(UserData) {
  var vm = this;
  vm.members = {};
  vm.member = new UserData;

  vm.memberData = function() {
    return UserData.query(function(data) {
      vm.members = data;
    }, function(error) {
      alert(err);
    });
  }

  vm.selectedVal = [];

  vm.selectionToggle = function toggleSelect(id) {
    var idx = vm.selectedVal.indexOf(id);
    if(idx > -1) {
      vm.selectedVal.splice(idx, 1);
    }
    else {
      vm.selectedVal.push(id);
    }
    console.log(vm.selectedVal);
  }

  vm.deleteMember = function(member) {
    if(vm.selectedVal.length !== 0) {
      for(var i = 0; i < vm.selectedVal.length; i++) {
        UserData.delete({ id: vm.selectedVal[i] }, function() {
          vm.memberData();
        });
      }
    }
  }

  vm.approveMember = function() {
    if(vm.selectedVal.length !== 0) {
      for(var i = 0; i < vm.selectedVal.length; i++) {
        UserData.update({ id: vm.selectedVal[i] }, { status: 1 }, function() {
          vm.memberData();
        });
      }

    }
  }

  vm.rejectMember = function() {
    if(vm.selectedVal.length !== 0) {
      for(var i = 0; i < vm.selectedVal.length; i++) {
        UserData.update({ id: vm.selectedVal[i] }, { status: 2 }, function() {
          vm.memberData();
        });
      }
      vm.memberData();
    }
  }

  vm.memberData();
};

angular
  .module('pkjkt')
  .controller('MemberController', memberController);

angular
  .module('pkjkt')
  .filter('status', function() {
    var statusDetails = {
      0 : 'Waiting for approval',
      1 : 'Approved',
      2 : 'Rejected'
    };

    return function(stat) {
      return statusDetails[stat] || 'Error';
    };
  });
