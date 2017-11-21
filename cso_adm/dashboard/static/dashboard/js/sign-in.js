// javascript for sign in form

$(document).ready(function(){
    $("nav button").click(function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $("form#sign-in").css("display", "none");
        }
        
        else{
            $(this).addClass("active");
            $("form#sign-in").css("display", "block");
            $("form#sign-in input#username").attr("autofocus", "true");
            $("form#sign-in input#username").select();
        }
    });

    $("p#form-close").click(function(){
        $("form#sign-in div.error").css("display", "none");
    });
});