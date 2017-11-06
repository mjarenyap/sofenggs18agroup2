// settings normalization javascript

$(document).ready(function(){
    var navHeight = $("nav").outerHeight();
    $("body").css("margin-top", navHeight);
});

$(window).scroll(function(){
    var navHeight = $("nav").outerHeight();
    var headerHeight = $("header").outerHeight();
    var settingsTabHeight = $("section.settings-tab-wrapper").outerHeight();
    var thHeight = $("table.post-acts-table tr.headers").outerHeight();
    var windowScroll = $(this).scrollTop();
    
    if(windowScroll >= navHeight + headerHeight - settingsTabHeight - 2){
        $("section.settings-tab-wrapper").addClass("sticky");
        $("section.settings-tab-wrapper").css("top", navHeight - 1);
        /*
        $("table.post-acts-table tr.headers").addClass("sticky");
        $("table.post-acts-table tr.headers").css("top", navHeight + settingsTabHeight - 1);
        $("table.post-acts-table tr.headers").css("left", 0);
        $("table.post-acts-table").css("padding-top", thHeight + 25);*/
        $("body").css("padding-top", settingsTabHeight);
    }
    
    else{
        $("section.settings-tab-wrapper").removeClass("sticky");
        $("section.settings-tab-wrapper").css("top", navHeight - 1);
        /*
        $("table.post-acts-table tr.headers").removeClass("sticky");
        $("table.post-acts-table").css("padding-top", "25px");
        */
        $("body").css("padding-top", 0);
    }
});