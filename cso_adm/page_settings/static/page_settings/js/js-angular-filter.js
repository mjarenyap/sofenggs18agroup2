
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

  // modal content
  $scope.modalUsername = '';
  $scope.modalPassword = '';

  $scope.showModal = function(checker) {
    $scope.modalUsername = checker.username;
    $scope.modalPassword = checker.password;
  }

  // Dummy frontend data
  $scope.checkers =
  [
  {
    'firstName': 'Hordy',
    'lastName': 'Mojica',
    'email': 'hordy_mojica@dlsu.edu.ph',
    'username': 'hordymojica',
    'password': 'encrypted',
    'postActsChecked': '43'
  },
  {
    'firstName': 'Julianne',
    'lastName': 'Sy',
    'email': 'julianne_sy@dlsu.edu.ph',
    'username': 'juliannesy',
    'password': 'encrypted',
    'postActsChecked': '3'
  },
  {
    'firstName': 'Marca',
    'lastName': 'Piña',
    'email': 'marca_pina@dlsu.edu.ph',
    'username': 'marcapina',
    'password': 'encrypted',
    'postActsChecked': '16'
  },
  {
    'firstName': 'Andrew',
    'lastName': 'Boni',
    'email': 'andrew_boni@dlsu.edu.ph',
    'username': 'andrew.boni',
    'password': 'encrypted',
    'postActsChecked': '55'
  },
  ];
});
