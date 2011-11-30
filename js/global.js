// JavaScript Document
$(document).ready( function() {
	
	var index_para = 0;
	
	var para2copy = '<div class="para2Copy" style="padding: 2px; text-align: center;">'+
		'<div style="float: left; width: 140px;"><input name="parameterName" type="text" id="parameterName" style="width: 120px;"/></div>'+
        '<div style="float: left; width: 120px;"><select name="fileTypes" id="fileTypes">'+
              '<option value="Directory" selected="selected">Directory</option>'+
              '<option value="Enumerated">Enumerated</option>'+
              '<option value="File">File</option>'+
              '<option value="Number">Number</option>'+
              '<option value="String">String</option>'+
              '<option value="Flow Control">Flow Control</option>'+
        '</select></div>'+
        '<div style="float: left; width: 80px;"><select name="state" id="state">'+
              '<option value="Enabled">Enabled</option>'+
              '<option value="Exported">Exported</option>'+
        '</select>'+
            '</div>'+
        '<div style="float: left; width: 60px;"><input name="required" type="checkbox" value="true" id="required" /></div>'+
        '<div style="float: left; width: 40px;"><input name="input" type="checkbox" value="true" id="input" /></div>'+
		'<div style="clear: both;"></div></div>';
	
	// dialogs misc
	$('#addParaButton').click(function(){
		$('#module-paraWrapper').append(para2copy);
	});
	
	$('#module-paraWrapper > .para2Copy').live("click", function(){
		index_para = $(this).parent().children().index(this);
		$(this).siblings().removeClass("highlight");
		$(this).toggleClass("highlight");
	});
	
	$('#removeParaButton').click(function(){
		$('#module-paraWrapper > .para2Copy').eq(index_para).detach();
	});
	
	// conditional
	$('#conditional-addParaButton').click(function(){
		$('#conditional-paraWrapper').append(para2copy);
	});
	
	$('#conditional-paraWrapper > .para2Copy').live("click", function(){
		index_para = $(this).parent().children().index(this);
		$(this).siblings().removeClass("highlight");
		$(this).toggleClass("highlight");
	});
	
	$('#conditional-removeParaButton').click(function(){
		$('#conditional-paraWrapper > .para2Copy').eq(index_para).detach();
	});
	
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
		$("#saveFormDiv").slideToggle();
	});
	
	$('#load-xml').click(function(){
		$('#loadFormDiv').slideToggle();
	});	
	
	
	var optionsSaveXML = {
		url: 'test.jsp',
		beforeSubmit: function() {
				Spinners.create('#spinner', {
					radii: [4,8],
					dashWidth: 1
				}).play();
				$("#message").text('Saving');
				$('#saveFormDiv').slideToggle();
			},
			data: {modulesArray: myModules,
				   connectionsArray: myConnections},
			target: "#responseAjax",
			success: function(data) {		
				Spinners.get("#spinner").remove();
				$('#message').text(data);
			}
	};
	
	var optionsLoadXML = {
		beforeSubmit: function() {
		  Spinners.create('#spinner', {
			  radii: [4,8],
			  dashWidth: 1
		  }).play();
		  $("#message").text('Loading the file');
		  $('#loadFormDiv').slideToggle();
		},
		data: {modulesArray: myModules,
				   connectionsArray: myConnections},
		success: function(data){
			Spinners.get("#spinner").remove();
			$('#message').text(data);
		}
	};
	
	$('#SaveXmlForm').ajaxForm(optionsSaveXML);
	$('#LoadXMLForm').ajaxForm(function(){});
	
	// buttons
	//$("input:button").button();
	
	
	$("#canvas").contextmenu(option);
	/*
	$("body").keydown(function(e){
		if (e.keyCode === 46)
			cutModule();
		else if (e.keyCode === 65)
		{
			if (e.ctrlKey)
				ctm_select_all();
		}
		else if (e.keyCode === 67)
		{
			if (e.ctrlKey)
				ctm_copy();
		}
		else if (e.keyCode === 86)
		{
			if (e.ctrlKey)
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