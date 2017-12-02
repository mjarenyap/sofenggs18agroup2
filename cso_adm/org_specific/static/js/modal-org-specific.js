console.log("MODAL OS");

$(document).ready(function() {
    $("#btn-comments").click(function() {

        $("#modal-details-wrapper-settings").css("height", "500px");
        $("div#modal-wrapper").css("display", "flex");
        $("div#modal-details-wrapper").css("display", "block");

    });

});