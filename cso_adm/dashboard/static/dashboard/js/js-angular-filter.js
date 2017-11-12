var root = 'https://jsonplaceholder.typicode.com';

console.log("NG-TABLE LOADED");
var dashboardApp = angular.module('dashboardApp', []);

dashboardApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
    ])
});

dashboardApp.controller('mainController', function($scope, $http) {

  var include = function(item, val) {

    if(!val)
      return true;

    var regex = new RegExp('.*' + val + '.*', 'i');


    return item.n.search(regex) == 0;
  };

  var searchMonth = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');
    var month = item.t.split('/')[2].split(' ')[0];

    return month.search(regex) == 0;
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

  // Checks all filters
  $scope.filters = function(postact) {
    // console.log("Checking Filters");
    // console.log(postact.timestamp.split('/')[2].split(' ')[0]);

    if(!$scope.filterSearch && !$scope.filterMonth && !$scope.filterTerm && !$scope.filterType && !$scope.filterStatus && !$scope.filterChecker && !$scope.filterOrg)
      return true;

    return include(postact, $scope.filterSearch) && searchMonth(postact, $scope.filterMonth) &&
        searchTerm(postact, $scope.filterTerm) && searchType(postact, $scope.filterType) &&
        searchStatus(postact, $scope.filterStatus) && searchChecker(postact, $scope.filterChecker) &&
        searchOrg(postact, $scope.filterOrg);
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
    $scope.modalId = status.id;
    $scope.modalActivity = status.n;
    $scope.modalOrg = status.o;
    $scope.modalTieUp = status.tie;
    $scope.modalEnp = status.en;
    $scope.modalEnmp = status.enm;
    $scope.modalAnp = status.an;
    $scope.modalAnmp = status.anm;
    $scope.modalTimeS = status.t;
    $scope.modalSubType = status.st;
    $scope.modalSubBy = status.sb;
    $scope.modalContact = status.num;
    $scope.modalEmail = status.ml;
    $scope.modalStatus = status.s;
    $scope.modalChckedBy = status.cb;
    $scope.modalDateChcked = status.d;
    $scope.modalRemarks = status.mk;

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
  
  $scope.clusterList = [
      {'short' : 'ASO', 'long' : 'Alliance of Science Organizations'},  
      {'short' : 'ASPIRE', 'long' : 'Alliance of Special Interest and Socio-Civic Organizations'},  
      {'short' : 'CAP 12', 'long' : 'College of Liberal Arts Professional Organizations'},  
      {'short' : 'ENGAGE', 'long' : 'Engineering Alliance Geared Towards Excellence'},  
      {'short' : 'PROBE', 'long' : 'Alliance of Professional Organizations of Business and Economics'} 
  ];

  $scope.orgList = object_org;
  // $scope.orgList = [
  //     {'short' : 'ChemSoc', 'long' : 'Chemistry Society', 'cluster' : 'ASO'},
  //     {'short' : 'MC', 'long' : 'Math Circle', 'cluster' : 'ASO'},
  //     {'short' : 'PhySoc', 'long' : 'Physics Society', 'cluster' : 'ASO'},
  //     {'short' : 'SV', 'long' : 'Societas Vitae', 'cluster' : 'ASO'},
  //     {'short' : 'LSCS', 'long' : 'La Salle Computer Society', 'cluster' : 'ASPIRE'},
  //     {'short' : 'UNITED', 'long' : 'Union of Sutdents Inspired Towards Education', 'cluster' : 'ASPIRE'},
  //     {'short' : 'ENGLICOM', 'long' : 'DLSU Filipino & Chinese Organization', 'cluster' : 'ASPIRE'},
  //     {'short' : 'ROTARACT', 'long' : 'ROTARACT Club of DLSU', 'cluster' : 'ASPIRE'},
  //     {'short' : 'UNISTO', 'long' : 'United International Student Organization', 'cluster' : 'ASPIRE'},
  //     {'short' : 'AIESEC', 'long' : 'AIESEC DLSU', 'cluster' : 'ASPIRE'},
  //     {'short' : 'Moo Media', 'long' : 'Moo Media', 'cluster' : 'ASPIRE'},
  //     {'short' : 'OC', 'long' : 'Outdoor Club', 'cluster' : 'ASPIRE'},
  //     {'short' : 'WG', 'long' : 'Writer\'s Guild', 'cluster' : 'ASPIRE'},
  //     {'short' : 'ECO', 'long' : 'Environmental Conservation Organization', 'cluster' : 'ASPIRE'},
  //     {'short' : 'GAS', 'long' : 'Gakuen Anime Soshiki', 'cluster' : 'ASPIRE'},
  //     {'short' : 'AMSTUD', 'long' : 'The Organization for American Studies ', 'cluster' : 'CAP 12'},
  //     {'short' : 'BSS', 'long' : 'Behavioral Sciences Society', 'cluster' : 'CAP 12'},
  //     {'short' : 'Cultura', 'long' : 'Cultura', 'cluster' : 'CAP 12'},
  //     {'short' : 'DANUM', 'long' : 'Dalubhasaan ng mga Umuusbong na Mag-aaral ng Araling Pilipinas', 'cluster' : 'CAP 12'},
  //     {'short' : 'ESA', 'long' : 'European Studies Association', 'cluster' : 'CAP 12'},
  //     {'short' : 'Kaunlaran', 'long' : 'Kapatiran ng Kabataan para sa Kaunlaran', 'cluster' : 'CAP 12'},
  //     {'short' : 'NKK', 'long' : 'Nihon Kenkyu Kai', 'cluster' : 'CAP 12'},
  //     {'short' : 'Poliscy', 'long' : 'Political Science Society', 'cluster' : 'CAP 12'},
  //     {'short' : 'DLSU Pilosopo', 'long' : 'Samahan ng Lasalyanong Pilosopo', 'cluster' : 'CAP 12'},
  //     {'short' : 'SMS', 'long' : 'Samahan ng Mag-aaral sa Sikolohiya', 'cluster' : 'CAP 12'},
  //     {'short' : 'SDH', 'long' : 'Sociedad De Historia', 'cluster' : 'CAP 12'},
  //     {'short' : 'TeamComm', 'long' : 'Team Communications', 'cluster' : 'CAP 12'},
  //     {'short' : 'ACCESS', 'long' : 'Association of Computer Engineering Students', 'cluster' : 'ENGAGE'},
  //     {'short' : 'ChEn', 'long' : 'Chemical Engineering Society', 'cluster' : 'ENGAGE'},
  //     {'short' : 'CES', 'long' : 'Civil Engineering Society', 'cluster' : 'ENGAGE'},
  //     {'short' : 'ECES', 'long' : 'Electronic and Communications Engineering Society', 'cluster' : 'ENGAGE'},
  //     {'short' : 'IMES', 'long' : 'Industrial Management Engineering Society', 'cluster' : 'ENGAGE'},
  //     {'short' : 'MES', 'long' : 'Mechanical Engineering Society', 'cluster' : 'ENGAGE'},
  //     {'short' : 'SME', 'long' : 'Society of Manufacturing Engineering', 'cluster' : 'ENGAGE'},
  //     {'short' : 'AdCreate', 'long' : 'AdCreate Society', 'cluster' : 'PROBE'},
  //     {'short' : 'BMS', 'long' : 'Business Management Society', 'cluster' : 'PROBE'},
  //     {'short' : 'EconOrg', 'long' : 'Economics Organization', 'cluster' : 'PROBE'},
  //     {'short' : 'MaFia', 'long' : 'Management of Financial Institutions Association', 'cluster' : 'PROBE'},
  //     {'short' : 'YES', 'long' : 'Young Entrepreneurs Socieety',  'cluster' : 'PROBE'}
  //
  // ];


  // Dummy frontend data
  $scope.postact_data = object_log;
  // [
  // {
  //   'timestamp': '2017/09/09  16:43',
  //   'activityTitle': 'MGT/IBS: Internship Orientation',
  //   'orgName': 'LSCS',
  //   'term': '1',
  //   'submissionType': 'Initial Submission',
  //   'status': 'P',
  //   'checkedBy': 'Hordy Mojica',
  //   'dateChecked': '09/10/17',
  //   'tieUpOrg': 'N/A',
  //   'enp': '80',
  //   'enmp': '3',
  //   'anp':'83',
  //   'anmp': '80',
  //   'submittedBy': 'Katherine Chucuco',
  //   'contactNo': '09088963224',
  //   'email': 'katherine_chuacuco@dlsu.edu.ph',
  //   'remarks': 'N/A'
  // },
  // {
  //   'timestamp': '2017/21/10  13:23',
  //   'activityTitle': 'Introduction to Adobe Illustrator',
  //   'orgName': 'AdCreate',
  //   'term': '3',
  //   'submissionType': 'Initial Submission',
  //   'status': 'EC',
  //   'checkedBy': 'Julianne Sy',
  //   'dateChecked': '10/14/17',
  //   'tieUpOrg': 'N/A',
  //   'enp': '80',
  //   'enmp': '3',
  //   'anp':'83',
  //   'anmp': '80',
  //   'submittedBy': 'Katherine Chucuco',
  //   'contactNo': '09088963224',
  //   'email': 'katherine_chuacuco@dlsu.edu.ph',
  //   'remarks': 'Cauliflower'
  // },
  // {
  //   'timestamp': '2017/04/01  14:20',
  //   'activityTitle': 'Frosh Welcoming Extravaganza',
  //   'orgName': 'BMS',
  //   'term': '3',
  //   'submissionType': 'Initial Submission',
  //   'status': 'EC',
  //   'checkedBy': 'Kristel Tan',
  //   'dateChecked': '10/15/17',
  //   'tieUpOrg': 'N/A',
  //   'enp': '80',
  //   'enmp': '3',
  //   'anp':'83',
  //   'anmp': '80',
  //   'submittedBy': 'Katherine Chucuco',
  //   'contactNo': '09088963224',
  //   'email': 'katherine_chuacuco@dlsu.edu.ph',
  //   'remarks': 'Bamboo'
  // },
  // {
  //   'timestamp': '2017/21/08  13:23',
  //   'activityTitle': 'A Night of a Thousand Madonnas',
  //   'orgName': 'LSCS',
  //   'term': '3',
  //   'submissionType': 'Initial Submission',
  //   'status': 'LC',
  //   'checkedBy': 'Kristel Tan',
  //   'dateChecked': '09/13/17',
  //   'tieUpOrg': 'N/A',
  //   'enp': '80',
  //   'enmp': '3',
  //   'anp':'83',
  //   'anmp': '80',
  //   'submittedBy': 'Katherine Chucuco',
  //   'contactNo': '09088963224',
  //   'email': 'katherine_chuacuco@dlsu.edu.ph',
  //   'remarks': 'No kimonos here'
  // },
  // {
  //   'timestamp': '2017/05/05  13:23',
  //   'activityTitle': 'Suddenly Seymour',
  //   'orgName': 'MES',
  //   'term': '2',
  //   'submissionType': 'Pending',
  //   'status': 'AC',
  //   'checkedBy': 'Julianne Sy',
  //   'dateChecked': '05/12/17',
  //   'tieUpOrg': 'N/A',
  //   'enp': '80',
  //   'enmp': '3',
  //   'anp':'83',
  //   'anmp': '80',
  //   'submittedBy': 'Katherine Chucuco',
  //   'contactNo': '09088963224',
  //   'email': 'katherine_chuacuco@dlsu.edu.ph',
  //   'remarks': 'Boogie boogie'
  // }
  // ];
});
