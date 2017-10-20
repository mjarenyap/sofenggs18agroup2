var root = 'https://jsonplaceholder.typicode.com';


var sortApp = angular.module('sortApp', []);

sortApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
    ])
});

sortApp.controller('mainController', function($scope, $http) {
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
    var regex = new RegExp('.*' + val + '.*', 'i');
    return item.activityTitle.search(regex) == 0;
  };

  var searchTerm = function(item, val) {
    var regex = new RegExp(val, 'i');

    return item.term.search(regex) == 0;
  };

  var searchStatus = function(item, val) {
    var regex = new RegExp(val, 'i');

    return item.status.search(regex) == 0;
  };

  $scope.getTrustedUploadSrc = function(id) {
    return "/upload/" + id;
  };

  $scope.sortType = 'timestamp';  // set the default sort type
  $scope.sortReverse = true;    // set the default sort order
  $scope.searchFilter = '';
  $scope.termFilter = '';
  $scope.statusFilter = '';

  // Checks all filters
  $scope.filters = function(postact) {
    console.log("Checking Filters");
    if(!$scope.searchFilter && !$scope.termFilter && !$scope.statusFilter)
      return true;

    return include(postact, $scope.searchFilter) && searchTerm(postact, $scope.termFilter) && searchStatus(postact, $scope.statusFilter);
  };

  // Term toggle
  $scope.toggleTerm = function(num) {

    if($scope.termFilter == num) {
      $scope.termFilter = '';
    } else {
      $scope.termFilter = num;
    }

    console.log("Term filter: " + $scope.termFilter);
  }

  // Status toggle
  $scope.toggleStatus = function(status) {

    if($scope.statusFilter == status) {
      $scope.statusFilter = '';
    } else {
      $scope.statusFilter = status;
    }

    console.log("Status filter: " + $scope.statusFilter);
  }

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

    console.log(status);
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

  // Dummy frontend data
  $scope.postact_data = response;
  /*[
  {
    'timestamp': '09/09/17  16:43',
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
    'timestamp': '10/21/17  13:23',
    'activityTitle': 'Introduction to Adobe Illustrator',
    'orgName': 'AdCreate',
    'term': '3',
    'submissionType': 'Initial Submission',
    'status': 'EC',
    'checkedBy': 'Allyza Hehe',
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
    'timestamp': '01/04/17  14:20',
    'activityTitle': 'Frosh Welcoming Extravaganza',
    'orgName': 'BMS',
    'term': '3',
    'submissionType': 'Initial Submission',
    'status': 'EC',
    'checkedBy': 'Louise Hehe',
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
    'timestamp': '04/21/17  13:23',
    'activityTitle': 'A Night of a Thousand Madonnas',
    'orgName': 'LSCS',
    'term': '3',
    'submissionType': 'Initial Submission',
    'status': 'LC',
    'checkedBy': 'Alexczar dela Torre',
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
    'timestamp': '05/05/17  13:23',
    'activityTitle': 'Suddenly Seymour',
    'orgName': 'MES',
    'term': '2',
    'submissionType': 'Pending',
    'status': 'AC',
    'checkedBy': 'Choi Mirafuentes',
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
  ];*/
});