
console.log("JS-ANGULAR LOADED");
var dashboardApp = angular.module('dashboardApp', [], function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

dashboardApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
    ])
});

dashboardApp.controller('mainController', function($scope, $http) {

  $scope.getTrustedUploadSrc = function(id) {
    return "/upload/" + id;
  };

  $scope.sortType = 't';  // set the default sort type
  $scope.sortReverse = true;    // set the default sort order

  $scope.showAddUserModal = false;
  $scope.showDelUserModal = false;
  // modal content
  $scope.modalId = '';
  $scope.modalUsername = '';
  $scope.modalPassword = '';

  $scope.showModal = function(checker) {
    $scope.showAddUserModal = false;
    $scope.showDelUserModal = false;
    $scope.modalId = '';
    $scope.modalUsername = checker.username;
    $scope.modalPassword = checker.password;
  }

  $scope.modalAddUserShow = function() {
    $scope.showAddUserModal = true;
    $scope.showDelUserModal = false;
  }

  $scope.delUsers = [ "hi ho" ];
  $scope.selectUsers = 0;

  $scope.modalDelUser = function(data) {
    console.log("DELETE USER CLICKED");
    var arr = [];
    for(var i in data) {
        if(data[i].SELECTED=='Y'){
            arr.push(data[i]);
        }
    }
    $scope.delUsers = arr;
    console.log("Delete users: " + $scope.delUsers);
    $scope.showAddUserModal = false;
    $scope.showDelUserModal = true;
  }

  $scope.updateSelectCount = function(data) {
      var cnt = 0;
      for(var i in data) {
        if(data[i].SELECTED=='Y'){
            cnt++;
        }
      }
      $scope.selectUsers = cnt;
      console.log($scope.delUsers);
  }

  $http.get("get_settings_contexts/", {params: {}})
          .success(function(response) {
              console.log("success");
              var obj_mod = JSON.parse(response.mod);

              $scope.checkers = obj_mod;
            })
            .error(function(response){
                console.log("failed");
            });
  // Dummy frontend data
  // $scope.checkers =
  // [
  // {
  //   'firstName': 'Hordy',
  //   'lastName': 'Mojica',
  //   'email': 'hordy_mojica@dlsu.edu.ph',
  //   'username': 'hordymojica',
  //   'password': 'encrypted',
  //   'postActsChecked': '43'
  // },
  // {
  //   'firstName': 'Julianne',
  //   'lastName': 'Sy',
  //   'email': 'julianne_sy@dlsu.edu.ph',
  //   'username': 'juliannesy',
  //   'password': 'encrypted',
  //   'postActsChecked': '3'
  // },
  // {
  //   'firstName': 'Marca',
  //   'lastName': 'Piña',
  //   'email': 'marca_pina@dlsu.edu.ph',
  //   'username': 'marcapina',
  //   'password': 'encrypted',
  //   'postActsChecked': '16'
  // },
  // {
  //   'firstName': 'Andrew',
  //   'lastName': 'Boni',
  //   'email': 'andrew_boni@dlsu.edu.ph',
  //   'username': 'andrew.boni',
  //   'password': 'encrypted',
  //   'postActsChecked': '55'
  // },
  // ];
});