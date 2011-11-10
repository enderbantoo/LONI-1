// JavaScript Document
$(document).ready( function() {
	// add dialogs
	$("#module").dialog({
		autoOpen: false,
		minWidth: 520,
		minHeight: 500,
		buttons: [
			{
				text: "Ok",
				click: function() { ctm_modules(); $(this).dialog("close"); }
			},
			
			{
				text: "Cancel",
				click: function() { $(this).dialog("close"); }
			}
		]
	});
	
	// add tabs
	$("#module").tabs();
	$("#tabs-1").tabs();
	
	$("#canvas").contextmenu(option);
	
	$("body").keydown(function(e){
		if (e.keyCode === 46)
			cutModule();
		else if (e.keyCode === 17)
			input.ctrlFlag = true;
		else if (e.keyCode === 65)
		{
			if (input.ctrlFlag)
				ctm_select_all();
		}
		else if (e.keyCode === 67)
		{
			if (input.ctrlFlag)
				ctm_copy();
		}
		else if (e.keyCode === 86)
		{
			if (input.ctrlFlag)
				ctm_paste();
		}
		return false;
	})
	
	$("body").keydown(function(e){
		if (e.keyCode ===46)
			input.ctrlFlag = false;
		return false;
	})	
		
	
});