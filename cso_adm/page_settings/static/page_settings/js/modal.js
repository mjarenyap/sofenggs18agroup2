// javascript functions for modals

function clean(str) {
    newStr = ''
    inside = false

    for (i = 0; i < str.length; i++) {
        if (!inside) {
            if (str[i] != ' ' && str[i] != '\n') {
                newStr += str[i]

                inside = true
            } else {
                continue
            }
        } else {
            newStr += str[i]
        }
    }

    return newStr
}

$(document).ready(function(){
    $("#discard-pwform-changes").on("click", function(event){
        $("#changePswdAdmin")[0].reset();

        event.preventDefault()
    });

    $("div#modal-details-wrapper ul.tab-wrapper li").click(function(e){
        if(!$(e.target).hasClass("closeModal") && !$(e.target).hasClass("fa")) {
            $("div#modal-details-wrapper ul.tab-wrapper li").removeClass("active");
            $(this).addClass("active");
            var activeContent = $(this).attr("data-id");

            $("div#modal-details-wrapper div.content-wrapper").removeClass("visible");
            $("#" + activeContent).addClass("visible");
        }

    });
    
    $("table.post-acts-table tr td").click(function(){
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });
    
    $("div#modal-wrapper i.close").click(function(){
        $("div#modal-wrapper").css("display", "none");
    });
    
    $("div#modal-details-wrapper #discard").click(function(){
        $("div#modal-wrapper").css("display", "none");
    });

     /// settings page
    document.getElementById("btn-del-user").disabled = true;
    document.getElementById("btn-del-org").disabled = true;

    $(document).on("click", ".users-table button.btn-edit-user", function(e){
        var formErrors = $(".form-error").hide();
        var inpEdit = $(".inpEditMod");

        console.log("click .users=table button");

        for(i = 0; i < inpEdit.length; i++) {
            if (i != 0) {
                $(inpEdit[i]).val("");
            }
            $(inpEdit[i]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
        }
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
        $("#modal-details-wrapper-settings").css("height", "360px");
    });

    $(document).on("click", ".users-table button.btn-edit-org", function(e){
        var formErrors = $(".form-error").hide();
        var inpEdit = $(".inpEditOrg");

        console.log("click .users=table button");

        for(i = 0; i < inpEdit.length; i++) {
            $(inpEdit[i]).val(inpEdit[i].getAttribute('value'));
            $(inpEdit[i]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
        }

        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
        $("#modal-details-wrapper-settings").css("height", "360px");
    });

    $("#btn-add-user").click(function() {
        $(".form-error").hide();
        var inpAdd = $(".inpAddMod");

        for(i = 0; i < inpAdd.length; i++) {
            $(inpAdd[i]).val("");
            $(inpAdd[i]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
        }

        $("#modal-details-wrapper-settings").css("height",  "560px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });

    $("#btn-add-org").click(function() {
        $(".form-error").hide();
        var inpAdd = $(".inpAddOrg");

        for(i = 0; i < inpAdd.length; i++) {
            $(inpAdd[i]).val("");
            $(inpAdd[i]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
        }

        $("#modal-details-wrapper-settings").css("height",  "360px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });

    var checkCount = 0;
    $(document).on("click", "td input.check-user:checkbox", function(e) {
        checkCount = 0;
        $("tr input.check-user:checkbox").each(function() {
            checkCount += (this.checked ? 1 : 0);
        });
        if(checkCount >= 1) {
            document.getElementById("btn-del-user").disabled = false;
        } else {
            document.getElementById("btn-del-user").disabled = true;
        }
    });

    var checkCountOrg = 0;
    $(document).on("click", "td input.check-org:checkbox", function(e) {
        checkCount = 0;
        $("tr input.check-org:checkbox").each(function() {
            checkCountOrg += (this.checked ? 1 : 0);
        });
        if(checkCountOrg >= 1) {
            document.getElementById("btn-del-org").disabled = false;
        } else {
            document.getElementById("btn-del-org").disabled = true;
        }
    });

    $("#btn-del-user").click(function() {
        var flag = true;
        var appElement = document.querySelector('[ng-app=dashboardApp]');
        var $scope = angular.element(appElement).scope();

        $scope.$apply(function() {
            if($scope.modalObj.s == status && $scope.modalObj.mk == remarks) {
                flag = false;
            }
            console.log("EYY");
        });

        if(flag) {
            $.ajax({
                type: "POST",
                url: "/settings/remove/",
                data: "", // TODO: insert arr of deleted users,
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

        $("#modal-details-wrapper-settings").css("height", ((checkCount * 32) + 250) + "px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });

    $("#btn-del-org").click(function() {
        $("#modal-details-wrapper-settings").css("height", ((checkCountOrg * 10) + 250) + "px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });

    $("#btn-modal-test").click(function() {
        $("#modal-details-wrapper-settings").css("height", "500px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });

    $("#modalAddUser").submit(function(e){
        var inpAdd = $(".inpAddMod");

        var userRegex = "[A-Za-z0-9_]{6,25}"; // alphanumeric and underscore (5-12 characters)
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var passRegex = "[A-Za-z0-9_]{6,25}"; // alphanumeric and underscore (6-15 characters)

        var usernameVal = inpAdd[2].value;
        var emailVal = inpAdd[3].value;
        var passVal1 = inpAdd[4].value;
        var passVal2 = inpAdd[5].value;

        // username check
        if(!usernameVal.match(userRegex)) {
            $(inpAdd[2]).css("border-bottom", "thin solid palevioletred");
            $("#err-mod-add-uregex").show();
            e.preventDefault(e);
        } else {
            $("#err-mod-add-uregex").hide();
            $(inpAdd[2]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
        }

        // email check
        if(!emailRegex.test(emailVal)) {
            $("#err-mod-add-eregex").show();
            $(inpAdd[3]).css("border-bottom", "thin solid palevioletred");
            e.preventDefault(e);
        } else {
            $("#err-mod-add-eregex").hide();
            $(inpAdd[3]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
        }

        // password check
        if(passVal1 != passVal2) {
            $("#err-mod-add-pmatch").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[4]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[5]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-add-pmatch").hide();
        }

        if(!passVal1.match(passRegex)) {
            $("#err-mod-add-pregex").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[4]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[5]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-add-pregex").hide();
        }

        if(passVal1 != passVal2 || !passVal1.match(passRegex)) {
            $(inpAdd[4]).css("border-bottom", "thin solid palevioletred");
            $(inpAdd[5]).css("border-bottom", "thin solid palevioletred");
        }

        $("div.error#saving_banner").css("display", "flex");
        $("p.messages#saving_msg").text("Saving...");

        var fn = $("#modalAddUser #firstName").val();
        var ln = $("#modalAddUser #lastName").val();
        var un = $("#modalAddUser #username").val();
        var em = $("#modalAddUser #email").val();
        var pw = $("#modalAddUser #password").val();

        console.log("Test " + $("#modalAddUser").serialize()
                    + '&fn=' + $.trim(fn)
                    + '&ln=' + $.trim(ln)
                    + '&un=' + $.trim(un)
                    + '&em=' + $.trim(em)
                    + '&pw=' + $.trim(pw));

        var flag = true;
        var appElement = document.querySelector('[ng-app=dashboardApp]');
        var $scope = angular.element(appElement).scope();

        $scope.$apply(function() {
            if($scope.modalObj.s == status && $scope.modalObj.mk == remarks) {
                flag = false;
            }
            console.log("EYY");
        });
        if(flag) {
            $.ajax({
                type: "POST",
                url: "/settings/add/",
                data: $("#modalAddUser").serialize()
                    + '&fn=' + $.trim(fn)
                    + '&ln=' + $.trim(ln)
                    + '&un=' + $.trim(un)
                    + '&em=' + $.trim(em)
                    + '&pw=' + $.trim(pw),
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

        var formErrors = $("#modalAddUser .form-error:visible");
        $("#modal-details-wrapper-settings").css("height", ((formErrors.length * 45) + 630) + "px");
    });

    $("#modalEditUser").submit(function(e){
        var inpAdd = $(".inpEditMod");

        var userRegex = "[A-Za-z0-9_]{6,25}"; // alphanumeric and underscore (5-12 characters)
        var passRegex = "[A-Za-z0-9_]{6,25}"; // alphanumeric and underscore (6-15 characters)

        var usernameVal = inpAdd[0].value;
        var passVal1 = inpAdd[1].value;
        var passVal2 = inpAdd[2].value;

        // username check
        if(!usernameVal.match(userRegex)) {
            $(inpAdd[0]).css("border-bottom", "thin solid palevioletred");
            $("#err-mod-edit-uregex").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[0]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[0]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-edit-uregex").hide();
        }

        // password match check
        if(passVal1 != passVal2) {
            $(inpAdd[1]).css("border-bottom", "thin solid palevioletred");
            $(inpAdd[2]).css("border-bottom", "thin solid palevioletred");
            $("#err-mod-edit-pmatch").show();
            e.preventDefault(e);
        } else {
            $("#err-mod-edit-pmatch").hide();
        }

        // password regex check
        if(!passVal1.match(passRegex)) {
            $(inpAdd[1]).css("border-bottom", "thin solid palevioletred");
            $(inpAdd[2]).css("border-bottom", "thin solid palevioletred");
            $("#err-mod-edit-pregex").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[1]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[2]).css("border-bottom", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-edit-pregex").hide();
        }

        var ou = $("#modalEditUser #oldUsername").val();
        var un = $("#modalEditUser #username").val();
        var pw = $("#modalEditUser #password").val();

        console.log("Test " + $("#modalEditUser").serialize()
                    + '&ou=' + $.trim(ou)
                    + '&un=' + $.trim(un)
                    + '&pw=' + $.trim(pw));

        var flag = true;
        var appElement = document.querySelector('[ng-app=dashboardApp]');
        var $scope = angular.element(appElement).scope();

        $scope.$apply(function() {
            if($scope.modalObj.s == status && $scope.modalObj.mk == remarks) {
                flag = false;
            }
            console.log("EYY");
        });
        if(flag) {
            $.ajax({
                type: "POST",
                url: "/settings/edit/",
                data: $("#modalEditUser").serialize()
                    + '&ou=' + $.trim(ou)
                    + '&un=' + $.trim(un)
                    + '&pw=' + $.trim(pw),
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

        var formErrors = $("#modalEditUser .form-error:visible");
        $("#modal-details-wrapper-settings").css("height", ((formErrors.length * 40) + 410) + "px");
    });

// <<<<<<< HEAD
//    $("#changePswdAdmin").submit(function(e){
//        var un = $("#changePswdAdmin #username").val();
//        var op = $("#changePswdAdmin #oldPassword").val();
//        var pw = $("#changePswdAdmin #password").val();
//
//        console.log("Test " + $("#changePswdAdmin").serialize()
//                    + '&un=' + $.trim(un)
//                    + '&op=' + $.trim(op)
//                    + '&pw=' + $.trim(pw));
//
//        $.ajax({
//            type: "POST",
//            url: "/settings/admin_change/",
//            data: $("#changePswdAdmin").serialize()
//                + '&un=' + $.trim(un)
//                + '&op=' + $.trim(op)
//                + '&pw=' + $.trim(pw),
//            success: function (response) {
//                if (response.status == 1) {
//                    alert("Hello")
//
//                    window.location.href = "/";
//                } else {
//                }
//            }
//       });
//    });

// =======
    $("#set-default-term").submit(function(){
        var term = $("#submitTerm").find(":selected").text();
        var appElement = document.querySelector('[ng-app=dashboardApp]');
        var $scope = angular.element(appElement).scope();
        var flag = true;
        $scope.$apply(function() {
            console.log($scope.defaultTerm);
            console.log($scope.maps.default_term);
            if($scope.defaultTerm == $scope.maps.default_term) {
                flag = false;
            }
        });
        if(!flag) {
            return false;
        }
    });

    $("#change-sheet-settings").submit(function(){
        console.log("HEYYYYYY def");

    });
// >>>>>>> 5b0615523feec08b5663fc18d3459ff2f7795326
});