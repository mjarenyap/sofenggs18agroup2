console.log("MODAL OS");

$(document).ready(function() {
    $("#btn-comments").click(function() {

        $("div#modal-details-wrapper ul.tab-wrapper li").each(function(i, val) {
            if($(val).attr("data-id") == "commentContent")
                $(val).addClass("active");
        });
        $("#modal-details-wrapper-settings").css("height", "500px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");
        $("#commentContent").addClass("visible");


    });

});