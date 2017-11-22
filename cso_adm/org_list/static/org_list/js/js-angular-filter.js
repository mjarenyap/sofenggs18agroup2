var root = 'https://jsonplaceholder.typicode.com';

console.log("org-list angular js LOADED");
var dashboardApp = angular.module('dashboardApp', [], function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

dashboardApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
    ])
});

dashboardApp.controller('mainController', function($scope, $http, $window) {

  var transformSearch = function(item) {
    if(!item)
        return null;
    var str = item;
    var searchLen = str.length;
    var s = 0;

    for(var i = 0; i < searchLen; i++) {
        if(str.charAt(s) == '[' || str.charAt(s) == ']' || str.charAt(s) == '^' || str.charAt(s) == '$' ||
            str.charAt(s) == '.' || str.charAt(s) == '|' || str.charAt(s) == '?' || str.charAt(s) == '+' ||
            str.charAt(s) == '(' || str.charAt(s) == ')' || str.charAt(s) == '{' || str.charAt(s) == '}' ||
            str.charAt(s) == '\\') {

            if(s == 0) {
                str = "\\" + str.toString();
            }
            else {
                str = str.toString().slice(0, s) + "\\" + str.toString().slice(s);
            }

            s++;
        }
        s++;
    }

    return str;
  }
  var include = function(item, val) {

    if(!val)
      return true;

    var regex = new RegExp('.*(' + val + ').*', 'i');

    return item.n.search(regex) == 0;
  };

  var searchCluster = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.cluster.search(regex) == 0;
  };

  $scope.showOrg = function(org) {
      console.log("show org");
      console.log(org);
      console.log(org.short);
      $window.location.href = '/organization/' + org.abbreviation;
      // $location.path('/organization/' + org.abbreviation);

  }

  $scope.getTrustedUploadSrc = function(id) {
    return "/upload/" + id;
  };

  $scope.sortType = 'orgName';  // set the default sort type
  $scope.sortReverse = false;    // set the default sort order

  // Checks all filters
  $scope.filters = function(org) {
    console.log("Checking Filters");
    // console.log(postact.timestamp.split('/')[2].split(' ')[0]);

    if(!$scope.filterCluster && !$scope.filterSearchOrg)
      return true;

    return include(org, transformSearch($scope.filterSearchOrg)) && searchCluster(org, $scope.filterCluster);
  };

  $http.get("get_org_list_contexts/", {params: {}})
          .success(function(response) {
              console.log("success");
              $scope.org_data = JSON.parse(response.data_set);
              $scope.orgList = JSON.parse(response.orgs);
              $scope.clusterList = JSON.parse(response.cluster);
            })
            .error(function(response){
                console.log("failed");
            });

});
