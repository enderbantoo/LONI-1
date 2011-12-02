// JavaScript Document
// global
var fillModuleId = -1;
var IO2Delete = new Array();

$(document).ready( function() {
	

	(function($) {
		$.fn.setUpContextMenu = function() {
			$(this).dialog({
				autoOpen: false,
				modal: true,
				resizable: false,
				width: 'auto',
				height: 'auto',
				minHeight: 'auto',
				minWidth: 'auto'
			});
	
			return $(this);
		};
	
		$.fn.openContextMenu = function(jsEvent) {
			var menu = $(this);
			menu.css('padding', 0);
	
			menu.dialog('option', 'position', [jsEvent.clientX, jsEvent.clientY]);
			menu.unbind('dialogopen');
			menu.bind('dialogopen', function(event, ui) {
				$(this).siblings().hide();
				$('.ui-widget-overlay').unbind('click');
				$('.ui-widget-overlay').css('opacity', 0);
				$('.ui-widget-content').click(function() {
					menu.dialog('close');
				});
				$('.ui-widget-overlay').click(function() {
					menu.dialog('close');
				});
			});
			menu.dialog('open');
	
			return menu;
		};
	})(jQuery); 
	
	$('#canvas-context-menu').setUpContextMenu();
	$('#module-context-menu').setUpContextMenu();
	
	$('#module-context-menu a').each(function(index){
		$(this).bind('click', function(){
			eval($(this).attr('function'));
		});
	});


	document.oncontextmenu = function(e) {
		$('#module-context-menu').openContextMenu(e);
		return false;
	};
	
	$('#canvas').bind('contextmenu', function(e) {
	   $('#module-context-menu').openContextMenu(e);
	   return false;
	});


	var index_para = 0;
	
	var para2copy = '<div class="para2Copy" type="unknown" IOId="-1" style="padding: 2px; text-align: center;">'+
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
		// saving the input/output which is deleted
		var IOId = $('#module-paraWrapper > .para2Copy').eq(index_para).attr('IOId');
		if (IOId != -1)
			IO2Delete.push(IOId);
			
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
				click: function() { IO2Delete = []; $(this).dialog("close"); }
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
		beforeSubmit: function() {
				Spinners.create('#spinner', {
					radii: [4,8],
					dashWidth: 1
				}).play();
				$("#message").text('Saving');
				$('#saveFormDiv').slideToggle();
			},
			target: "#responseAjax",
			success: function(data) {		
				Spinners.get("#spinner").remove();
				$('#message').text(data);
			}
	};
	
	var optionsLoadXml = {
		dataType: 'json',
		beforeSubmit: function() {
		  Spinners.create('#spinner', {
			  radii: [4,8],
			  dashWidth: 1
		  }).play();
		  $("#message").text('Loading the file');
		  $('#loadFormDiv').slideToggle();
		},
		/*data: {sentModules: myModules,
				   sentConnections: myConnections},*/
		success: function(data){
			//console.log(data.myModules);
			//$('#module-dialog #name').attr('value', )
			myConnections=data.myConnections;
			myModuleArrays[tabSelected.index]=data.myModules;
			selectTab(tabSelected.index);
			fixModules();
			fillConnections();
			Spinners.get("#spinner").remove();
			$('#message').text('');
		}
	};
	
	$('#SaveXmlForm').ajaxForm(function(){});
	$('#LoadXmlForm').ajaxForm(optionsLoadXml);
	
	
	// buttons
	//$("input:button").button();

	
	
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