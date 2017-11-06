// javascript for the settings page handler

$(document).ready(function(){

	$("#edit-settings").css("display", "none");

	$("section.settings-tab-wrapper nav ul li").click(function(){
		$(this).addClass("active");

		if($(this).attr("id") == "manage"){
			$("#manage-users").css("display", "block");
			$("#edit-settings").css("display", "none");

			$("#edit").removeClass("active");
		}

		else{
			$("#manage-users").css("display", "none");
			$("#edit-settings").css("display", "block");

			$("#manage").removeClass("active");
		}
	});
});