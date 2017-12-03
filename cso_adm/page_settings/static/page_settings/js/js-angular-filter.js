
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
  $scope.showTestModal = false;

  // modal content
  $scope.modalId = '';
  $scope.modalUsername = '';
  $scope.modalPassword = '';

  var hideAllModals = function () {
       $scope.showAddUserModal = false;
      $scope.showDelUserModal = false;
      $scope.showEditUserModal = false;
      $scope.showTestModal = false;
  }

  $scope.showModal = function(checker) {
    hideAllModals();
    $scope.showEditUserModal = true;
    $scope.modalId = '';
    $scope.modalOldUsername = checker.username;
    $scope.modalUsername = checker.username;
    $scope.modalPassword = checker.password;
  }

  $scope.modalAddUserShow = function() {
    hideAllModals();
    $scope.showAddUserModal = true;
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