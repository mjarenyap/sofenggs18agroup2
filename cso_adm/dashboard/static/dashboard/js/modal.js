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
    
    $('#modal-wrapper, .closeModal, .closeModal i').click(function(){
        $("div.error#saving_banner").css("display", "none");
        $('#modal-wrapper, #modal-details-wrapper').hide();
    });

    $('#modal-details-wrapper').click(function(e){
        e.stopPropagation();
    });

    $('#modal-details-wrapper-settings').click(function(e){
        e.stopPropagation();
    });

    $(document).on("click", "table.post-acts-table tr td, table.users-table tr td", function(e){
        if(event.target.type != "checkbox") {
            $("div#modal-wrapper").css("display", "flex");
            $("div#modal-details-wrapper").css("display", "block");
        }
    });
    
    $("div#modal-wrapper i.close").click(function(){
        $("div.error#saving_banner").css("display", "none");
        $("div#modal-wrapper").css("display", "none");
    });
    
    $("div#modal-details-wrapper #discard").click(function(){
        $("div#modal-wrapper").css("display", "none");
    });

    //  /// settings page
    // document.getElementById("btn-del-user").disabled = true;
    //
    // $(document).on("click", "table.users-table tr td", function(e){
    //     $("#modal-details-wrapper-settings").css("height", "410px");
    // });
    //
    // $("#btn-add-user").click(function() {
    //     console.log("BTN ADD USER");
    //     $("#modal-details-wrapper-settings").css("height", "630px");
    //     $("div#modal-wrapper").css("display", "flex");
    //     $("div#modal-details-wrapper").css("display", "block");
    // });
    //
    // var checkCount = 0;
    // $(document).on("click", "td input:checkbox", function(e) {
    //     checkCount = 0;
    //     $("tr input:checkbox").each(function() {
    //         checkCount += (this.checked ? 1 : 0);
    //     });
    //     if(checkCount >= 1) {
    //         document.getElementById("btn-del-user").disabled = false;
    //     } else {
    //         document.getElementById("btn-del-user").disabled = true;
    //     }
    // });
    //
    //
    //
    // $("#btn-del-user").click(function() {
    //     console.log("BTN DEL USER");
    //     $("#modal-details-wrapper-settings").css("height", ((checkCount * 30) + 270) + "px");
    //     $("div#modal-wrapper").css("display", "flex");
    //     $("div#modal-details-wrapper").css("display", "block");
    //
    //
    // });

/*
    $("div#modal-details-wrapper div.content-wrapper p").click(function(){
        $(this).select();
    });
*/
    $("#modalForm").submit(function(){
        $("div.error#saving_banner").css("display", "flex");
        $("p.messages#saving_msg").text("Saving...");
        var status = $("#submitStatus").find(":selected").text();
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
                    $("p.messages#saving_msg").text("Saved Successfully.");

                    window.location.href ="/";
                } else {
                    $("p.messages#saving_msg").text("Saved Failed.");
                }
            }
        });
    });
});
