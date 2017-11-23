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
    console.log("page settings moodal!");
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

    $(document).on("click", "table.users-table tr td", function(e){
        $("#modal-details-wrapper-settings").css("height", "410px");
    });

    $("#btn-add-user").click(function() {
        console.log("BTN ADD USER");
        $("#modal-details-wrapper-settings").css("height", "630px");
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
        console.log("BTN DEL USER");
        $("#modal-details-wrapper-settings").css("height", ((checkCount * 30) + 270) + "px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");


    });

    $("#modalAddUser").submit(function(e){
        alert('modal add user submit intercepted');

        var inpAdd = $(".inpAddMod");
        console.log(inpAdd);
        console.log(inpAdd[2].value);
        var userRegex = "[A-Za-z0-9_]{5,12}";
        var usernameVal = inpAdd[2].value;

        // check valid
        if(!usernameVal.match(userRegex)) {
            alert("ERROR USER");
            $(inpAdd[2]).css("border", "thin solid palevioletred");
        } else {
            alert("OK USER");
        }

        e.preventDefault(e);
    });
/*
    $("div#modal-details-wrapper div.content-wrapper p").click(function(){
        $(this).select();
    });

    $("#modalForm").submit(function(){
        var status = $("#submitStatus").html();
        var cb = $("#submitCB").html();
        var dc = $("#submitDC").html();
        var remarks = $("#submitRemarks").html();

        console.log($("#modalForm").serialize()
                    + '&status=' + $.trim(status)
                    + '&cb=' + $.trim(cb)
                    + '&dc=' + encodeURIComponent(clean(dc))
                    + '&remarks=' + $.trim(remarks))

        $.ajax({
            type: "POST",
            url: "/update/",
            data: $("#modalForm").serialize()
                    + '&status=' + $.trim(status)
                    + '&cb=' + $.trim(cb)
                    + '&dc=' + encodeURIComponent(clean(dc))
                    + '&remarks=' + $.trim(remarks),
            success: function(response) {
                if (response.status == 1) {
                    window.location.href = response.url
                }
            }
        });
    });
    */
});