// JavaScript Document
$(document).ready( function() {
	// add dialogs
	$(".dialog").dialog({
		autoOpen: false,
		minWidth: 520,
		minHeight: 500,
		buttons: [
			{
				text: "Ok",
				click: function() { eval($(this).attr('function')); $(this).dialog("close"); }
			},
			
			{
				text: "Cancel",
				click: function() { $(this).dialog("close"); }
			}
		]
	});
	
	// add tabs
	// module
	$(".tabs").tabs();
	// canvas
	// ajax to save the current canvas
	
	$("#save").click(function(){
		$("#saveForm").slideToggle();
	});
	
	$('#load-xml').click(function(){
		$('#loadXmlForm').slideToggle();
	});
	
	$('#saveButton').click(function(){	
		$.ajax({
			beforeSend: function() {
				Spinners.create('#spinner', {
					radii: [4,8],
					dashWidth: 1
				}).play();
				$("#message").text('Saving');
				$('#saveForm').slideToggle();
			},
			url: "save.jsp",
			data: "xml_file="+$('#xml_file'),
			success: function(data) {		
				Spinners.get("#spinner").remove();
				$('#message').text(data);
			}
		});
	});
	
	$('#loadFileButton').click(function(){
		$.ajax({
			beforeSend: function() {
				Spinners.create('#spinner', {
					radii: [4,8],
					dashWidth: 1
				}).play();
				$("#message").text('Loading the file');
				$('#loadXmlForm').slideToggle();
			},
			url: "load_xml.jsp",
			data: 'xmlFileName='+$('#xml_file_load'),
			success: function(data){
				Spinners.get("#spinner").remove();
				$('#message').text(data);
			}
		});
	});
	
	// buttons
	//$("input:button").button();
	
	
	$("#canvas").contextmenu(option);
	/*
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
		
	*/
});