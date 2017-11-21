// page normalization javascript

$(document).ready(function(){
    var navHeight = $("nav").outerHeight();
    $("body").css("margin-top", navHeight);
});

$(window).scroll(function(){
    var navHeight = $("nav").outerHeight();
    var headerHeight = $("header").outerHeight();
    var filterHeight = $("section.filter-wrapper").outerHeight();
    var thHeight = $("table.post-acts-table tr.headers").outerHeight();
    var windowScroll = $(this).scrollTop();
    
    if(windowScroll >= navHeight + headerHeight - filterHeight - 1){
        $("section.filter-wrapper").addClass("sticky");
        $("section.filter-wrapper").css("top", navHeight - 1);
        /*
        $("table.post-acts-table tr.headers").addClass("sticky");
        $("table.post-acts-table tr.headers").css("top", navHeight + filterHeight - 1);
        $("table.post-acts-table tr.headers").css("left", 0);
        $("table.post-acts-table").css("padding-top", thHeight + 25);*/
        $("body").css("padding-top", filterHeight);
    }
    
    else{
        $("section.filter-wrapper").removeClass("sticky");
        $("section.filter-wrapper").css("top", navHeight - 1);
        /*
        $("table.post-acts-table tr.headers").removeClass("sticky");
        $("table.post-acts-table").css("padding-top", "25px");
        */
        $("body").css("padding-top", 0);
    }
});