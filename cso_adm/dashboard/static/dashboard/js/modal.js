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
/*
    $("div#modal-details-wrapper div.content-wrapper p").click(function(){
        $(this).select();
    });
*/
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

});