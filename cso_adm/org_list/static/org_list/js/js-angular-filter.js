var root = 'https://jsonplaceholder.typicode.com';

console.log("org-list angular js LOADED");
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


    return item.orgName.search(regex) == 0;
  };

  var searchCluster = function(item, val) {
    if(!val)
      return true;
    var regex = new RegExp(val, 'i');

    return item.cluster.search(regex) == 0;
  };


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

    return include(org, $scope.filterSearchOrg) && searchCluster(org, $scope.filterCluster);
  };

  // Filters
  $scope.clusterList = [
      {'short' : 'ASO', 'long' : 'Alliance of Science Organizations'},  
      {'short' : 'ASPIRE', 'long' : 'Alliance of Special Interest and Socio-Civic Organizations'},  
      {'short' : 'CAP 12', 'long' : 'College of Liberal Arts Professional Organizations'},  
      {'short' : 'ENGAGE', 'long' : 'Engineering Alliance Geared Towards Excellence'},  
      {'short' : 'PROBE', 'long' : 'Alliance of Professional Organizations of Business and Economics'} 
  ];
  
  $scope.orgList = [
      {'short' : 'ChemSoc', 'long' : 'Chemistry Society', 'cluster' : 'ASO'},
      {'short' : 'MC', 'long' : 'Math Circle', 'cluster' : 'ASO'},
      {'short' : 'PhySoc', 'long' : 'Physics Society', 'cluster' : 'ASO'},
      {'short' : 'SV', 'long' : 'Societas Vitae', 'cluster' : 'ASO'},

      {'short' : 'LSCS', 'long' : 'La Salle Computer Society', 'cluster' : 'ASPIRE'},
      {'short' : 'UNITED', 'long' : 'Union of Sutdents Inspired Towards Education', 'cluster' : 'ASPIRE'},
      {'short' : 'ENGLICOM', 'long' : 'DLSU Filipino & Chinese Organization', 'cluster' : 'ASPIRE'},
      {'short' : 'ROTARACT', 'long' : 'ROTARACT Club of DLSU', 'cluster' : 'ASPIRE'},
      {'short' : 'UNISTO', 'long' : 'United International Student Organization', 'cluster' : 'ASPIRE'},
      {'short' : 'AIESEC', 'long' : 'AIESEC DLSU', 'cluster' : 'ASPIRE'},
      {'short' : 'Moo Media', 'long' : 'Moo Media', 'cluster' : 'ASPIRE'},
      {'short' : 'OC', 'long' : 'Outdoor Club', 'cluster' : 'ASPIRE'},
      {'short' : 'WG', 'long' : 'Writer\'s Guild', 'cluster' : 'ASPIRE'},
      {'short' : 'ECO', 'long' : 'Environmental Conservation Organization', 'cluster' : 'ASPIRE'},
      {'short' : 'GAS', 'long' : 'Gakuen Anime Soshiki', 'cluster' : 'ASPIRE'},

      {'short' : 'AMSTUD', 'long' : 'The Organization for American Studies ', 'cluster' : 'CAP 12'},
      {'short' : 'BSS', 'long' : 'Behavioral Sciences Society', 'cluster' : 'CAP 12'},
      {'short' : 'Cultura', 'long' : 'Cultura', 'cluster' : 'CAP 12'},
      {'short' : 'DANUM', 'long' : 'Dalubhasaan ng mga Umuusbong na Mag-aaral ng Araling Pilipinas', 'cluster' : 'CAP 12'},
      {'short' : 'ESA', 'long' : 'European Studies Association', 'cluster' : 'CAP 12'},
      {'short' : 'Kaunlaran', 'long' : 'Kapatiran ng Kabataan para sa Kaunlaran', 'cluster' : 'CAP 12'},
      {'short' : 'NKK', 'long' : 'Nihon Kenkyu Kai', 'cluster' : 'CAP 12'},
      {'short' : 'Poliscy', 'long' : 'Political Science Society', 'cluster' : 'CAP 12'},
      {'short' : 'DLSU Pilosopo', 'long' : 'Samahan ng Lasalyanong Pilosopo', 'cluster' : 'CAP 12'},
      {'short' : 'SMS', 'long' : 'Samahan ng Mag-aaral sa Sikolohiya', 'cluster' : 'CAP 12'},
      {'short' : 'SDH', 'long' : 'Sociedad De Historia', 'cluster' : 'CAP 12'},
      {'short' : 'TeamComm', 'long' : 'Team Communications', 'cluster' : 'CAP 12'},

      {'short' : 'ACCESS', 'long' : 'Association of Computer Engineering Students', 'cluster' : 'ENGAGE'},
      {'short' : 'ChEn', 'long' : 'Chemical Engineering Society', 'cluster' : 'ENGAGE'},
      {'short' : 'CES', 'long' : 'Civil Engineering Society', 'cluster' : 'ENGAGE'},
      {'short' : 'ECES', 'long' : 'Electronic and Communications Engineering Society', 'cluster' : 'ENGAGE'},
      {'short' : 'IMES', 'long' : 'Industrial Management Engineering Society', 'cluster' : 'ENGAGE'},
      {'short' : 'MES', 'long' : 'Mechanical Engineering Society', 'cluster' : 'ENGAGE'},
      {'short' : 'SME', 'long' : 'Society of Manufacturing Engineering', 'cluster' : 'ENGAGE'},
      {'short' : 'AdCreate', 'long' : 'AdCreate Society', 'cluster' : 'PROBE'},
      {'short' : 'BMS', 'long' : 'Business Management Society', 'cluster' : 'PROBE'},
      {'short' : 'EconOrg', 'long' : 'Economics Organization', 'cluster' : 'PROBE'},
      {'short' : 'MaFia', 'long' : 'Management of Financial Institutions Association', 'cluster' : 'PROBE'},
      {'short' : 'YES', 'long' : 'Young Entrepreneurs Socieety',  'cluster' : 'PROBE'}
      
  ];


  // Dummy frontend data
  $scope.org_data =
  [
  {
    'orgName': 'La Salle Computer Society',
    'abbreviation': 'LSCS',
    'cluster': 'ASPIRE',
    'ec': 12,
    'lc': 0,
    'ei': 11,
    'li': 32,
    'p': 16,
    'nc': 3
  },
  {
    'orgName': 'Union of Sutdents Inspired Towards Education',
    'abbreviation': 'UNITED',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'DLSU Filipino & Chinese Organization',
    'abbreviation': 'ENGLICOM',
    'cluster': 'ASPIRE',
    'ec': 14,
    'lc': 1,
    'ei': 5,
    'li': 14,
    'p': 0,
    'nc': 12
  },
  {
    'orgName': 'ROTARACT Club of DLSU',
    'abbreviation': 'ROTARACT',
    'cluster': 'ASPIRE',
    'ec': 2,
    'lc': 40,
    'ei': 1,
    'li': 4,
    'p': 5,
    'nc': 3
  },
  {
    'orgName': 'AIESEC DLSU',
    'abbreviation': 'AIESEC',
    'cluster': 'ASPIRE',
    'ec': 31,
    'lc': 14,
    'ei': 3,
    'li': 4,
    'p': 9,
    'nc': 3
  },
  {
    'orgName': 'Moo Media',
    'abbreviation': 'Moo Media',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Outdoor Club',
    'abbreviation': 'OC',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Writer\'s Guild',
    'abbreviation': 'WG',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Environmental Conservation Organization',
    'abbreviation': 'ECO',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Writer\'s Guild',
    'abbreviation': 'WG',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Gakuen Anime Soshiki',
    'abbreviation': 'GAS',
    'cluster': 'ASPIRE',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Chemistry Society',
    'abbreviation': 'ChemSoc',
    'cluster': 'ASO',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Math Circle',
    'abbreviation': 'MC',
    'cluster': 'ASO',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Physics Society',
    'abbreviation': 'PhySoc',
    'cluster': 'ASO',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Societas Vitae',
    'abbreviation': 'SV',
    'cluster': 'ASO',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'The Organization for American Studies',
    'abbreviation': 'AMSTUD',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Behavioral Sciences Society',
    'abbreviation': 'BSS',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Cultura',
    'abbreviation': 'Cultura',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Dalubhasaan ng mga Umuusbong na Mag-aaral ng Araling Pilipinas',
    'abbreviation': 'DANUM',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'European Studies Association',
    'abbreviation': 'ESA',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Kapatiran ng Kabataan para sa Kaunlaran',
    'abbreviation': 'Kaunlaran',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Political Science Society',
    'abbreviation': 'Poliscy',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
      {
    'orgName': 'Nihon Kenkyu Kai',
    'abbreviation': 'NKK',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Samahan ng Lasalyanong Pilosopo',
    'abbreviation': 'DLSU Pilosopo',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Samahan ng Mag-aaral sa Sikolohiya',
    'abbreviation': 'SMS',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
      {
    'orgName': 'Sociedad De Historia',
    'abbreviation': 'SDH',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  },
  {
    'orgName': 'Team Communications',
    'abbreviation': 'TeamComm',
    'cluster': 'CAP 12',
    'ec': 11,
    'lc': 10,
    'ei': 9,
    'li': 44,
    'p': 56,
    'nc': 23
  }
  ];


});
