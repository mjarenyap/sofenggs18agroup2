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

    $(document).on("click", ".users-table button", function(e){
        var formErrors = $(".form-error").hide();
        var inpEdit = $(".inpEditMod");

        console.log("click .users=table button");

        for(i = 0; i < inpEdit.length; i++) {
            if (i != 0) {
                $(inpEdit[i]).val("");
            }
            $(inpEdit[i]).css("border", "thin solid var(--theme-grey-neutral-3)");
        }
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
        $("#modal-details-wrapper-settings").css("height", "410px");
    });

    $("#btn-add-user").click(function() {
        $(".form-error").hide();
        var inpAdd = $(".inpAddMod");

        for(i = 0; i < inpAdd.length; i++) {
            $(inpAdd[i]).val("");
            $(inpAdd[i]).css("border", "thin solid var(--theme-grey-neutral-3)");
        }

        $("#modal-details-wrapper-settings").css("height",  "630px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
    });

    var checkCount = 0;
    $(document).on("click", "td input:checkbox", function(e) {
        checkCount = 0;
        $("tr input:checkbox").each(function() {
            checkCount += (this.checked ? 1 : 0);
        });
        if(checkCount >= 1) {
            document.getElementById("btn-del-user").disabled = false;
        } else {
            document.getElementById("btn-del-user").disabled = true;
        }
    });

    $("#btn-del-user").click(function() {
        $("#modal-details-wrapper-settings").css("height", ((checkCount * 30) + 270) + "px");
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
            $(inpAdd[2]).css("border", "thin solid palevioletred");
            $("#err-mod-add-uregex").show();
            e.preventDefault(e);
        } else {
            $("#err-mod-add-uregex").hide();
            $(inpAdd[2]).css("border", "thin solid var(--theme-grey-neutral-3)");
        }

        // email check
        if(!emailRegex.test(emailVal)) {
            $("#err-mod-add-eregex").show();
            $(inpAdd[3]).css("border", "thin solid palevioletred");
            e.preventDefault(e);
        } else {
            $("#err-mod-add-eregex").hide();
            $(inpAdd[3]).css("border", "thin solid var(--theme-grey-neutral-3)");
        }

        // password check
        if(passVal1 != passVal2) {
            $("#err-mod-add-pmatch").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[4]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[5]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-add-pmatch").hide();
        }

        if(!passVal1.match(passRegex)) {
            $("#err-mod-add-pregex").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[4]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[5]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-add-pregex").hide();
        }

        if(passVal1 != passVal2 || !passVal1.match(passRegex)) {
            $(inpAdd[4]).css("border", "thin solid palevioletred");
            $(inpAdd[5]).css("border", "thin solid palevioletred");
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
            $(inpAdd[0]).css("border", "thin solid palevioletred");
            $("#err-mod-edit-uregex").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[0]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-edit-uregex").hide();
        }

        // password match check
        if(passVal1 != passVal2) {
            $(inpAdd[1]).css("border", "thin solid palevioletred");
            $(inpAdd[2]).css("border", "thin solid palevioletred");
            $("#err-mod-edit-pmatch").show();
            e.preventDefault(e);
        } else {
            $("#err-mod-edit-pmatch").hide();
        }

        // password regex check
        if(!passVal1.match(passRegex)) {
            $(inpAdd[1]).css("border", "thin solid palevioletred");
            $(inpAdd[2]).css("border", "thin solid palevioletred");
            $("#err-mod-edit-pregex").show();
            e.preventDefault(e);
        } else {
            $(inpAdd[1]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $(inpAdd[2]).css("border", "thin solid var(--theme-grey-neutral-3)");
            $("#err-mod-edit-pregex").hide();
        }

        var formErrors = $("#modalEditUser .form-error:visible");
        $("#modal-details-wrapper-settings").css("height", ((formErrors.length * 40) + 410) + "px");
    });
    
});