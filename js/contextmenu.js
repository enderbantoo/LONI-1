var openModuleDialog = function(){	
	fillModuleId = -1;
	emptyDialog('#module-dialog');
	$("#module-dialog").dialog("open");
};

var openDataSourceDialog = function() {
	fillModuleId = -1;
	emptyDialog('#data-source-dialog');
	$("#data-source-dialog").dialog("open");
}

var openDataSinkDialog = function() {
	fillModuleId = -1;
	emptyDialog('#data-sink-dialog');
	$("#data-sink-dialog").dialog("open");
}

var openStudyDialog = function() {
	fillModuleId = -1;
	emptyDialog('#study-dialog');
	$("#study-dialog").dialog("open");
}

var openConditionalDialog = function() {
	fillModuleId = -1;
	emptyDialog('#conditional-dialog');
	$("#conditional-dialog").dialog("open");
}

//TODY
var emptyDialog = function() {
	$('.module-paraWrapper').empty();
	id2Delete = [];
	type2Delete = [];
}

function optionsSaveXml() {
	fillConnectionsArray();
	$('#SaveXmlForm').append('<input type="hidden" name="myModules" value="'+myModules+'" />');
	$('#SaveXmlForm').append('<input type="hidden" name="myConnections" value="'+myConnections+'" />');
	$('#SaveXmlForm').submit();
}
	
var para2copy_helper = function(InputOrOutput, IOId, name, type, input){
	var para2copy = '<div class="para2Copy" type="'+InputOrOutput+'" IOId="'+IOId+'" style="padding: 2px; text-align: center;">'+
		'<div style="float: left; width: 140px;"><input name="parameterName" type="text" id="parameterName" style="width: 120px;" value="'+name+'"/></div>'+
        '<div style="float: left; width: 120px;"><select name="fileTypes" id="fileTypes">'+
              '<option value="Directory"';
		if (type == 'Directory') para2copy += ' selected="selected"';	
		para2copy += '>Directory</option><option value="Enumerated"';
		if (type == 'Enumerated') para2copy += ' selected="selected"';	
		para2copy += '>Enumerated</option><option value="File"';
		if (type == 'File') para2copy += ' selected="selected"';	
		para2copy +='>File</option><option value="Number"';
		if (type == 'Number') para2copy += ' selected="selected"';	
		para2copy+='>Number</option><option value="String"';
		if (type == 'String') para2copy += ' selected="selected"';	
		para2copy += '>String</option><option value="Flow Control"';
		if (type == 'Flow Control') para2copy += ' selected="selected"';	
		para2copy +='>Flow Control</option>'+
        '</select></div>'+
        '<div style="float: left; width: 80px;"><select name="state" id="state">'+
              '<option value="Enabled">Enabled</option>'+
              '<option value="Exported">Exported</option>'+
        '</select>'+
            '</div>'+
        '<div style="float: left; width: 60px;"><input name="required" type="checkbox" value="true" id="required" /></div>'+
        '<div style="float: left; width: 40px;"><input name="input" type="checkbox" value="true" id="input" ';
		if(input) para2copy += 'checked="checked"';
		para2copy +='/></div>'+
		'<div style="clear: both;"></div></div>';
	
	return para2copy;
}

var fillModuleDialog = function(fillModule)
{
	if (fillModule.type == 'normal')
		var theDialog = $('#module-dialog');
	else
		var theDialog = $('#'+ fillModule.type +'-dialog');

	theDialog.find('#name').attr('value', fillModule.name);
	theDialog.find('#package').attr('value', fillModule.packaged);
	theDialog.find('#version').attr('value', fillModule.version);
	theDialog.find('#executableVersion').attr('value', fillModule.executableVersion);
	theDialog.find('#description').attr('value', fillModule.descriptions);
	
	for (var i = 0; i < fillModule.inputs.length;i++)
	{
		$('.module-paraWrapper').append(para2copy_helper('input', i, fillModule.inputs[i].name, fillModule.inputs[i].type, true));	
	}
	for (var i = 0; i < fillModule.outputs.length;i++)
	{
		$('.module-paraWrapper').append(para2copy_helper('output', i, fillModule.outputs[i].name, fillModule.outputs[i].type, false));
	}
}

function addInputOutput(checkModule, checked, name, type)
{
	if (checked == true)
	{
		checkModule.addInput(type,checkModule)
		{
			checkModule.inputs[checkModule.inputs.length].name = name;
			if (checkModule.type == "conditional") {
				checkModule.outputsTrue[checkModule.outputsTrue.length].name = name;
				checkModule.outputsFalse[checkModule.outputsFalse.length].name = name;
			}
		}
		checkModule.addOutput(type,checkModule)
		{
			checkModule.outputs[checkModule.inputs.length].name = name;
		}
	}
}


var editDialog = function() {
	emptyDialog();
	
			switch (myModules[fillModuleId].type)
			{
				case "normal":
				fillModuleDialog(myModules[fillModuleId]);
				$("#module-dialog").dialog("open");
				break;
				
				case "conditional":
				fillModuleDialog(myModules[fillModuleId]);
				$('#conditional-dialog [name="input"]').prop('checked', true).attr('disabled', 'disabled');
				$("#conditional-dialog").dialog("open");
				break;
				
				case "source":
				//fillModuleDialog(myModules[fillModuleId]);
				$("#data-source-dialog").dialog("open");
				break;
				
				case "sink":
				//fillModuleDialog(myModules[fillModuleId]);
				$("#data-sink-dialog").dialog("open");
				break;
				
				case "study":
				//fillModuleDialog(myModules[fillModuleId]);
				$("#study-dialog").dialog("open");
				break;
	}
}


