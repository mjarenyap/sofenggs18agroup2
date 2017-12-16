
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
    $scope.showEditUserModal = false;
    $scope.showAddOrgModal = false;
    $scope.showDelOrgModal = false;
    $scope.showEditOrgModal = false;
    $scope.showTestModal = false;

    // edit user modal content
    $scope.modalId = '';
    $scope.modalUsername = '';
    $scope.modalPassword = '';

    // edit org modal content
    $scope.modalOrgName = '';
    $scope.modalOrgAbbrev = '';
    $scope.modalOrgCluster = '';

    var hideAllModals = function () {
        $scope.showAddUserModal = false;
        $scope.showDelUserModal = false;
        $scope.showEditUserModal = false;
        $scope.showAddOrgModal = false;
        $scope.showDelOrgModal = false;
        $scope.showEditOrgModal = false;
        $scope.showTestModal = false;
    }

    $scope.showModal = function(checker) {
        hideAllModals();
        $scope.showEditUserModal = true;
        $scope.modalOldUsername = checker.username;
        $scope.modalUsername = checker.username;
        $scope.modalPassword = checker.password;
    }

    $scope.showModalO = function(org) {
        hideAllModals();
        $scope.showEditOrgModal= true;
        $scope.modalOrgName = org.name;
        $scope.modalOrgAbbrev = org.abbrev;
        $scope.modalOrgCluster = org.cluster;
    }

    $scope.modalAddUserShow = function() {
        hideAllModals();
        $scope.showAddUserModal = true;
    }

    $scope.modalAddOrgShow = function() {
        hideAllModals();
        $scope.showAddOrgModal = true;
    }

    $scope.delUsers = [ "hi ho" ];
    $scope.selectUsers = 0;

    $scope.modalDelUser = function(data) {
        hideAllModals();
        $scope.showDelUserModal = true;
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

        $("#btn-del-user-final").click(function() {
            var flag = true;
            var appElement = document.querySelector('[ng-app=dashboardApp]');
            var $scope = angular.element(appElement).scope();

            $scope.$apply(function() {
                if($scope.modalObj.s == status && $scope.modalObj.mk == remarks) {
                    flag = false;
                }
                console.log("EYY");
            });

            var post = ''

            $.each(arr, function(index, content) {
                post += '&un' + index + '=' + content.username
            });

            console.log($("#modalDeleteUser").serialize()
                + post);

            if(flag) {
                $.ajax({
                    type: "POST",
                    url: "/settings/remove/",
                    data: $("#modalDeleteUser").serialize()
                    + post,
                    success: function (response) {
                        if (response.status == 1) {
                            $("p.messages#saving_msg").text("Saved Successfully.");

                            window.location.href = "/settings/";
                        } else {
                            $("p.messages#saving_msg").text("Saved Failed.");
                        }
                    }
                });
            } else {
                $("p.messages#saving_msg").text("No changes detected.");
            }

            $("#modal-details-wrapper-settings").css("height", ((checkCount * 30) + 270) + "px");
            $("div#modal-wrapper").css("display", "flex");
            $("div#modal-details-wrapper").css("display", "block");
        });
    }

    $scope.delOrgs = [ "hi ho" ];
    $scope.modalDelOrg = function(data) {
        hideAllModals();
        $scope.showDelOrgModal = true;
        console.log("DELETE ORG CLICKED");
        var arr = [];
        for(var i in data) {
            if(data[i].SELECTED=='Y'){
                arr.push(data[i]);
            }
        }
        $scope.delOrgs = arr;
        console.log("Delete org: " + $scope.delOrgs);
    }

    $scope.modalTest = function(data) {
        hideAllModals();
        $scope.showTestModal = true;

    }

    $scope.activeModal = function(modal) {

        if(modal == 'add') {
            return $scope.showAddUserModal;
        } else if(modal == 'del') {
            return $scope.showDelUserModal;
        } else if(modal == 'edit') {
            return $scope.showEditUserModal;
        } else if(modal == 'addO') {
            return $scope.showAddOrgModal;
        } else if(modal == 'delO') {
            return $scope.showDelOrgModal;
        } else if(modal == 'editO') {
            return $scope.showEditOrgModal;
        } else if(modal == 'test') {
            return $scope.showTestModal;
        }
    }

    $scope.updateSelectCount = function(data) {
        var cnt = 0;
        for(var i in data) {
            if(data[i].SELECTED=='Y'){
                cnt++;
            }
        }
        $scope.selectUsers = cnt;
        // console.log($scope.delUsers);
    }

    $scope.selectOrgs = 0;

    $scope.updateSelectCountOrgs = function(data) {
        var cnt = 0;
        for(var i in data) {
            if(data[i].SELECTED=='Y'){
                cnt++;
            }
        }
        $scope.selectOrgs = cnt;
        // console.log($scope.delUsers);
    }

    $http.get("get_settings_contexts/", {params: {}})
        .success(function(response) {
            console.log("success");
            var obj_mod = JSON.parse(response.mod);
            var obj_map = JSON.parse(response.maps);
            console.log(obj_map);
            setMapAttr(obj_map);
            $scope.checkers = obj_mod;
        })
        .error(function(response){
            console.log("failed");
        });

    var setMapAttr = function(maps) {
        $scope.maps = maps;
        $scope.defaultTerm = maps.default_term;
        $scope.worksheetKey = maps.worksheet_key;
        $scope.sheetName = maps.sheet_name;
        $scope.startRow = maps.start_row;
        $scope.timestampCol = maps.timestamp.replace("COLUMN ", "");
        $scope.titleCol = maps.activity_title.replace("COLUMN ", "");
        $scope.termCol = maps.term.replace("COLUMN ", "");
        $scope.orgCol = maps.organization.replace("COLUMN ", "");
        $scope.tuOrgsCol = maps.tie_up_orgs.replace("COLUMN ", "");
        $scope.typeCol = maps.submission_type.replace("COLUMN ", "");
        $scope.enpCol = maps.enp.replace("COLUMN ", "");
        $scope.anpCol = maps.anp.replace("COLUMN ", "");
        $scope.enmpCol = maps.enmp.replace("COLUMN ", "");
        $scope.anmpCol = maps.anmp.replace("COLUMN ", "");
        $scope.expenseCol = maps.expenses_incurred.replace("COLUMN ", "");
        $scope.subByCol = maps.submitted_by.replace("COLUMN ", "");
        $scope.contactCol = maps.contact_no.replace("COLUMN ", "");
        $scope.emailCol = maps.email.replace("COLUMN ", "");
        $scope.statusCol = maps.status.replace("COLUMN ", "");
        $scope.checkedCol = maps.checked_by.replace("COLUMN ", "");
        $scope.dateCol = maps.date_checked.replace("COLUMN ", "");
        $scope.remarksCol = maps.remarks.replace("COLUMN ", "");
    };

    $scope.termList = [
        'Term 1',
        'Term 2',
        'Term 3'
    ];

    $scope.orgList = [
        {'name' : 'AdCreate Society', 'abbrev' : 'ADCREATE', 'cluster' : 'ASPIRE', 'submitted' : '20'},
        {'name' : 'Business Management Society', 'abbrev' : 'BMS', 'cluster' : 'ASPIRE', 'submitted' : '116'},
        {'name' : 'Ley La Salle', 'abbrev' : 'LLS', 'cluster' : 'Others', 'submitted' : '61'},
        {'name' : 'La Salle Computer Society', 'abbrev' : 'LSCS', 'cluster' : 'Others', 'submitted' : '22'},
        {'name' : 'Moo Media', 'abbrev' : 'MOO', 'cluster' : 'Others', 'submitted' : '48'},
        {'name' : 'ROTARACT Club of DLSU', 'abbrev' : 'ROTARACT', 'cluster' : 'ASPIRE', 'submitted' : '17'},
        {'name' : 'Team Communications', 'abbrev' : 'TeamComm', 'cluster' : 'ASPIRE', 'submitted' : '32'}
    ]



    $scope.clusterList = [
        {'short' : 'ASO'},
        {'short' : 'ASPIRE'},
        {'short' : 'CAP 12'},
        {'short' : 'ENGAGE'},
        {'short' : 'PROBE'},
        {'short' : 'Others'}
    ]

    $scope.newOrgCluster = 'ASO';

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