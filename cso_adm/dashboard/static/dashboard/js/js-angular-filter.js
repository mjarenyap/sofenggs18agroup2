var root = 'https://jsonplaceholder.typicode.com';

console.log("NG-TABLE LOADED");
var dashboardApp = angular.module('dashboardApp', []);

dashboardApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
    ])
});

dashboardApp.controller('mainController', function($scope, $http) {
/*      var root = 'https://jsonplaceholder.typicode.com';
  $http.get(root + '/users/')
  .then(function(response) {
    console.log(response.data);
    // store json keys in keys[]
    var keys = [];
    keys = Object.keys(response.data[0]);
    console.log('obj contains ' + keys.length + ' keys: '+  keys);
    $scope.sortType     = keys[1];  // set the default sort type
    $scope.sortReverse  = false;    // set the default sort order
    $scope.contentFilter   = '';    // set the default search/filter term
    $scope.filters = { };
    $scope.postact_data = [];
    for(k in response.data) {
      console.log(response.data[k]);
      $scope.postact_data.push(response.data[k]);
    }
    console.log($scope.tableHeaders);
  });*/
  var include = function(item, val) {

    if(!val)
      return true;

    var regex = new RegExp('.*' + val + '.*', 'i');


    return item.activityTitle.search(regex) == 0;
  };

  var searchMonth = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');
    var month = item.timestamp.split('/')[2].split(' ')[0];

    return month.search(regex) == 0;
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

    return item.submissionType.search(regex) == 0;
  };

  var searchStatus = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.status.search(regex) == 0;
  };

  var searchChecker = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.checkedBy.search(regex) == 0;
  };

  $scope.getTrustedUploadSrc = function(id) {
    return "/upload/" + id;
  };

  $scope.sortType = 'timestamp';  // set the default sort type
  $scope.sortReverse = true;    // set the default sort order

  // Checks all filters
  $scope.filters = function(postact) {
    console.log("Checking Filters");
    // console.log(postact.timestamp.split('/')[2].split(' ')[0]);

    if(!$scope.filterSearch && !$scope.filterMonth && !$scope.filterTerm && !$scope.filterType && !$scope.filterStatus && !$scope.filterChecker)
      return true;

    return include(postact, $scope.filterSearch) && searchMonth(postact, $scope.filterMonth) &&
        searchTerm(postact, $scope.filterTerm) && searchType(postact, $scope.filterType) &&
        searchStatus(postact, $scope.filterStatus) && searchChecker(postact, $scope.filterChecker);
  };

  // modal content
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


  $scope.showModal = function(status) {

    console.log("LOAD MODAL");
    $scope.modalId = status.postActsLogID;
    $scope.modalActivity = status.activityTitle;
    $scope.modalOrg = status.orgName;
    $scope.modalTieUp = status.tieUpOrg;
    $scope.modalEnp = status.enp;
    $scope.modalEnmp = status.enmp;
    $scope.modalAnp = status.anp;
    $scope.modalAnmp = status.anmp;
    $scope.modalTimeS = status.timestamp;
    $scope.modalSubType = status.submissionType;
    $scope.modalSubBy = status.submittedBy;
    $scope.modalContact = status.contactNo;
    $scope.modalEmail = status.email;
    $scope.modalStatus = status.status;
    $scope.modalChckedBy = status.checkedBy;
    $scope.modalDateChcked = status.dateChecked;
    $scope.modalRemarks = status.remarks;

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

  $scope.typeList = [
      {'short' : 'I', 'long' : 'Pending'},
      {'short' : 'IP', 'long' : 'Initial Pending'},
      {'short' : 'S', 'long' : 'Submission'},
      {'short' : 'IS', 'long' : 'Initial Submission'}
  ];

  $scope.statusList = [
      {'short' : 'P', 'long' : 'Pending'},
      {'short' : 'EC', 'long' : 'Early Complete'},
      {'short' : 'LC', 'long' : 'Late Complete'},
      {'short' : 'EI', 'long' : 'Early Incomplete'},
      {'short' : 'LI', 'long' : 'Late Incomplete'}
  ];

  $scope.checkerList = [
      'Hordy Mojica', 'Julianne Sy', 'Kristel Tan'
  ];


  // Dummy frontend data
  $scope.postact_data =
  [
  {
    'timestamp': '2017/09/09  16:43',
    'activityTitle': 'MGT/IBS: Internship Orientation',
    'orgName': 'LSCS',
    'term': '1',
    'submissionType': 'Initial Submission',
    'status': 'P',
    'checkedBy': 'Hordy Mojica',
    'dateChecked': '09/10/17',
    'tieUpOrg': 'N/A',
    'enp': '80',
    'enmp': '3',
    'anp':'83',
    'anmp': '80',
    'submittedBy': 'Katherine Chucuco',
    'contactNo': '09088963224',
    'email': 'katherine_chuacuco@dlsu.edu.ph',
    'remarks': 'N/A'
  },
  {
    'timestamp': '2017/21/10  13:23',
    'activityTitle': 'Introduction to Adobe Illustrator',
    'orgName': 'AdCreate',
    'term': '3',
    'submissionType': 'Initial Submission',
    'status': 'EC',
    'checkedBy': 'Julianne Sy',
    'dateChecked': '10/14/17',
    'tieUpOrg': 'N/A',
    'enp': '80',
    'enmp': '3',
    'anp':'83',
    'anmp': '80',
    'submittedBy': 'Katherine Chucuco',
    'contactNo': '09088963224',
    'email': 'katherine_chuacuco@dlsu.edu.ph',
    'remarks': 'Cauliflower'
  },
  {
    'timestamp': '2017/04/01  14:20',
    'activityTitle': 'Frosh Welcoming Extravaganza',
    'orgName': 'BMS',
    'term': '3',
    'submissionType': 'Initial Submission',
    'status': 'EC',
    'checkedBy': 'Kristel Tan',
    'dateChecked': '10/15/17',
    'tieUpOrg': 'N/A',
    'enp': '80',
    'enmp': '3',
    'anp':'83',
    'anmp': '80',
    'submittedBy': 'Katherine Chucuco',
    'contactNo': '09088963224',
    'email': 'katherine_chuacuco@dlsu.edu.ph',
    'remarks': 'Bamboo'
  },
  {
    'timestamp': '2017/21/08  13:23',
    'activityTitle': 'A Night of a Thousand Madonnas',
    'orgName': 'LSCS',
    'term': '3',
    'submissionType': 'Initial Submission',
    'status': 'LC',
    'checkedBy': 'Kristel Tan',
    'dateChecked': '09/13/17',
    'tieUpOrg': 'N/A',
    'enp': '80',
    'enmp': '3',
    'anp':'83',
    'anmp': '80',
    'submittedBy': 'Katherine Chucuco',
    'contactNo': '09088963224',
    'email': 'katherine_chuacuco@dlsu.edu.ph',
    'remarks': 'No kimonos here'
  },
  {
    'timestamp': '2017/05/05  13:23',
    'activityTitle': 'Suddenly Seymour',
    'orgName': 'MES',
    'term': '2',
    'submissionType': 'Pending',
    'status': 'AC',
    'checkedBy': 'Julianne Sy',
    'dateChecked': '05/12/17',
    'tieUpOrg': 'N/A',
    'enp': '80',
    'enmp': '3',
    'anp':'83',
    'anmp': '80',
    'submittedBy': 'Katherine Chucuco',
    'contactNo': '09088963224',
    'email': 'katherine_chuacuco@dlsu.edu.ph',
    'remarks': 'Boogie boogie'
  }
  ];
});