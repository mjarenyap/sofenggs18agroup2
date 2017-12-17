// javascript for the settings page handler

$(document).ready(function(){

	//$("#manage-users").css("display", "none");
	$("#manage-orgs").css("display", "none");
	$("#edit-settings").css("display", "none");
	$("#change-password").css("display", "none");

	$("section.settings-tab-wrapper nav ul li").click(function(){
		$("section.settings-tab-wrapper nav ul li").removeClass("active");
		$(this).addClass("active");
		if($(this).attr("id") == "audit"){
			//$("#audit-trail").css("display", "block");
			$("#manage-users").css("display", "none");
			$("#manage-orgs").css("display", "none");
			$("#edit-settings").css("display", "none");
			$("#change-password").css("display", "none");
		} else if($(this).attr("id") == "manage"){
			//$("#audit-trail").css("display", "none");
			$("#manage-users").css("display", "block");
			$("#manage-orgs").css("display", "none");
			$("#edit-settings").css("display", "none");
			$("#change-password").css("display", "none");
		} else if($(this).attr("id") == "organizations"){
			//$("#audit-trail").css("display", "none");
			$("#manage-users").css("display", "none");
			$("#manage-orgs").css("display", "block");
			$("#edit-settings").css("display", "none");
			$("#change-password").css("display", "none");
		} else if($(this).attr("id") == "edit"){
			//$("#audit-trail").css("display", "none");
			$("#manage-users").css("display", "none");
			$("#manage-orgs").css("display", "none");
			$("#edit-settings").css("display", "block");
			$("#change-password").css("display", "none");
		} else if($(this).attr("id") == "changePass"){
			//$("#audit-trail").css("display", "none");
			$("#manage-users").css("display", "none");
			$("#manage-orgs").css("display", "none");
			$("#edit-settings").css("display", "none");
			$("#change-password").css("display", "block");
		}
	});
});