function ctm_copy(){
	copyModules.splice(0, copyModules.length);
	//copy connections
	fillConnectionsArray();
	
	for (var i = 0; i < myModules.length; i++) {
		if (myModules[i].selected == true) {
		
			myModules[i].groupMoveOffsetX = testMouse.X - myModules[i].x;
			myModules[i].groupMoveOffsetY = testMouse.Y - myModules[i].y;
			
			var last = copyModules.length;
			copyModules[last] = new module;
			copyModules[last].copy(myModules[i]);
			
			myModules[i].copiedIndex = last;
		}
	}
	/*function connection(fromIndex,outputIndex,toIndex,inputIndex, isTrue, isFalse)
{
	this.fromIndex = fromIndex;
	this.outputIndex = outputIndex;
	this.toIndex = toIndex;
	this.inputIndex = inputIndex;
	this.isTrue = isTrue;
	this.isFalse = isFalse;
}*/
	for (var i = 0; i < myConnections.length; i++)
	{
		if (myConnections[i].isTrue == false && myConnections[i].isFalse == false) {
			if (myModules[myConnections[i].fromIndex].selected == true && myModules[myConnections[i].toIndex].selected == true) {
				copyModules[myModules[myConnections[i].fromIndex].copiedIndex].outputs[myConnections[i].outputIndex].connectOut(copyModules[myModules[myConnections[i].toIndex].copiedIndex].inputs[myConnections[i].inputIndex]);
			}
		}
		else if (myConnections[i].isTrue == true) {
			if (myModules[myConnections[i].fromIndex].selected == true && myModules[myConnections[i].toIndex].selected == true) {
				copyModules[myModules[myConnections[i].fromIndex].copiedIndex].outputsTrue[myConnections[i].outputIndex].connectOut(copyModules[myModules[myConnections[i].toIndex].copiedIndex].inputs[myConnections[i].inputIndex]);
			}
		}
		else //myConnections[i].isfalse == true
		{
			if (myModules[myConnections[i].fromIndex].selected == true && myModules[myConnections[i].toIndex].selected == true) {
				copyModules[myModules[myConnections[i].fromIndex].copiedIndex].outputsFalse[myConnections[i].outputIndex].connectOut(copyModules[myModules[myConnections[i].toIndex].copiedIndex].inputs[myConnections[i].inputIndex]);
			}
		}
	}
}

function ctm_select_all()
{
	for (var i=0;i<myModules.length;i++)
	{
		myModules[i].selected = true;
	}
}

function ctm_paste() {
	for (var i = 0; i < myModules.length; i++) {
		myModules[i].selected = false;
	}
	
	var previousLength = myModules.length;
	
	
	for(var i=0;i<copyModules.length;i++)
	{
		var last = myModules.length;
		myModules.push(copyModules[i]);
		myModules[last].x=testMouse.X-copyModules[i].groupMoveOffsetX;
		myModules[last].y=testMouse.Y-copyModules[i].groupMoveOffsetY;
	}
	for (var i = 0;i < myModules.length; i++)
	{
		switch (myModules[i].type)
		{
		case "sink":
			if (myModules[i].x < 30)
				myModules[i].x = 30;
			if (myModules[i].y < 20)
				myModules[i].y = 20;
		break;
		case "normal":
		if (myModules[i].x < 50)
				myModules[i].x = 50;
			if (myModules[i].y < 50)
				myModules[i].y = 50;
		break;
		case "study":
		case "source":
			if (myModules[i].x < 30)
				myModules[i].x = 30;
			if (myModules[i].y < 30)
				myModules[i].y = 30;
		break;
		case "conditional":
			if (myModules[i].x < 50)
			myModules[i].x = 50;
			if (myModules[i].y < 40)
				myModules[i].y = 40;
			break;
		}
	}
	for (var i=previousLength;i<myModules.length;i++)
	{
		myModules[i].selected = true;
	}
	fixBoundaries();
	
}

function menuAction() {
	alert(this.data.alias);
}


function ctm_modules() {
	createModule(testMouse.X,testMouse.Y,"normal", 0, 0);
}

function ctm_data_source() {
		createModule(testMouse.X,testMouse.Y,"source",0,1);
}

function ctm_study() {
		createModule(testMouse.X,testMouse.Y,"study",1,0);
}

function ctm_data_sink() {
		createModule(testMouse.X,testMouse.Y,"sink",1,0);
	
}

function ctm_conditional() {
		createModule(testMouse.X,testMouse.Y,"conditional",0,0);
}		

function cutModule() {
	for (var c=0;c<myModules.length;c++)
	{
		if (myModules[c].selected == true) {
			deleteModule(c);
			c--;
		}
	}
	if (lineSelection.selected == true) {
		for (var i = 0; i < lineSelection.fromOutput.inputsConnectedTo.length; i++) {
			if (lineSelection.toInput == lineSelection.fromOutput.inputsConnectedTo[i]) {
				lineSelection.fromOutput.inputsConnectedTo.splice(i, 1);
				break;
			}
		}
		for (var i = 0; i < lineSelection.toInput.outputsConnectedTo.length; i++) {
			if (lineSelection.fromOutput == lineSelection.toInput.outputsConnectedTo[i]) {
				lineSelection.toInput.outputsConnectedTo.splice(i, 1);
				break;
			}
		}
		lineSelection.selected = false;
		lineSelection.fromOutput = null;
		lineSelection.toInput = null;
	}
}

function ctm_rotate() {
	for (var c = 0; c < myModules.length;c++)
	{
		if (myModules[c].selected == true) {
			myModules[c].rotateModule();
		}
	}
}
