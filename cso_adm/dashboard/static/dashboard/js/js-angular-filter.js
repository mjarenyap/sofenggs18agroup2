var root = 'https://jsonplaceholder.typicode.com';

console.log("NG-TABLE LOADED");
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

  $scope.unchecked = 100;

  $scope.getUnchecked = function() {
      if($scope.unchecked >= 100) {
          return '99+';
      } else {
          $scope.unchecked;
      }
  }

  $scope.uncheckedOnly = false;

  $scope.toggleUncheckedOnly = function() {
      $scope.uncheckedOnly = !$scope.uncheckedOnly;
  }

  var include = function(item, val) {

    if(!val)
      return true;

    var regex = new RegExp('.*(' + val + ').*', 'i');

    return item.n.search(regex) == 0;
  };

  var searchUnchecked = function(item) {
    if($scope.uncheckedOnly)
        return item.cb == '';
    else return true;
  };

  var searchMonth = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');
    var month = item.t.split('/')[1];
    console.log("Search month: " + month);

    if(month)
        return month.search(regex) == 0;
    else
        return false;
  };

  var searchOrg = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.o.search(regex) == 0;
  };

  var searchTerm = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.term.search(regex) == 0;
  };

  var searchType = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.st.search(regex) == 0;
  };

  var searchStatus = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.s.search(regex) == 0;
  };

  var searchChecker = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.cb.search(regex) == 0;
  };

  $scope.getTrustedUploadSrc = function(id) {
    return "/upload/" + id;
  };

  $scope.sortType = 't';  // set the default sort type
  $scope.sortReverse = true;    // set the default sort order

  $scope.filterTerm = defaultTerm.split(' ')[1];
  // Checks all filters
  $scope.filters = function(postact) {
    // console.log("Checking Filters");
    // console.log(postact.timestamp.split('/')[2].split(' ')[0]);

    if(!$scope.filterSearch && !$scope.filterMonth && !$scope.filterTerm && !$scope.filterType && !$scope.filterStatus && !$scope.filterChecker && !$scope.filterOrg)
      return true;


    return include(postact, transformSearch($scope.filterSearch)) && searchUnchecked(postact) &&
        searchMonth(postact, $scope.filterMonth) && searchTerm(postact, $scope.filterTerm) &&
        searchType(postact, $scope.filterType) && searchStatus(postact, $scope.filterStatus) &&
        searchChecker(postact, $scope.filterChecker) && searchOrg(postact, $scope.filterOrg);
  };

  // modal content
  $scope.modalObj = null;
  $scope.modalId = '';
  $scope.modalActivity = '';
  $scope.modalOrg = '';
  $scope.modalTieUp = '';
  $scope.modalEnp = '';
  $scope.modalEnmp = '';
  $scope.modalAnp = '';
  $scope.modalAnmp = '';
  $scope.modalTimeS = '';
  $scope.modalSubType = '';
  $scope.modalSubBy = '';
  $scope.modalContact = '';
  $scope.modalEmail = '';
  $scope.modalStatus = '';
  $scope.modalChckedBy = '';
  $scope.modalDateChcked = '';
  $scope.modalRemarks = '';

  $scope.removeContentModal = function() {
      $scope.modalObj = null;
      $scope.modalId = '';
      $scope.modalActivity = '';
      $scope.modalOrg = '';
      $scope.modalTieUp = '';
      $scope.modalEnp = '';
      $scope.modalEnmp = '';
      $scope.modalAnp = '';
      $scope.modalAnmp = '';
      $scope.modalTimeS = '';
      $scope.modalSubType = '';
      $scope.modalSubBy = '';
      $scope.modalContact = '';
      $scope.modalEmail = '';
      $scope.modalStatus = '';
      $scope.modalChckedBy = '';
      $scope.modalDateChcked = '';
      $scope.modalRemarks = '';
      $('#submitRemarks').text("");
  };

  $scope.isPriority = function(postAct) {
      return postAct.cb == '';
  }

  $scope.showModal = function(status) {
    console.log(status.hello);
    $http.get("/get_log/", {params: {"id": status.id}})
          .success(function(response) {
              console.log("success");
              var obj = JSON.parse(response.log);

              $scope.modalObj = obj;
              $scope.modalId = obj.id;
              $scope.modalActivity = obj.n;
              $scope.modalOrg = obj.o;
              $scope.modalTieUp = obj.tie;
              $scope.modalEnp = obj.en;
              $scope.modalEnmp = obj.enm;
              $scope.modalAnp = obj.an;
              $scope.modalAnmp = obj.anm;
              $scope.modalTimeS = obj.t;
              $scope.modalSubType = obj.st;
              $scope.modalSubBy = obj.sb;
              $scope.modalContact = obj.num;
              $scope.modalEmail = obj.ml;
              $scope.modalStatus = obj.s;
              $scope.modalChckedBy = obj.cb;
              $scope.modalDateChcked = obj.d;
              $scope.modalRemarks = obj.mk;
              $('#submitRemarks').text(obj.mk);
            })
            .error(function(response){
                console.log("failed");
            });

    console.log("LOAD MODAL");

  };

  // tooltip
    $scope.currTooltip = '';
    $scope.setTooltip = function(data) {
        var org = data.o;
        for(var i = 0, numOrgs = $scope.orgList.length; i < numOrgs; i++) {
            if($scope.orgList[i].short == org) {
                $scope.currTooltip = $scope.orgList[i].long;
            }
        }
    }

  // Filters
    $scope.monthList = [
      {'short' : '01', 'long' : 'January'},
      {'short' : '02', 'long' : 'February'},
      {'short' : '03', 'long' : 'March'},
      {'short' : '04', 'long' : 'April'},
      {'short' : '05', 'long' : 'May'},
      {'short' : '06', 'long' : 'June'},
      {'short' : '07', 'long' : 'July'},
      {'short' : '08', 'long' : 'August'},
      {'short' : '09', 'long' : 'September'},
      {'short' : '10', 'long' : 'October'},
      {'short' : '11', 'long' : 'November'},
      {'short' : '12', 'long' : 'December'}
    ];

  $scope.termList = [
      {'short' : '1', 'long' : 'Term 1'},
      {'short' : '2', 'long' : 'Term 2'},
      {'short' : '3', 'long' : 'Term 3'},
      {'short' : 'yearlong', 'long' : 'Yearlong'}
  ];

  $http.get("/get_dashboard_contexts/", {params: {}})
      .success(function(response) {
          console.log("success");
          $scope.postact_data = JSON.parse(response.logs);
          $scope.orgList = JSON.parse(response.orgs);
          $scope.clusterList = JSON.parse(response.cluster);
          $scope.checkerList = JSON.parse(response.mod);
          $scope.statusList = JSON.parse(response.status);
          $scope.typeList = JSON.parse(response.type);
        })
        .error(function(response){
            console.log("failed");
        });
});
