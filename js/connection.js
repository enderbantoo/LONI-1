//todo
/*
 * copy paste inputs/outputs
 * scrollbars
 * 
*/

// JavaScript Document

//initial variables
var canvas;
var ctx;
var tabsCanvas;
var tabsCtx;
var buttonsCanvas;
var buttonsCtx;

var WIDTH = 800;
var HEIGHT = 600;
var myModules;
var myModuleArrays = new Array();
var omw_scrollpane;
var myConnections= new Array();

var Status = {      Preparing    :0,
   					validationPassed:1,
   					validationFailed:2,
   					Waiting      :3,
   					
   					waitingToSubmit:4,
   					Submitting   :5,   					
					Queued      :6,
					Running     :7,
					Complete    :8,
					Paused      :9,
					
					Stop        :10,
					Play        :11,
					
				    Stationary  :12,
					
					m_Error     :13,
					Backlogged  :14,
					Staging     :15,
					Incomplete  :16,
					Cancelled   :17,
										
					m_Reset       :18
					
						}
var buttonEvent = Status.m_Reset;
var totalTime  =0;
var processingLevel =1;
var isValid = true;
var isIncremented = false;
		 		 
//object literals

buttonDataOne = {
	value : "Start",
	hovered : false
}

buttonDataTwo = {
	value : "Stop",
	hovered : false
}
makingConnection= {
	x : 0,
	y : 0,
	connecting : false,
	output : null
}
tabSelected = {
	index : 0
}
selectionBox = {
	startX : 0,
	startY : 0,
	x : 0,
	y : 0,
	selecting : false
}
lineSelection = {
	selected : false,
	fromOutput : null,
	toInput : null
}
hoverPlus= {
	selected : false,
	hoverIndex : -1,
	hoveringIndex : false,
	hoverClose : false
}
testMouse = {
	X : -1,
	Y : -1
}

var copyModules = new Array();
init()
canvas.onmousedown = moduleMouseDown;
canvas.onmouseup = moduleMouseUp;
canvas.onmousemove = captureMousePosition; //'capture mouse saves mouse position
tabsCanvas.onmousemove = tabsMouseHover;
tabsCanvas.onmousedown = tabsMouseDown;
tabsCanvas.onmouseup = tabsMouseUp;
buttonsCanvas.onmousemove = buttonHover;
buttonsCanvas.onmousedown = buttonMouseDown;
buttonsCanvas.onmouseup = buttonMouseUp;
//class variables
function module(x,y,type,input,output)
 {
 	//basic variables
 	this.x=x;
	this.y=y;
	this.type=type;
	this.input=input;
	this.output=output;
	this.rotate=0;
	//connection + moving + copying
	this.dragOK = false;
	this.connecting=false;
	this.copiedIndex = -1;
	
	//methods
	this.checkConnection=checkConnection;
	this.checkConnected=checkConnected;
	this.checkMoving=checkMoving;
	this.rotateModule=rotateModule;
	this.copy=copy;
	this.formatModule = formatModule;
	this.addOutput = addOutput;
	this.addInput = addInput;
	//outputs
	this.outputs=new Array();	
	this.inputs=new Array();
	this.outputsTrue=new Array();
	this.outputsFalse=new Array();
	
	
	//selection and group move
	this.selected=false;
	this.groupMoveOffsetX = 0;
	this.groupMoveOffsetY = 0;
	
	//Youran Stuff
	this.status = Status.Stationary;
	this.message = "";
	this.jobNum = 2;
	this.sequence = -1;
	this.isComplete = false;
	this.lock = false;
	
	//radius
	switch(this.type)
	{
	case "normal":
		this.radius=56;
		break;
	case "conditional":
		this.radius=56;
		this.connectingTrue=false;
		this.connectingFalse=false;
		break;
	case "source":
	case "study":
		this.radius=28;
		break;
	case "sink":
		this.radius=35;
		break;
	}
	
	//information variables
	this.idNumber; //string
	this.Name;
	this.Authors = new Array();
	this.Citations = new Array();
	this.description;
	this.packaged;
	this.URI;
	this.tags = new Array();
	this.version;
	this.license;
	this.location;
	this.metadata;
	this.sourceCode;
	this.advancedOptions;
	this.executableAuthors = new Array();
	this.executableVersion;
	this.executableProvinence;
	//true or false
	this.IDAModule;
	this.XNATModule;
	this.MPIEnabled;
	this.preservedInputFileName;
	this.smartModule;
	
	this.variables = new Array();
	this.inputsToSystem = new Array();
	
	//connection information
	this.conIndex;
 }
 
function Output(type,parentModule)
{
	this.offsetX;
	this.offsetY;
	this.type = type;
	this.inputsConnectedTo = new Array();
	this.connectOut = connectOut;
	this.deleteOutput = deleteOutput;
	this.parentModule = parentModule;
	
	this.name = "";
	//information variables
	//this.outputID;
	this.outputIndex;
}
function deleteOutput(deleteOrSwap) //0: delete
{
	for (var i = this.outputIndex + 1; i < this.parentModule.outputs.length;i++)
	{
			this.parentModule.outputs[i].outputIndex--;
	}
	
	for (var i = 0; i < this.inputsConnectedTo.length;i++)
	{
		var toDelete = this.inputsConnectedTo[i];
		for (var j = 0;j < toDelete.outputsConnectedTo.length;j++)
		{
			if (toDelete.outputsConnectedTo[j] == this)
			{
				toDelete.outputsConnectedTo.splice(j,1);
				j--;
			}
		}
	}
	this.inputsConnectedTo.splice(0,this.inputsConnectedTo.length);
	if (deleteOrSwap == 1) //convert to Output
	{
		this.parentModule.addInput(this.type,this.parentModule)
		this.parentModule.inputs[this.parentModule.inputs.length-1].name=this.name;
	}
	this.parentModule.outputs.splice(this.outputIndex,1);
	this.parentModule.formatModule();
}

function Input(type,parentModule)
{
	this.offsetX;
	this.offsetY;
	this.type = type;
	this.outputsConnectedTo = new Array();
	this.parentModule = parentModule;
	this.deleteInput = deleteInput;
	this.name = "";
	//ifnormation variables
	this.inputID;
	this.inputIndex;
}

function deleteInput(deleteorSwap) // 0: delete
{
	
	
	for (var i = this.inputIndex + 1; i < this.parentModule.inputs.length;i++)
	{
			this.parentModule.inputs[i].inputIndex--;
	}
	
	for (var i = 0; i < this.outputsConnectedTo.length;i++)
	{
		var toDelete = this.outputsConnectedTo[i];
		for (var j = 0;j < toDelete.inputsConnectedTo.length;j++)
		{
			if (toDelete.inputsConnectedTo[j] == this)
			{
				toDelete.inputsConnectedTo.splice(j,1);
				j--;
			}
		}
	}
	this.outputsConnectedTo.splice(0,this.outputsConnectedTo.length);
	if (deleteorSwap == 1) //convert to Output
	{
		this.parentModule.addOutput(this.type,this.parentModule)
		this.parentModule.outputs[this.parentModule.outputs.length-1].name=this.name;
	}
	this.parentModule.inputs.splice(this.inputIndex,1);
	this.parentModule.formatModule();

	

}




function connectOut(input)
{
	this.inputsConnectedTo.push(input);
	input.outputsConnectedTo.push(this);
}

function copy(sourceModule)
{
 	this.x=sourceModule.x;
	this.y=sourceModule.y;
	this.type=sourceModule.type;
	this.input=sourceModule.input;
	this.output=sourceModule.output;
	this.dragOK = false;
	this.connecting = false;
	this.rotate=sourceModule.rotate;
	this.checkConnection=checkConnection;
	this.checkConnected=checkConnected;
	this.checkMoving=checkMoving;
	this.copy=copy;
	
	
	for (var p=0;p<sourceModule.outputs.length;p++)
	{
		this.addOutput(sourceModule.outputs[p].type);
	}
		
	
	for (var p=0;p<sourceModule.outputsTrue.length;p++)
	{
		this.addOutput(sourceModule.outputsTrue[p].type)
	}
	
	
	for (var p=0;p<sourceModule.outputsFalse.length;p++)
	{
		this.addOutput(sourceModule.outputsFalse[p].type)
	}
	
	for (var p=0;p<sourceModule.inputs.length;p++)
	{
		this.addInput(sourceModule.inputs[p].type);
	}
	
	this.selected=false;
	this.groupMoveOffsetX = sourceModule.groupMoveOffsetX;
	this.groupMoveOffsetY = sourceModule.groupMoveOffsetY;
	
	//information variables
	this.idNumber; //string
	this.Name = sourceModule.Name;
	
	for (var i = 0; i < sourceModule.Authors;i++)
	{
		this.Authors[i] = sourceModule.Authors[i]
	}
	
	for (var i = 0; i < sourceModule.Citations;i++)
	{
		this.Citations[i] = sourceModule.Citations[i]
	}
	this.description = sourceModule.description;
	this.packaged = sourceModule.packaged;
	this.URI = sourceModule.URI;
	
	for (var i = 0; i < sourceModule.tags;i++)
	{
		this.tags[i] = sourceModule.tags[i]
	}
	this.version = sourceModule.version;
	this.license = sourceModule.license;
	this.location = sourceModule.location;
	this.metadata = sourceModule.metadata;
	this.sourceCode = sourceModule.sourceCode;
	this.advancedOptions = sourceModule.advancedOptions;
	this.executableAuthors = new Array();
	for (var i = 0; i < sourceModule.executableAuthors;i++)
	{
		this.executableAuthors[i] = sourceModule.executableAuthors[i]
	}
	this.executableVersion = sourceModule.excecutableVersion;
	this.executableProvinence = sourceModule.excecutableProvinence;
	//true or false
	this.IDAModule = sourceModule.IDAModule;
	this.XNATModule = sourceModule.XNATModule;
	this.MPIEnabled = sourceModule.MPIEnabled;
	this.preservedInputFileName = sourceModule.preservedInputFileName;
	this.smartModule = sourceModule.smartModule;
	
	for (var i = 0; i < sourceModule.variables;i++)
	{
		this.variables[i] = sourceModule.variables[i]
	}
	for (var i = 0; i < sourceModule.inputsToSystem;i++)
	{
		this.inputsToSystem[i] = sourceModule.inputsToSystem[i]
	}	
}
 
 function checkMoving (mouseX,mouseY,offsetLeft,offsetTop)
 {
 	
	switch(this.type)
	{
	case "normal":
	 	if (mouseX < this.x + 45 + offsetLeft &&
			mouseX > this.x - 45 + offsetLeft &&
			mouseY < this.y + 45 + offsetTop &&
			mouseY > this.y - 45 + offsetTop)
				return true;
		else 	
			return false;
	
	case "conditional":
		if (mouseX < this.x + 45 + offsetLeft &&
			mouseX > this.x - 45 + offsetLeft &&
			mouseY < this.y + 45 + offsetTop &&
			mouseY > this.y - 45 + offsetTop)
				return true;
		else 	
			return false;
			
	case "source":
	case "study":
		if (mouseX < this.x + 25 + offsetLeft &&
			mouseX > this.x - 25 + offsetLeft &&
			mouseY < this.y + 25 + offsetTop &&
			mouseY > this.y - 25 + offsetTop)
				return true;
		else 	
			return false;	
	
	case "sink":
		if (mouseX < this.x + 25 + offsetLeft &&
			mouseX > this.x - 25 + offsetLeft &&
			mouseY < this.y + 25 + offsetTop &&
			mouseY > this.y - 25 + offsetTop)
				return true;
		else 	
			return false;		
	}	
 }
 function checkConnected(mouseX,mouseY,offsetLeft,offsetTop)
 {
 	switch(this.type)
	{
	case "normal":
	case "conditional":
	case "sink":
		for (var i = 0;i < this.inputs.length;i++) {
			if (mouseX < this.x + this.inputs[i].offsetX + 7 + offsetLeft &&
			mouseX > this.x + this.inputs[i].offsetX  - 7 + offsetLeft &&
			mouseY < this.y + this.inputs[i].offsetY + 7  + offsetTop &&
			mouseY > this.y + this.inputs[i].offsetY - 7 + offsetTop) {
				this.connecting = true;
				return this.inputs[i];
			}
		}
		break;
	default:
		return null;
	}
	return null;
 }
 function checkConnection (mouseX,mouseY,offsetLeft,offsetTop)
 {
 	switch(this.type)
	{
		
	case "normal":
	case "source":
	case "study":
		for (var i = 0;i < this.outputs.length;i++) {
			if (mouseX < this.x + this.outputs[i].offsetX + 7 + offsetLeft &&
			mouseX > this.x + this.outputs[i].offsetX  - 7 + offsetLeft &&
			mouseY < this.y + this.outputs[i].offsetY + 7  + offsetTop &&
			mouseY > this.y + this.outputs[i].offsetY - 7 + offsetTop) {
				this.connecting = true;
				return this.outputs[i];
			}
		}
		break;	
	case "conditional":
		for (var i = 0;i < this.inputs.length;i++) {
			if (mouseX < this.x + this.outputsTrue[i].offsetX + 7 + offsetLeft &&
			mouseX > this.x + this.outputsTrue[i].offsetX  - 7 + offsetLeft &&
			mouseY < this.y + this.outputsTrue[i].offsetY + 7  + offsetTop &&
			mouseY > this.y + this.outputsTrue[i].offsetY - 7 + offsetTop) {
				this.connecting = true;
				return this.outputsTrue[i];
			}
			else 
				if (mouseX < this.x + this.outputsFalse[i].offsetX + 7 + offsetLeft &&
			mouseX > this.x + this.outputsFalse[i].offsetX  - 7 + offsetLeft &&
			mouseY < this.y + this.outputsFalse[i].offsetY + 7  + offsetTop &&
			mouseY > this.y + this.outputsFalse[i].offsetY - 7 + offsetTop) {
				this.connecting = true;
				return this.outputsFalse[i];
			}
		}
		break;
	default:
		break;
	}
	return null; 
 }
 
  //============================================
 //        Button Manipulations
 //============================================
 
 
 //============================================
 //        Tab Manipulations
 //============================================
 
 function selectTab(index)
 {
 	myModules = myModuleArrays[index];
	tabSelected.index = index;
	setBoundaries();
 }
 function addTab()
 {
 	tabSelected.index = myModuleArrays.length;
 	myModuleArrays[tabSelected.index] = new Array();
	myModules = myModuleArrays[tabSelected.index];
	setBoundaries();
 }
 
 function tabsMouseDown(e)
 {	
 	var i;
	for (i = 0; i < myModuleArrays.length;i++)
	{
	if (e.pageX < 100 + 100 * i + tabsCanvas.offsetLeft &&
	e.pageX > 100 * i + tabsCanvas.offsetLeft) {
		if (e.pageX < 30 + 100 * i + tabsCanvas.offsetLeft &&
		e.pageX > 20 + 100 * i + tabsCanvas.offsetLeft &&
		e.pageY < 19 + tabsCanvas.offsetTop &&
		e.pageY > 9 + tabsCanvas.offsetTop) {
			myModuleArrays.splice(i,1);
			
			if (myModuleArrays.length == 0)
				addTab();
			else if (i == tabSelected.index)
				selectTab(0);
		}
		else
			selectTab(i);
	}
		
	}
	if (e.pageX < 25 + 100*i + tabsCanvas.offsetLeft &&
	    e.pageX > 100*i + tabsCanvas.offsetLeft )
		addTab();
 }
 function tabsMouseUp()

 {
 	
 }

function tabsMouseHover(e)
{
	var i = 0;
	for (i = 0; i < myModuleArrays.length;i++)
	{
		if (e.pageX < 100 +100*i + tabsCanvas.offsetLeft &&
	    e.pageX >100*i + tabsCanvas.offsetLeft )
		{
			hoverPlus.hoverIndex = i;
			hoverPlus.hoveringIndex = true;
			hoverPlus.selected = false;
			
			if (e.pageX < 30+100*i + tabsCanvas.offsetLeft &&
	    		e.pageX > 20+100*i + tabsCanvas.offsetLeft &&
				e.pageY < 19 + tabsCanvas.offsetTop &&
	    		e.pageY > 9 + tabsCanvas.offsetTop)
					hoverPlus.hoverClose = true;	
			else
					hoverPlus.hoverClose = false;
			return;
		}
			
	}
	if (e.pageX < 25 +100*i + tabsCanvas.offsetLeft &&
	    e.pageX > 100*i + tabsCanvas.offsetLeft )
		hoverPlus.selected = true;
	else
		hoverPlus.selected = false;
}

function setBoundaries()
{
	var maxWidth = findMaxX();
	var maxHeight = findMaxY();
	
	canvas.width = maxWidth + 100;
	if (canvas.width < 700)
		canvas.width = 700;
		
	canvas.height = maxHeight + 100;
	if (canvas.height < 600)
		canvas.height = 600;
		
}

function fixBoundaries() //make cleaner solution
{
	var maxWidth = findMaxX();
	var maxHeight = findMaxY();
	
	if (maxWidth + 100 > canvas.width) {
		canvas.width = canvas.width + 100;
		omw_scrollpane.scrollLeft +=75;
	}
	else 
		if (maxWidth + 200 < canvas.width && canvas.width > 700) 
			canvas.width = canvas.width - 100;
	if (canvas.width < 700)
		canvas.width = 700;
		
	if (maxHeight + 100 > canvas.height) {
		canvas.height = canvas.height + 100;
		omw_scrollpane.scrollTop +=75;
	}
	else 
		if (maxHeight + 200 < canvas.height && canvas.height > 600) 
			canvas.height = canvas.height - 100;
	if (canvas.height < 600)
		canvas.height = 600;
}

function findMaxX()
{
	var maxX = 0;
	for (var i = 0;i < myModules.length;i++)
	{
		if (myModules[i].x > maxX)
		{
			maxX = myModules[i].x;
		}
	}
	return maxX;
}
function findMaxY()
{
	var maxY = 0;
	for (var i = 0;i < myModules.length;i++)
	{
		if (myModules[i].y > maxY)
		{
			maxY = myModules[i].y;
		}
	}
	return maxY;
}


//=============================================
//         Button Manipulations
//=============================================
function buttonMouseDown(e)
{
	if (e.pageX < 420 + buttonsCanvas.offsetLeft &&
	    e.pageX > 360 + buttonsCanvas.offsetLeft &&
		e.pageY > 0.2*(e.pageX - 360 - buttonsCanvas.offsetLeft) + buttonsCanvas.offsetTop &&
		e.pageY < -0.2*(e.pageX - 360 - buttonsCanvas.offsetLeft)+ buttonsCanvas.offsetTop + 40)
	{
		buttonCheck();
	}
	else if (e.pageX < 340 + buttonsCanvas.offsetLeft &&
	    e.pageX > 280 + buttonsCanvas.offsetLeft &&
		e.pageY < 0.2*(e.pageX - 280 - buttonsCanvas.offsetLeft) + buttonsCanvas.offsetTop + 26 &&
		e.pageY > -0.2*(e.pageX - 280 - buttonsCanvas.offsetLeft)+ buttonsCanvas.offsetTop + 14)
	{
		buttonCheck_2();
	}
	return;	
}
function buttonMouseUp(e)
{
	//dunno
}
function buttonHover(e)
{
	if (e.pageX < 420 + buttonsCanvas.offsetLeft &&
	    e.pageX > 360 + buttonsCanvas.offsetLeft &&
		e.pageY > 0.2*(e.pageX - 360 - buttonsCanvas.offsetLeft) + buttonsCanvas.offsetTop &&
		e.pageY < -0.2*(e.pageX - 360 - buttonsCanvas.offsetLeft)+ buttonsCanvas.offsetTop + 40)
	{
		buttonDataOne.hovered = true;
		buttonDataTwo.hovered = false;
	}
	else if (e.pageX < 340 + buttonsCanvas.offsetLeft &&
	    e.pageX > 280 + buttonsCanvas.offsetLeft &&
		e.pageY < 0.2*(e.pageX - 280 - buttonsCanvas.offsetLeft) + buttonsCanvas.offsetTop + 26 &&
		e.pageY > -0.2*(e.pageX - 280 - buttonsCanvas.offsetLeft)+ buttonsCanvas.offsetTop + 14)
	{
		buttonDataOne.hovered = false;
		buttonDataTwo.hovered = true;
	}
	else
	{
		buttonDataOne.hovered = false;
		buttonDataTwo.hovered = false;
	}
}

function buttonCheck() {
    if(buttonDataOne.value == "Start") {
		setAnimationOrder();
        buttonDataOne.value = "Pause";
        buttonEvent = Status.Play;
		isValid=true;

    } else {
        buttonDataOne.value = "Start";
        buttonEvent = Status.Paused;
    }
}

function buttonCheck_2() {
    if(buttonDataTwo.value == "Stop") {
        buttonDataTwo.value = "Reset";
        buttonEvent = Status.Stop;
		buttonDataOne.value = "Start";

    } else {
		//resetting
		buttonDataOne.value = "Start";
		for (var i = 0; i < myModules.length;i++)
		{
			myModules[i].status = Status.Stationary;
			processingLevel =1;
			isValid = true;
			isIncremented = false;
		 
		}
        buttonDataTwo.value = "Stop";
        buttonEvent = Status.m_Reset;
    }
}
 //============================================
 //        Module Manipulations
 //============================================
 
function decreaseIO(type, index_para) { //
	var para = $('.para2Copy[type="'+type+'"][ioid!="-1"]').filter(':eq('+index_para+'), :gt('+index_para+')');
	$(para).each(function(){
		$(this).attr('ioid', $(this).attr('ioid') - 1);
	});
}
 
 function createModule(x,y,type,input,output)
{
 	var index=myModules.length;
	if(fillModuleId != -1){ // not creating a new module
		var module1 = myModules[fillModuleId];
		for (var i = 0; i < IO2Delete.length; ++i) {
			//delete input/output
			if (IO2Delete[i][0] == 'input') {
				module1.inputs[IODelete[i][1]].deleteInput(0);
				decreaseIO('input', IO2Delete[i][2]);
			}
			else {
				module1.outputs[IO2Delete[i][1]].deleteOutput(0);
				decreaseIO('output', IO2Delete[i][2]);
			}	
		}
		IO2Delete = [];
		
	}
	else 
		var module1=new module(x,y,type,input,output);
	
	switch (type) {
		case "normal":
		case "conditional":
			if (type == "normal"){
				var theDialog = $('#module-dialog');
				var para = $('#module-dialog .para2Copy');
			}
			else {
				var theDialog = $('#conditional-dialog');
				var para = $('#conditional-dialog .para2Copy');
			}
			
			
			para.each(function(index) {
				var id = $(this).attr('IOId');
				var IOtype = $(this).attr('type');
				var fileType = $(this).children().find("#fileTypes").attr('value');
				var name = $(this).children().find("#parameterName").attr('value');
				var checkbox = $(this).children().find("#input");
				
                if (id != -1) { // modifying
                	if (IOtype == 'input') {
						module1.inputs[id].name = name;
						module1.inputs[id].type = fileType;
					}
					else {
						module1.outputs[id].name = name;
						module1.outputs[id].type = fileType;
					}
					
					// converting if any
					if (IOtype == 'input' && !checkbox.is(':checked')) { // to output
						module1.inputs[id].deleteInput(1);
						decreaseIO('input', index);
					}
					if (IOtype == 'output' && checkbox.is(':checked')) { // to input
						module1.outputs[id].deleteOutput(1);	
						decreaseIO('output', index);
					}
				} else {
					if (checkbox.is(':checked')) // input
						module1.addInput(fileType);
					else
						module1.addOutput(fileType);
				}
            });
		break;
		
		case "source":
		case "sink":
		case "study":
			var theDialog = $('#'+type+'-dialog');
			if (type == "sink") {
				if (module1.inputs.length == 0) 
					module1.addInput("");
			}
			else {
				if (module1.outputs.length == 0) 
				
					module1.addOutput("");
			}
			break;
	}
	module1.name = theDialog.find('#name').attr('value');
	module1.packaged = theDialog.find('#package').attr('value');
	module1.version = theDialog.find('#version').attr('value');
	module1.executableVersion = theDialog.find('#executableVersion').attr('value');
	module1.descriptions = theDialog.find('#description').attr('value');
	 myModules[index]=module1;
	 IO2Delete = [];
}
 
 function deleteModule(index){
 	switch (myModules[index].type) {
 		case "normal":
 		case "source":
 		case "sink":
 		case "study":
 			for (var i = 0; i < myModules[index].outputs.length; i++) {
				for (var j = 0; j < myModules[index].outputs[i].inputsConnectedTo.length;j++) {
					for (var k = 0; k < myModules[index].outputs[i].inputsConnectedTo[j].outputsConnectedTo.length; k++) {
						if (myModules[index].outputs[i].inputsConnectedTo[j].outputsConnectedTo[k] = this)
							myModules[index].outputs[i].inputsConnectedTo[j].outputsConnectedTo.splice(k,1);
					}
					//myModules[index].outputs[i].inputsConnectedTo.splice(j, 1);
				}
 			}
 			
 			for (var i = 0; i < myModules[index].inputs.length; i++) {
				for (var j = 0; j < myModules[index].inputs[i].outputsConnectedTo.length;j++) {
					for (var k = 0; k < myModules[index].inputs[i].outputsConnectedTo[j].inputsConnectedTo.length; k++) {
						if (myModules[index].inputs[i].outputsConnectedTo[j].inputsConnectedTo[k] = this)
							myModules[index].inputs[i].outputsConnectedTo[j].inputsConnectedTo.splice(k,1);
					}
					//myModules[index].inputs[i].outputsConnectedTo.splice(j,1);
				}
 			}
 			break;
 		case "conditional":
 			for (var i = 0; i < myModules[index].inputs.length; i++) {
				for (var j = 0; j < myModules[index].inputs[i].outputsConnectedTo.length;j++) {
					for (var k = 0; k < myModules[index].inputs[i].outputsConnectedTo[j].inputsConnectedTo.length; k++) {
						if (myModules[index].inputs[i].outputsConnectedTo[j].inputsConnectedTo[k] = this)
							myModules[index].inputs[i].outputsConnectedTo[j].inputsConnectedTo.splice(k,1);
					}
					//myModules[index].inputs[i].outputsConnectedTo.splice(j,1);
				}
 			for (var j = 0; j < myModules[index].outputsTrue[i].inputsConnectedTo.length;j++) {
					for (var k = 0; k < myModules[index].outputsTrue[i].inputsConnectedTo[j].outputsConnectedTo.length; k++) {
						if (myModules[index].outputsTrue[i].inputsConnectedTo[j].outputsConnectedTo[k] = this)
							myModules[index].outputsTrue[i].inputsConnectedTo[j].outputsConnectedTo.splice(k,1);
					}
					//myModules[index].outputsTru[i].inputsConnectedTo.splice(j,1);
				}
			for (var j = 0; j < myModules[index].outputsFalse[i].inputsConnectedTo.length;j++) {
					for (var k = 0; k < myModules[index].outputsFalse[i].inputsConnectedTo[j].outputsConnectedTo.length; k++) {
						if (myModules[index].outputsFalse[i].inputsConnectedTo[j].outputsConnectedTo[k] = this)
							myModules[index].outputsFalse[i].inputsConnectedTo[j].outputsConnectedTo.splice(k,1);
					}
					//myModules[index].outputsFalse[i].inputsConnectedTo.splice(j,1);
				}	
 			}
 	}
	myModules.splice(index, 1);
 }
 
function formatModule()
{
	switch(this.type)
	{
	case "normal":
		for (var i = 0; i < this.inputs.length; i++)
		{
			this.inputs[i].offsetY = -58;
			if (i % 2 == 0)
				this.inputs[i].offsetX = i*10-(i/2)*10;
			else
				this.inputs[i].offsetX = 0-i*10+Math.floor(i/2)*10;
		}
		
		for (var i = 0; i < this.outputs.length; i++)
		{
			this.outputs[i].offsetY = 58;
			if (i % 2 == 0)
				this.outputs[i].offsetX = i*10-(i/2)*10;
			else
				this.outputs[i].offsetX = 0-i*10+Math.floor(i/2)*10;
		}
		return;
		
	case "source":
	case "study":
		for (var i = 0; i < this.outputs.length; i++)
		{
			this.outputs[i].offsetY = 37;
			if (i % 2 == 0)
				this.outputs[i].offsetX =  i*10-(i/2)*10;
			else
				this.outputs[i].offsetX = 0-i*10+Math.floor(i/2)*10;
		}
		return;
		
	case "sink":
		for (var i = 0; i < this.inputs.length; i++)
		{
			this.inputs[i].offsetY = -37;
			if (i % 2 == 0)
				this.inputs[i].offsetX = i*10-(i/2)*10;
			else
				this.inputs[i].offsetX = 0-i*10+Math.floor(i/2)*10;
		}
		return;
		
	case "conditional":
		for (var i = 0; i < this.inputs.length; i++) {
			this.inputs[i].offsetY = -45;
			if (i % 2 == 0) 
				this.inputs[i].offsetX = i*10-(i/2)*10;
			else 
				this.inputs[i].offsetX = 0-i*10+Math.floor(i/2)*10;
		
			this.outputsTrue[i].offsetY = 45;
			this.outputsFalse[i].offsetY = 45;
			if (i % 2 == 0) {
				this.outputsTrue[i].offsetX = 0-10-10*i;
				this.outputsFalse[i].offsetX = 10+10*i;

			}
			else {
				this.outputsTrue[i].offsetX = 0-10-10*i;
				this.outputsFalse[i].offsetX = 10+10*i
			
			}
		}
		return;
	}
}

function addInput(type)
{
	if (this.type != "conditional")
	{
		this.inputs[this.inputs.length] = new Input(type,this);
	}
	else
	{
		this.inputs[this.inputs.length] = new Input(type,this);
		this.outputsTrue[this.outputsTrue.length]= new Output(type,this);
		this.outputsFalse[this.outputsFalse.length]= new Output(type,this);
	}
	this.formatModule();	
}

function addOutput(type)
{
	this.outputs[this.outputs.length]= new Output(type,this);
	this.formatModule();
}

function moveModule(e){
	testMouse.X = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	testMouse.Y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
	
	for (var i = 0; i < myModules.length; i++)
	{
		if (myModules[i].dragOK == true) {
			myModules[i].x = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft - myModules[i].groupMoveOffsetX;
			myModules[i].y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop - myModules[i].groupMoveOffsetY;
			
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
			
			if (myModules[i].selected == true)
			{
				for (var k=0;k<myModules.length;k++)
				{
					if (k != i && myModules[k].selected == true)
					{
						myModules[k].x = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft - myModules[k].groupMoveOffsetX;
						myModules[k].y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop - myModules[k].groupMoveOffsetY;
						
						switch (myModules[k].type)
						{
						case "sink":
							if (myModules[k].x < 30)
								myModules[k].x = 30;
							if (myModules[k].y < 20)
								myModules[k].y = 20;
						break;
						case "normal":
							if (myModules[k].x < 50)
								myModules[k].x = 50;
							if (myModules[k].y < 50)
								myModules[k].y = 50;
						break;
						case "study":
						case "source":
							if (myModules[k].x < 30)
								myModules[k].x = 30;
							if (myModules[k].y < 30)
								myModules[k].y = 30;
						break;
						case "conditional":
							if (myModules[k].x < 50)
								myModules[k].x = 50;
							if (myModules[k].y < 40)
								myModules[k].y = 40;
							break;
						}
					}
				}
				fixBoundaries();
			}
		return;
		}
	}
}
 
function moveLine(e)
{
	testMouse.X = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	testMouse.Y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
	
	
	makingConnection.x = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	makingConnection.y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;

}

function selectBox(e)
{
	testMouse.X = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	testMouse.Y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
	
	
	selectionBox.x = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	selectionBox.y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
}

function checkSelected()
{
	var maxX;
	var maxY;
	var minX;
	var minY;
	
	if (selectionBox.startX < selectionBox.x)
	{
		minX = selectionBox.startX;
		maxX = selectionBox.x;
	}	
	else
	{
		minX = selectionBox.x;
		maxX = selectionBox.startX;
	}	
	
	if (selectionBox.startY < selectionBox.y)
	{
		minY = selectionBox.startY;
		maxY = selectionBox.y;
	}	
	else
	{
		minY = selectionBox.y;
		maxY = selectionBox.startY;
	}		
		
	for (var i=0;i<myModules.length;i++)
	{
		if (myModules[i].x < maxX && myModules[i].x > minX &&
			myModules[i].y < maxY && myModules[i].y > minY)
		{
			myModules[i].selected = true;	
		}
	}
}

function rotateModule()
{
	if (this.rotate==0)
		this.rotate=1;
	else
		this.rotate=0;
		
	for (var i = 0; i < this.inputs.length;i++)
	{
		var placeHolder = this.inputs[i].offsetX;
		this.inputs[i].offsetX = this.inputs[i].offsetY;
		this.inputs[i].offsetY = placeHolder;
	}
	
	for (var i = 0; i < this.outputs.length;i++)
	{
		var placeHolder = this.outputs[i].offsetX;
		this.outputs[i].offsetX = this.outputs[i].offsetY;
		this.outputs[i].offsetY = placeHolder;
	}
	
	for (var i = 0; i < this.outputsTrue.length;i++)
	{
		var placeHolder = this.outputsTrue[i].offsetX;
		this.outputsTrue[i].offsetX = this.outputsTrue[i].offsetY;
		this.outputsTrue[i].offsetY = placeHolder;
	}
	
	for (var i = 0; i < this.outputsFalse.length;i++)
	{
		var placeHolder = this.outputsFalse[i].offsetX;
		this.outputsFalse[i].offsetX = this.outputsFalse[i].offsetY;
		this.outputsFalse[i].offsetY = placeHolder;
	}
	
}


function connection(fromIndex,outputIndex,toIndex,inputIndex, isTrue, isFalse)
{
	this.fromIndex = fromIndex;
	this.outputIndex = outputIndex;
	this.toIndex = toIndex;
	this.inputIndex = inputIndex;
	this.isTrue = isTrue;
	this.isFalse = isFalse;
}

function fillConnectionsArray()
{
	for (var i = 0;i < myModules.length;i++)
	{
		myModules[i].conIndex = i;
		for (var j = 0; j < myModules[i].inputs.length;j++)
		{
			myModules[i].inputs[j].inputIndex = j;	
		}
		if (myModules[i].type != "conditional") {
			for (var j = 0; j < myModules[i].outputs.length; j++) {
				myModules[i].outputs[j].outputIndex = j;
			}
		}
		else {
			for (var j = 0; j < myModules[i].outputsTrue.length; j++) {
				myModules[i].outputsTrue[j].outputIndex = j;
			}
			for (var j = 0; j < myModules[i].outputsFalse.length; j++) {
				myModules[i].outputsFalse[j].outputIndex = j;
			}
		}
		
	}
	myConnections.splice(0,myConnections.length);
	for (var i =0; i < myModules.length;i++)
	{
		if (myModules[i].type != "conditional") {
			for (var j = 0; j < myModules[i].outputs.length; j++) {
			
				for (var k = 0; k < myModules[i].outputs[j].inputsConnectedTo.length; k++) {
					if (myModules[i].outputs[j].inputsConnectedTo[k] != null) {
						var newConnection = new connection(i, j, myModules[i].outputs[j].inputsConnectedTo[k].parentModule.conIndex, myModules[i].outputs[j].inputsConnectedTo[k].inputIndex, false, false)
						myConnections.push(newConnection)
					}
				}
			}
		}
		else {
			for (var j = 0; j < myModules[i].outputsTrue.length; j++) {
			
				for (var k = 0; k < myModules[i].outputsTrue[j].inputsConnectedTo.length; k++) {
					if (myModules[i].outputsTrue[j].inputsConnectedTo[k] != null) {
						var newConnection = new connection(i, j, myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.conIndex, myModules[i].outputsTrue[j].inputsConnectedTo[k].inputIndex, true, false)
						myConnections.push(newConnection)
					}
				}
			}
			for (var j = 0; j < myModules[i].outputsFalse.length; j++) {
			
				for (var k = 0; k < myModules[i].outputsFalse[j].inputsConnectedTo.length; k++) {
					if (myModules[i].outputsFalse[j].inputsConnectedTo[k] != null) {
						var newConnection = new connection(i, j, myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.conIndex, myModules[i].outputsFalse[j].inputsConnectedTo[k].inputIndex, false, true)
						myConnections.push(newConnection)
					}
				}
			}
		}
	}
}

function fillConnections()
{
	for (var i = 0; i < myConnections.length; i++)
	{
		
		if (myConnections[i].isTrue == false && myConnections[i].isFalse == false) {
			myModules[myConnections[i].fromIndex].outputs[myConnections[i].outputIndex].connectOut(myModules[myConnections[i].toIndex].inputs[myConnections[i].inputIndex]);
		}
		else if (myConnections[i].isTrue == true) {
			myModules[myConnections[i].fromIndex].outputsTrue[myConnections[i].outputIndex].connectOut(myModules[myConnections[i].toIndex].inputs[myConnections[i].inputIndex]);

		}
		else //myConnections[i].isfalse == true
		{
			myModules[myConnections[i].fromIndex].outputsFalse[myConnections[i].outputIndex].connectOut(myModules[myConnections[i].toIndex].inputs[myConnections[i].inputIndex]);

		}
	}
	return;
}

function fixModules()
{
	for (var i = 0; i < myModules.length;i++)
	{
		
	
		//connection + moving + copying
		myModules[i].dragOK = false;
		myModules[i].connecting=false;
		myModules[i].copiedIndex = -1;
		
		myModules[i].checkConnection=checkConnection;
		myModules[i].checkConnected=checkConnected;
		myModules[i].checkMoving=checkMoving;
		myModules[i].rotateModule=rotateModule;
		myModules[i].copy=copy;
		myModules[i].formatModule = formatModule;
		myModules[i].addOutput = addOutput;
		myModules[i].addInput = addInput;
		//outputs		
		
		//selection and group move
		myModules[i].selected=false;
		myModules[i].groupMoveOffsetX = 0;
		myModules[i].groupMoveOffsetY = 0;
		
		//Youran Stuff
		myModules[i].status = Status.Stationary;
		myModules[i].message = "";
		myModules[i].jobNum = 2;
		myModules[i].sequence = -1;
		myModules[i].isComplete = false;
		myModules[i].lock = false;
		
	
		
		switch(myModules[i].type)
		{
		case "normal":
			myModules[i].radius=56;
			for (var j = 0; j < myModules[i].outputs.length;j++)
			{
				myModules[i].outputs[j].offsetX;
				myModules[i].outputs[j].offsetY;
				myModules[i].outputsTrue = new Array();
				myModules[i].outputsFalse = new Array();
				
				myModules[i].outputs[j].inputsConnectedTo = new Array();
				myModules[i].outputs[j].deleteOutput = deleteOutput;
				myModules[i].outputs[j].connectOut = connectOut;
				myModules[i].outputs[j].parentModule = myModules[i];
				
				myModules[i].outputs[j].outputIndex = j;
			}
			
			for (var j = 0; j < myModules[i].inputs.length;j++)
			{
				myModules[i].inputs[j].offsetX;
				myModules[i].inputs[j].offsetY;
				
				myModules[i].inputs[j].deleteInput = deleteInput;
				myModules[i].inputs[j].outputsConnectedTo = new Array();
				myModules[i].inputs[j].parentModule = myModules[i];
				
	
				myModules[i].inputs[j].inputIndex = j;
			}
			break;
		case "conditional":
			myModules[i].radius=56;
			myModules[i].outputs = new Array();
			for (var j = 0; j < myModules[i].outputsTrue.length;j++)
			{
				myModules[i].outputsTrue[j].offsetX;
				myModules[i].outputsTrue[j].offsetY;
				
				myModules[i].outputsTrue[j].inputsConnectedTo = new Array();
				myModules[i].outputsTrue[j].connectOut = connectOut;
				myModules[i].outputsTrue[j].parentModule = myModules[i];
				
				myModules[i].outputsTrue[j].outputIndex = j;
			}
			for (var j = 0; j < myModules[i].outputsFalse.length;j++)
			{
				myModules[i].outputsFalse[j].offsetX;
				myModules[i].outputsFalse[j].offsetY;
				
				myModules[i].outputsFalse[j].inputsConnectedTo = new Array();
				
				myModules[i].outputsFalse[j].connectOut = connectOut;
				myModules[i].outputsFalse[j].parentModule = myModules[i];
				
				myModules[i].outputsFalse[j].outputIndex = j;
			}
			
			for (var j = 0; j < myModules[i].inputs.length;j++)
			{
				myModules[i].inputs[j].offsetX;
				myModules[i].inputs[j].offsetY;
	
				myModules[i].inputs[j].outputsConnectedTo = new Array();
				myModules[i].inputs[j].parentModule = myModules[i];
				
	
				myModules[i].inputs[j].inputIndex = j;
			}
			break;
		case "source":
		case "study":
			myModules[i].radius=28;
			myModules[i].inputs = new Array();
			for (var j = 0; j < myModules[i].outputs.length;j++)
			{
				myModules[i].outputs[j].offsetX;
				myModules[i].outputs[j].offsetY;
				myModules[i].outputsTrue = new Array();
				myModules[i].outputsFalse = new Array();
				
				myModules[i].outputs[j].inputsConnectedTo = new Array();
				myModules[i].outputs[j].deleteOutput = deleteOutput;
				myModules[i].outputs[j].connectOut = connectOut;
				myModules[i].outputs[j].parentModule = myModules[i];
				
				myModules[i].outputs[j].outputIndex = j;
			}
			break;
		case "sink":
			myModules[i].radius=35;
			myModules[i].outputs = new Array();
			for (var j = 0; j < myModules[i].inputs.length;j++)
			{
				myModules[i].inputs[j].offsetX;
				myModules[i].inputs[j].offsetY;
				myModules[i].inputs[j].deleteInput = deleteInput;
				myModules[i].outputsTrue = new Array();
				myModules[i].outputsFalse = new Array();
				myModules[i].outputs = new Array();
				myModules[i].inputs[j].outputsConnectedTo = new Array();
				myModules[i].inputs[j].parentModule = myModules[i];
				
	
				myModules[i].inputs[j].inputIndex = j;
			}
			break;
		}
	myModules[i].formatModule();
	if (myModules[i].rotate == 1)
	{
		myModules[i].rotate = 0;
		myModules[i].rotateModule();
	}
	//connection information
	myModules.conIndex;
	}
}

//============================================
//        Mouse Manipulations
//============================================
function moduleMouseDown(e){
	if (e.button == 2) //right click
	{
		var inOutside = true;
		//check if right click selecting
		for (var i = 0; i < myModules.length; i++) {
			if (myModules[i].checkMoving(e.pageX + omw_scrollpane.scrollLeft, e.pageY + omw_scrollpane.scrollTop, canvas.offsetLeft, canvas.offsetTop)) {
				fillModuleId = i;
				//console.log(fillModuleId);
				if (myModules[i].selected == true) {
					inOutside = false;
					$('#module-context-menu').openContextMenu(this);
					break;
				}
				else {
					//if not selected reset selection and select
					for (var k = 0; k < myModules.length; k++) {
						myModules[k].selected = false;
					}
					lineSelection.selected = false;
					lineSelection.fromOutput = null;
					lineSelection.toInput = null;
					
					myModules[i].selected = true;
					
					inOutside = false;
					//document.bind('contextmenu', function(e) {
					$('#module-context-menu').openContextMenu(this);
					//return false;
					
					
					
					
					
					break;
				}
			}
		}
		if (inOutside == true)
		{
			$('#canvas-context-menu').openContextMenu(this);
		}
		testMouse.X = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
		testMouse.Y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
		return;
	}

	//check if moving module
	for (var i = 0; i < myModules.length; i++) {
		if (myModules[i].checkMoving(e.pageX + omw_scrollpane.scrollLeft, e.pageY + omw_scrollpane.scrollTop, canvas.offsetLeft, canvas.offsetTop)) {
			
			//if not selected reset selection
			if (myModules[i].selected == false)
			{
					for (var k = 0; k < myModules.length; k++) {
						myModules[k].selected = false;
					}
					lineSelection.selected = false;
					lineSelection.fromOutput = null;
					lineSelection.toInput = null;
			}
			else
			{
				for (var k=0;k < myModules.length;k++)
				{
					if (i != k && myModules[k].selected == true)
					{
						myModules[k].groupMoveOffsetX = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft - myModules[k].x;
						myModules[k].groupMoveOffsetY = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop- myModules[k].y;
					}
				}
			}
			myModules[i].groupMoveOffsetX = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft - myModules[i].x;
			myModules[i].groupMoveOffsetY = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop- myModules[i].y;
			//myModules[i].x = e.pageX - canvas.offsetLeft;
			//myModules[i].y = e.pageY - canvas.offsetTop;
			myModules[i].dragOK = true;
			canvas.onmousemove = moveModule;
			myModules[i].selected = true;
			return;
		}
	}
	
	//if not moving, reset selection
	for (var i = 0; i < myModules.length; i++) {
		myModules[i].selected = false;
	}
	lineSelection.selected = false;
	lineSelection.fromOutput = null;
	lineSelection.toInput = null;
	
	//check if connecting
	for (var i = 0; i < myModules.length; i++) {		
		var connectionStart = myModules[i].checkConnection (e.pageX + omw_scrollpane.scrollLeft,e.pageY + omw_scrollpane.scrollTop,canvas.offsetLeft,canvas.offsetTop);

		if (connectionStart != null) {
			makingConnection.connecting = true;
			makingConnection.output = connectionStart;
			makingConnection.x = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
			makingConnection.y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
			canvas.onmousemove = moveLine;
			return;
		}
	}
	
	//check if selecting line.
	for (var i=0; i < myModules.length; i++)
	{
		switch(myModules[i].type)
		{
		case "normal":
		case "source":
		case "study":
			for (var j=0;j<myModules[i].outputs.length;j++)
			{
				for (var k = 0; k < myModules[i].outputs[j].inputsConnectedTo.length; k++) {
					if (myModules[i].outputs[j].inputsConnectedTo[k] == null) 
						continue;
					
					var startX = myModules[i].x + myModules[i].outputs[j].offsetX;
					var startY = myModules[i].y + myModules[i].outputs[j].offsetY;
					var startRotate = myModules[i].rotate;
					var endX = myModules[i].outputs[j].inputsConnectedTo[k].parentModule.x + myModules[i].outputs[j].inputsConnectedTo[k].offsetX;
					var endY = myModules[i].outputs[j].inputsConnectedTo[k].parentModule.y + myModules[i].outputs[j].inputsConnectedTo[k].offsetY;
					var endRotate = myModules[i].outputs[j].inputsConnectedTo[k].parentModule.rotate;
					
					if (clickConnection(startX, startY, endX, endY, startRotate, endRotate,e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft,e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop)) {
						lineSelection.selected = true;
						lineSelection.fromOutput = myModules[i].outputs[j];
						lineSelection.toInput = myModules[i].outputs[j].inputsConnectedTo[k];
						}
				}
			}
			break;
			
		case "conditional":
			for (var j=0;j<myModules[i].outputsTrue.length;j++)
			{
				for (var k = 0; k < myModules[i].outputsTrue[j].inputsConnectedTo.length; k++) {
					if (myModules[i].outputsTrue[j].inputsConnectedTo[k] == null) 
						continue;
					
					var startX = myModules[i].x + myModules[i].outputsTrue[j].offsetX;
					var startY = myModules[i].y + myModules[i].outputsTrue[j].offsetY;
					var startRotate = myModules[i].rotate;
					var endX = myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.x + myModules[i].outputsTrue[j].inputsConnectedTo[k].offsetX;
					var endY = myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.y + myModules[i].outputsTrue[j].inputsConnectedTo[k].offsetY;
					var endRotate = myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.rotate;
					
					if (clickConnection(startX, startY, endX, endY, startRotate, endRotate)) {
						lineSelection.selected = true;
						lineSelection.fromOutput = myModules[i].outputsTrue[j];
						lineSelection.toInput = myModules[i].outputsTrue[j].inpustConnectedTo[k];
					}
				}
			}
			
			for (var j=0;j<myModules[i].outputsFalse.length;j++)
			{	
				for (var k = 0; k < myModules[i].outputsFalse[j].inputsConnectedTo.length; k++) {
					if (myModules[i].outputsFalse[j].inputsConnectedTo[k] == null) 
						continue;
					
					var startX = myModules[i].x + myModules[i].outputsFalse[j].offsetX;
					var startY = myModules[i].y + myModules[i].outputsFalse[j].offsetY;
					var startRotate = myModules[i].rotate;
					var endX = myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.x + myModules[i].outputsFalse[j].inputsConnectedTo[k].offsetX;
					var endY = myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.y + myModules[i].outputsFalse[j].inputsConnectedTo[k].offsetY;
					var endRotate = myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.rotate;
					
					if (clickConnection(startX, startY, endX, endY, startRotate, endRotate)) {
						lineSelection.selected = true;
						lineSelection.fromOutput = myModules[i].outputsFalse[j];
						lineSelection.toInput = myModules[i].outputsFalse[j].inputsConnectedTo[k];
					}
				}
			}
			break;
			
		default:
			break;
		}
	}
	
	
	//otherwise start dragging selection box.
	selectionBox.startX = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	selectionBox.startY = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
	selectionBox.x = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	selectionBox.y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
	canvas.onmousemove = selectBox;
	selectionBox.selecting = true;
}

function moduleMouseUp(e){
	if (e.button == 2)
		return;
	if (makingConnection.connecting == true) {
		for (var i = 0; i < myModules.length; i++) {
			var checkConnect = myModules[i].checkConnected(e.pageX + omw_scrollpane.scrollLeft, e.pageY + omw_scrollpane.scrollTop, canvas.offsetLeft, canvas.offsetTop)
			/*if (checkConnect != null) {
				var doubleFlag = false;
				switch (makingConnection.output.parentModule.type) {
					case "normal":
					case "source":
					case "study":
						for (var k = 0; k < makingConnection.output.parentModule.outputs.size; k++) {
							if (makingConnection.output.parentModule.outputs[k].inputConnectedTo == checkConnect) {
								doubleFlag = true;
							}
						}
						break;
					case "conditional":
						for (var k = 0; k < makingConnection.output.parentModule.outputsTrue.size; k++) {
							if (makingConnection.output.parentModule.outputsTrue[k].inputConnectedTo == checkConnect) {
								doubleFlag = true;
							}
						}
						for (var k = 0; k < makingConnection.output.parentModule.outputsFalse.size; k++) {
							if (makingConnection.output.parentModule.outputsFalse[k].inputConnectedTo == checkConnect) {
								doubleFlag = true;
							}
						}
						
				}
				if (doubleFlag == false && checkConnect != null)*/
				if (checkConnect != null && (checkConnect.parentModule != makingConnection.output.parentModule) && (checkConnect.type == makingConnection.output.type ||
				    checkConnect.parentModule.type == "study" || checkConnect.parentModule.type == "sink" || checkConnect.parentModule.type == "source" ||
					 makingConnection.output.parentModule.type == "study" || makingConnection.output.parentModule.type == "sink" ||makingConnection.output.parentModule.type == "source")) {
					makingConnection.output.connectOut(checkConnect);
					break;
				}
			}
		}
	//handle selecting
	if (selectionBox.selecting == true)
	{
		checkSelected()
		selectionBox.selecting = false;
		selectionBox.x = 0;
		selectionBox.y = 0;
		selectionBox.startX = 0;
		selectionBox.startY = 0;
	}
	
	//reset values
	for (var i = 0; i < myModules.length; i++) {
		myModules[i].dragOK = false;
		myModules[i].connecting=false;
		myModules[i].connectingTrue=false;
		myModules[i].connectingFalse=false;
	}
	
	makingConnection.connecting=false;
	makingConnection.output = false;
	canvas.onmousemove = captureMousePosition; //'capture mouse saves mouse position
	
	selectionBox.selecting = false;

	
	
} 
 
function captureMousePosition(e)
{
	testMouse.X = e.pageX + omw_scrollpane.scrollLeft - canvas.offsetLeft;
	testMouse.Y = e.pageY + omw_scrollpane.scrollTop - canvas.offsetTop;
}
 
//=============================================== 
//initial conditions
//===============================================
function init()
{
	
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
     tabsCanvas = document.getElementById("tabsCanvas");
	 tabsCtx = tabsCanvas.getContext("2d");  
	 omw_scrollpane = document.getElementById("omw_scrollpane");
	 buttonsCanvas = document.getElementById("buttonsCanvas");
	 buttonsCtx = buttonsCanvas.getContext("2d");
	 
		addTab();
		createModule(75,50,"normal",1,1);
		createModule(75,50,"normal",5,5);
		createModule(75,50,"normal",1,1);
		//createModule(500,200,"conditional",10,0);
		createModule(150,150,"source",0,1);
		//myModules[0].addOutput("file");
		createModule(300,300,"sink",1,0);
		myModules[1].addInput("file");
	 return setInterval(draw, 10);
}

//============================================
//        Animation Functions
//============================================
function setAnimationOrder()
{
	//initialize to -1
	for (var i = 0; i < myModules.length; i++)
	{
		myModules[i].sequence = -1;
	}
	//find roots
	for (var i = 0; i < myModules.length; i++)
	{
		if (myModules[i].type == "source" || myModules[i].type == "study")
		{
			myModules[i].sequence = 0;
			continue;
		}
		else if (myModules[i].type == "sink")
		{
			continue;
		}
		var isRoot = true;
		var hasInputs = false;
		for (var j = 0; j < myModules[i].inputs.length; j++)
		{
			hasInputs = true;
			if (myModules[i].inputs[j].outputsConnectedTo.length > 0)
			{
				isRoot = false;
				break;
			}
		}
		if (isRoot == true && hasInputs == false)
			myModules[i].sequence = 0;
	}
	
	//recursively follow each root's children
	for (var i = 0; i < myModules.length; i++) {
		if (myModules[i].sequence == 0) {
			if (myModules[i].type != "conditional") {
				for (var j = 0; j < myModules[i].outputs.length; j++) {
					for (var k = 0; k < myModules[i].outputs[j].inputsConnectedTo.length; k++) {
						setChildOrder(myModules[i].outputs[j].inputsConnectedTo[k], 0);
					}
				}
			}
			if (myModules[i].type == "conditional") {
				for (var j = 0; j < myModules[i].outputsTrue.length; j++) {
					for (var k = 0; k < myModules[i].outputsTrue[j].inputsConnectedTo.length; k++) {
						setChildOrder(myModules[i].outputsTrue[j].inputsConnectedTo[k], 0);
					}
				}
				for (var j = 0; j < myModules[i].outputsFalse.length; j++) {
					for (var k = 0; k < myModules[i].outputsFalse[j].inputsConnectedTo.length; k++) {
						setChildOrder(myModules[i].outputsFalse[j].inputsConnectedTo[k], 0);
					}
				}
			}
		}
		else 
			continue;	
	}
	
}

function setChildOrder(input, x)
{
	if (input == null)
		return;
	x++;		
	if (x > input.parentModule.sequence)
		input.parentModule.sequence = x;
	
	//recursively call on all the input's parent's children
	if (input.parentModule.type != "conditional" && input.parentModule.type != "sink") {
		for (var i = 0; i < input.parentModule.outputs.length; i++) {
			for (var j = 0; j < input.parentModule.outputs[i].inputsConnectedTo.length; j++) {
				if (input.parentModule.outputs[i].inputsConnectedTo[j] != null) {
					setChildOrder(input.parentModule.outputs[i].inputsConnectedTo[j], x);
				}
			}
		}
	}
	else if ( input.parentModule.type == "conditional"){
		for (var i = 0; i < input.parentModule.outputsTrue.length; i++) {
			for (var j = 0; j < input.parentModule.outputsTrue[i].inputsConnectedTo.length; j++) {
				if (input.parentModule.outputsTrue[i].inputsConnectedTo[j] != null) {
					setChildOrder(input.parentModule.outputsTrue[i].inputsConnectedTo[j], x);
				}
			}
		}
		for (var i = 0; i < input.parentModule.outputsFalse.length; i++) {
			for (var j = 0; j < input.parentModule.outputsFalse[i].inputsConnectedTo.length; j++) {
				if (input.parentModule.outputsFalse[i].inputsConnectedTo[j] != null) {
					setChildOrder(input.parentModule.outputsFalse[i].inputsConnectedTo[j], x);
				}
			}
		}
	}
}
//============================================
//        Draw Functions
//============================================
function clear() 
{
 	ctx.clearRect(0, 0, canvas.width,canvas.height);
}
function draw(){
	clear();
	ctx.strokeStyle="black";
	
	
	//Draw the connections
	ctx.strokeStyle="#7585C1";
	for (var i=0; i < myModules.length; i++)
	{
		switch(myModules[i].type)
		{
		case "normal":
		case "source":
		case "study":
			for (var j=0;j<myModules[i].outputs.length;j++)
			{
				for (var k = 0;k<myModules[i].outputs[j].inputsConnectedTo.length;k++) { //continue ... ? [8]
					if (myModules[i].outputs[j].inputsConnectedTo[k] != null) {
						if (myModules[i].outputs[j].inputsConnectedTo[k].parentModule.selected == true || myModules[i].selected == true) 
							ctx.strokeStyle = "#99CC32";
						else 
							ctx.strokeStyle = "#7585C1";
						
						var startX = myModules[i].x + myModules[i].outputs[j].offsetX;
						var startY = myModules[i].y + myModules[i].outputs[j].offsetY;
						var startRotate = myModules[i].rotate;
						var endX = myModules[i].outputs[j].inputsConnectedTo[k].parentModule.x + myModules[i].outputs[j].inputsConnectedTo[k].offsetX;
						var endY = myModules[i].outputs[j].inputsConnectedTo[k].parentModule.y + myModules[i].outputs[j].inputsConnectedTo[k].offsetY;
						var endRotate = myModules[i].outputs[j].inputsConnectedTo[k].parentModule.rotate;
						
						if (myModules[i].outputs[j] == lineSelection.fromOutput && myModules[i].outputs[j].inputsConnectedTo[k] == lineSelection.toInput) 
							ctx.strokeStyle = "#99CC32";
						drawConnection(startX, startY, endX, endY, startRotate, endRotate);
					}
				}
			}
			break;
			
		case "conditional":
			for (var j=0;j<myModules[i].outputsTrue.length;j++)
			{
				for (var k = 0;k<myModules[i].outputsTrue[j].inputsConnectedTo.length;k++) {
					if (myModules[i].outputsTrue[j].inputsConnectedTo[k] != null) {
						if (myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.selected == true || myModules[i].selected == true) 
							ctx.strokeStyle = "#99CC32";
						else 
							ctx.strokeStyle = "#7585C1";
						
						var startX = myModules[i].x + myModules[i].outputsTrue[j].offsetX;
						var startY = myModules[i].y + myModules[i].outputsTrue[j].offsetY;
						var startRotate = myModules[i].rotate;
						var endX = myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.x + myModules[i].outputsTrue[j].inputsConnectedTo[k].offsetX;
						var endY = myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.y + myModules[i].outputsTrue[j].inputsConnectedTo[k].offsetY;
						var endRotate = myModules[i].outputsTrue[j].inputsConnectedTo[k].parentModule.rotate;
						
						if (myModules[i].outputsTrue[j] == lineSelection.fromOutput && myModules[i].outputsTrue[j].inputsConnectedTo[k] == lineSelection.toInput) 
							ctx.strokeStyle = "#99CC32";
						drawConnection(startX, startY, endX, endY, startRotate, endRotate);
					
					}
				}
			}
			
			for (var j=0;j<myModules[i].outputsFalse.length;j++)
			{
				
				for (var k = 0;k<myModules[i].outputsFalse[j].inputsConnectedTo.length;k++) {
					if (myModules[i].outputsFalse[j].inputsConnectedTo != null) {
						if (myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.selected == true || myModules[i].selected == true) 
							ctx.strokeStyle = "#99CC32";
						else 
							ctx.strokeStyle = "#7585C1";
						
						var startX = myModules[i].x + myModules[i].outputsFalse[j].offsetX;
						var startY = myModules[i].y + myModules[i].outputsFalse[j].offsetY;
						var startRotate = myModules[i].rotate;
						var endX = myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.x + myModules[i].outputsFalse[j].inputsConnectedTo[k].offsetX;
						var endY = myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.y + myModules[i].outputsFalse[j].inputsConnectedTo[k].offsetY;
						var endRotate = myModules[i].outputsFalse[j].inputsConnectedTo[k].parentModule.rotate;
						
						if (myModules[i].outputsFalse[j] == lineSelection.fromOutput && myModules[i].outputsFalse[j].inputsConnectedTo[k] == lineSelection.toInput) 
							ctx.strokeStyle = "#99CC32";
						drawConnection(startX, startY, endX, endY, startRotate, endRotate);
					}
				}
			}
			break;
		}
	}
	
	//Draw the Modules
	for (var i = 0; i < myModules.length; i++)
	{
		isIncremented = false;
		animate(myModules[i]);
		var drawModule=myModules[i];
		switch(drawModule.type)
		{
		case "normal":
			drawNormal(drawModule);
			break;
			
		case "conditional":
			drawConditional(drawModule);
			break;
		case "source":
			drawSource(drawModule);
			break;
		case "sink":
			drawSink(drawModule);
			break;
		case "study":
			drawStudy(drawModule);
			break;
		default:
		
		}
	}
	
	ctx.strokeStyle = "black";
	
	//drawing selection box
	if (selectionBox.selecting == true)
	{
		var maxX;
		var maxY;
		var minX;
		var minY;
		
		if (selectionBox.startX < selectionBox.x)
		{
			minX = selectionBox.startX;
			maxX = selectionBox.x;
		}	
		else
		{
			minX = selectionBox.x;
			maxX = selectionBox.startX;
		}	
		
		if (selectionBox.startY < selectionBox.y) {
			minY = selectionBox.startY;
			maxY = selectionBox.y;
		}
		else 
		{
			minY = selectionBox.y;
			maxY = selectionBox.startY;
		}
		var width = maxX - minX;
		var height = maxY - minY;
		
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeRect(minX,minY,width,height);
		ctx.lineWidth = 3;
		
		
			
	}
	
	ctx.lineWidth = "3";
	ctx.strokeStyle="#7585C1";
	//Drawing a Line
	if (makingConnection.connecting==true)
	{
		var startX = makingConnection.output.parentModule.x+makingConnection.output.offsetX;
		var startY = makingConnection.output.parentModule.y+makingConnection.output.offsetY;
		var parentRotate = makingConnection.output.parentModule.rotate;
		drawConnection(startX,startY, testMouse.X,testMouse.Y ,parentRotate,0)
		
		//display input type if hovering
		for (var i = 0; i < myModules.length; i++)
		{
			var hoverInput = myModules[i].checkConnected(testMouse.X,testMouse.Y,0,0);
			if (hoverInput != null)
			{
				if (makingConnection.output.type == hoverInput.type)
					ctx.fillStyle = "blue";
				else
					ctx.fillStyle = "red";
				ctx.lineWidth = "2";
				ctx.fillText(hoverInput.type,hoverInput.parentModule.x+hoverInput.offsetX+7,hoverInput.parentModule.y+hoverInput.offsetY-10);
				break;
			}
		}
	}
	ctx.lineWidth = "3";
	
	
	//============================================================
	tabsCtx.clearRect(0,0,700,25);
	
	//drawTabs
	var i;
	
	
	var linGrd = tabsCtx.createLinearGradient(0,3,0,22);
		linGrd.addColorStop(0, "#F2F2F2"); // start with red at 0
		linGrd.addColorStop(1,"#CFCFCF"); // finish with green
	
		var linGrdBlue = tabsCtx.createLinearGradient(0,3,0,22);
		linGrdBlue.addColorStop(0, "#EAF6ED"); // start with red at 0
		linGrdBlue.addColorStop(1,"#ACDCF7"); // finish with green
	
	for (i = 0; i < myModuleArrays.length;i++)
	{
		var isSelected = false;
		var z;
		if (i == tabSelected.index) {
			var isSelected = true;
			tabsCtx.fillStyle = "white";
			z = 0;
		}
		else {
			var isSelected = false;
			if (hoverPlus.hoveringIndex) {
				if (hoverPlus.hoverIndex == i)
					tabsCtx.fillStyle = linGrdBlue;
				else
					tabsCtx.fillStyle = linGrd;
			}
			else 
				tabsCtx.fillStyle = linGrd;
			
			z = 3;
		}
		
		
		tabsCtx.strokeStyle = "black"	
		tabsCtx.lineWidth = "1";
		tabsCtx.fillRect(100*i,z,100,25-z);
		tabsCtx.strokeRect(100*i,z,100,25-z);
		tabsCtx.lineWidth = "2";
		tabsCtx.fillStyle = "black";
		tabsCtx.fillText("Tab",50+100*i,17)
		tabsCtx.fillText(i+1,70+100*i,17)
		tabsCtx.lineWidth = "1";
		
		if (hoverPlus.hoverIndex == i && hoverPlus.hoverClose == true)
			tabsCtx.strokeStyle = "red";
		else
			tabsCtx.strokeStyle = "black";
		
		tabsCtx.strokeRect(20+100*i,9,10,10);
		tabsCtx.lineWidth = "2";
		tabsCtx.beginPath();
		tabsCtx.moveTo(22+100*i,11);
		tabsCtx.lineTo(28+100*i,17);
		tabsCtx.stroke();
		
		tabsCtx.beginPath();
		tabsCtx.moveTo(22+100*i,17);
		tabsCtx.lineTo(28+100*i,11);
		tabsCtx.stroke();
		
		
	}
	if (hoverPlus.selected == true) {
		tabsCtx.strokeStyle = "blue";
		tabsCtx.fillStyle = "blue";
	}
	else {
		tabsCtx.strokeStyle = "black";
		tabsCtx.fillStyle = "black";
	}
	tabsCtx.lineWidth = "2";
	tabsCtx.save();
	if (hoverPlus.selected == true)
		tabsCtx.fillStyle = linGrdBlue;
	else 
		tabsCtx.fillStyle = linGrd;
		
	tabsCtx.fillRect(100*i,3,25,22);
	tabsCtx.strokeRect(100*i,3,25,22);
	tabsCtx.restore();
	tabsCtx.fillRect(7.5 +100*i,12.5,10,3);
	tabsCtx.fillRect(11 +100*i,9,3,10);
	
	
	//============================================================
	//BUTTON DRAW CODE
	buttonsCtx.clearRect(0,0,700,100);
	
	//PLAY-PAUSE
	
	//Size of outer play triangle
    var height = 40;
    var width = 80;
	
	//Size of inner play triangle
	var innerPh = height/2;
	var innerPw = height/2;
	
	//Size of pause ticks
	var pauseH = innerPh;
	var pauseW = innerPw/4;
	
	//Create outer play triangle gradient
	var playOLG = buttonsCtx.createLinearGradient(360,0,420,50);
    playOLG.addColorStop(0, "#F8F8F8");
	playOLG.addColorStop(0.65, "#B1B0B0"); 
    playOLG.addColorStop(1,"#C6C5C5");
	
	buttonsCtx.shadowColor = "A6A5A5";
	buttonsCtx.shadowOffsetY = 1;
	buttonsCtx.shadowOffsetX = -0.5;
	
	//Create inner play traingle gradient
    var playILG = buttonsCtx.createLinearGradient(-innerPw/2.2+380,-innerPh/2.2+20,innerPw/2.2+380,innerPh/2.2+20);
    if (buttonDataOne.hovered == false) {
		playILG.addColorStop(0, "#505E45");
		playILG.addColorStop(1, "#90BC79");
	}
	else
	{
		playILG.addColorStop(0, "#1D3615");
		playILG.addColorStop(1, "#558F37");
	}
	
	
    //outer Arc radius
    var r = height/6.5;
	//inner arc radius
	var innerRad = innerPh/6.5;
	//pause arc radius
	var pauseRad = pauseH/6.5;
    
	//Offset of outer play button
    var playOffset = 360 + width/2;
	//Offset of inner play button
	var innerPO = 370 + innerPw/2;
	var innerOY = (height-innerPh)/2;
	//Offset of pause ticks
	var pauseOff = 370 + pauseW/2;
	var pauseOY = (height-pauseH);
	var pause2Off = pauseOff + 1.5*pauseW;
	
	//Draw outer play button
    buttonsCtx.beginPath();
    buttonsCtx.moveTo(playOffset-width/2,r);
    buttonsCtx.arcTo(playOffset-width/2,0,playOffset+width/2-r,0,r);
    buttonsCtx.arcTo(playOffset+width/2,height/2,playOffset-width/2+r,height,r);
    buttonsCtx.arcTo(playOffset-width/2,height,playOffset-width/2,r,r);
    buttonsCtx.fillStyle = playOLG;
    buttonsCtx.fill();
	
	//Draw inner shapes depending on run status
	//TODO: How do you check if the animation is playing?
	
	if (buttonDataOne.value == "Start"){
		//Draw inner play button
		buttonsCtx.beginPath();
		buttonsCtx.moveTo(innerPO-innerPw/2,innerRad+innerOY);
		buttonsCtx.arcTo(innerPO-innerPw/2,innerOY,innerPO+innerPw/2-innerRad,innerOY,innerRad);
		buttonsCtx.arcTo(innerPO+innerPw/2,innerPh/2+innerOY,innerPO-innerPw/2+innerRad,innerPh+innerOY,innerRad);
		buttonsCtx.arcTo(innerPO-innerPw/2,innerPh+innerOY,innerPO-innerPw/2,innerRad+innerOY,innerRad);
		buttonsCtx.fillStyle = playILG;
		buttonsCtx.fill();
	}
	else {
		//draw pause tick 1
		buttonsCtx.beginPath();                        
		buttonsCtx.moveTo(pauseOff-pauseW/2,pauseOY-pauseH/2+pauseRad);
		buttonsCtx.arcTo(pauseOff-pauseW/2,pauseOY-pauseH/2,pauseOff+pauseW/2-pauseRad,pauseOY-pauseH/2,pauseRad);
		buttonsCtx.arcTo(pauseOff+pauseW/2,pauseOY-pauseH/2,pauseOff+pauseW/2,pauseOY+pauseH/2-pauseRad,pauseRad); 
		buttonsCtx.arcTo(pauseOff+pauseW/2,pauseOY+pauseH/2,pauseOff-pauseW/2+pauseRad,pauseOY+pauseH/2,pauseRad);
		buttonsCtx.arcTo(pauseOff-pauseW/2,pauseOY+pauseH/2,pauseOff-pauseW/2,pauseOY-pauseH/2+pauseRad,pauseRad);
		buttonsCtx.fillStyle = playILG;
		buttonsCtx.fill();	
	
		//draw pause tick 2
		buttonsCtx.beginPath();                        
		buttonsCtx.moveTo(pause2Off-pauseW/2,pauseOY-pauseH/2+pauseRad);
		buttonsCtx.arcTo(pause2Off-pauseW/2,pauseOY-pauseH/2,pause2Off+pauseW/2-pauseRad,pauseOY-pauseH/2,pauseRad);
		buttonsCtx.arcTo(pause2Off+pauseW/2,pauseOY-pauseH/2,pause2Off+pauseW/2,pauseOY+pauseH/2-pauseRad,pauseRad); 
		buttonsCtx.arcTo(pause2Off+pauseW/2,pauseOY+pauseH/2,pause2Off-pauseW/2+pauseRad,pauseOY+pauseH/2,pauseRad);
		buttonsCtx.arcTo(pause2Off-pauseW/2,pauseOY+pauseH/2,pause2Off-pauseW/2,pauseOY-pauseH/2+pauseRad,pauseRad);
		buttonsCtx.fillStyle = playILG;
		buttonsCtx.fill();
	}

	//STOP/RESET button
   buttonsCtx.shadowOffsetX = 1;
	//Size of outer stop triangle
    var sh = 40;
    var sw = 80;
	//Size of inner stop rect
	var innerSh = sh/2;
	var innerSw = sh/2;
	
	//Create outer stop triangle gradient
	var stopOLG = buttonsCtx.createLinearGradient(280,0,340,50);
    stopOLG.addColorStop(0, "#F8F8F8");
	stopOLG.addColorStop(0.75, "#B1B0B0")
    stopOLG.addColorStop(1,"#C6C5C5");
	
	//Create inner stop rect gradient
    var stopILG = buttonsCtx.createLinearGradient(-innerSw/2.2+320,-innerSh/2.2+20,innerSw/2.2+320,innerSh/2.2+20);
    if (buttonDataTwo.hovered == false) {
		stopILG.addColorStop(0, "#5F3938");
		//stopILG.addColorStop(0.50, "#98A1D0");
		stopILG.addColorStop(1, "#D4746E");
	}
	else
	{
		stopILG.addColorStop(0, "#321213");
		//stopILG.addColorStop(0.50, "#98A1D0");
		stopILG.addColorStop(1, "#9E302F");
	}
    //outer Arc radius
    var sr = sh/6.5;
	//inner arc radius
	var innerSRad = innerSh/6.5;
    
	//Offset of outer stop button
    var playSOffset = 340 - sw/2;
	//Offset of inner stop button
	var innerSO = 330 - innerSw/2; //x offset
	var innerSOY = (sh-innerSh);   //y offset
	
	//Draw outer stop button
		buttonsCtx.beginPath();
		buttonsCtx.moveTo(playSOffset + width / 2, r);
		buttonsCtx.arcTo(playSOffset + width / 2, 0, playSOffset - width / 2 - r, 0, r);
		buttonsCtx.arcTo(playSOffset - width / 2, height / 2, playSOffset + width / 2 + r, height, r);
		buttonsCtx.arcTo(playSOffset + width / 2, height, playSOffset + width / 2, r, r);
		buttonsCtx.fillStyle = stopOLG;
		buttonsCtx.fill();
	
	//Draw inner stop button
	if (buttonDataTwo.value == "Stop") {
		buttonsCtx.beginPath();
		buttonsCtx.moveTo(innerSO - innerSw / 2, innerSOY - innerSh / 2 + innerSRad);
		buttonsCtx.arcTo(innerSO - innerSw / 2, innerSOY - innerSh / 2, innerSO + innerSw / 2 - innerSRad, innerSOY - innerSh / 2, innerSRad);
		buttonsCtx.arcTo(innerSO + innerSw / 2, innerSOY - innerSh / 2, innerSO + innerSw / 2, innerSOY + innerSh / 2 - innerSRad, innerSRad);
		buttonsCtx.arcTo(innerSO + innerSw / 2, innerSOY + innerSh / 2, innerSO - innerSw / 2 + innerSRad, innerSOY + innerSh / 2, innerSRad);
		buttonsCtx.arcTo(innerSO - innerSw / 2, innerSOY + innerSh / 2, innerSO - innerSw / 2, innerSOY - innerSh / 2 + innerSRad, innerSRad);
		buttonsCtx.fillStyle = stopILG;
		buttonsCtx.fill();
	}
	//Draw reset
	else {
		buttonsCtx.beginPath();
		buttonsCtx.arc(innerSO, innerSOY, innerSh / 2, 0, 7 * Math.PI / 4, false); //outer arc 
		buttonsCtx.lineTo(innerSO + innerSh / 2, innerSOY - innerSh / 2); //line to point 1
		buttonsCtx.lineTo(innerSO + innerSh / 2 - 2, innerSOY - innerSh / 4 + 2); //line to point 2
		buttonsCtx.lineTo(innerSO + 2, innerSOY - 2); //line to point 3
		buttonsCtx.arc(innerSO, innerSOY, 7.07, 7 * Math.PI / 4, 0, true);
		buttonsCtx.lineTo(innerSO, innerSOY);
		buttonsCtx.fillStyle = "black";
		buttonsCtx.fill();
	}
}

function drawNormal(drawModule){
	
	var isSelected = new Boolean();
	if (drawModule.selected == true){
		ctx.strokeStyle = "#99CC32";
		ctx.fillStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "#7585C1"
		ctx.fillStyle = "#7585C1"
		isSelected = false;
	}
	
	ctx.save();
    ctx.translate(drawModule.x, drawModule.y);	
    var r = 45;
	var linGrd = ctx.createLinearGradient(-0.71*r,-0.71*r,0.71*r,0.71*r);
	linGrd.addColorStop(0, "#8491C8"); // start with red at 0
	linGrd.addColorStop(0.5, "#98A1D0"); // put blue at the halfway point
	linGrd.addColorStop(1,"#AEB3DA"); // finish with green
	
	if (isSelected) {
		var orad = r*1.17;
		ctx.fillStyle = "yellow";
		ctx.beginPath();
		ctx.arc(0,0,orad,0,2*Math.PI);
		ctx.fill();
	}
	
	ctx.fillStyle = linGrd;
	ctx.strokeStyle = "#9DA1CF";
	ctx.lineWidth = r/5;
	
	ctx.beginPath();
	ctx.arc(0,0,r,0,2*Math.PI);
	ctx.stroke(); 
	
	ctx.shadowColor = "#2F388B";
	ctx.shadowOffsetX = 1/25*r;
	ctx.shadowOffsetY = 1/25*r;
	ctx.shadowBlur = 1/30*r;
	ctx.fill();

	ctx.restore();
	ctx.lineWidth = "3";
	if (drawModule.rotate == 0) {
		//draw outputs
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputsConnectedTo.length > 0) {
				ctx.fill();
			}
		}
		//draw inputs
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)

			ctx.stroke();
			if (drawModule.inputs[i].outputsConnectedTo.length > 0) {
				ctx.fill();
			}
		}
	}
	else
	{
		//draw outputs
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputsConnectedTo.length > 0) {
				ctx.fill();
			}
		}
		//draw inputs
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			if (drawModule.inputs[i].outputsConnectedTo > 0) {
				ctx.fill();
			}
		}
	}
}		
                                                                
                                             
function drawConditional (drawModule)
{
		var isSelected = new Boolean();
	if (drawModule.selected == true){
		ctx.strokeStyle = "#99CC32";
		ctx.fillStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "#7585C1"
		ctx.fillStyle = "#7585C1"
		isSelected = false;
	}
			
		ctx.save();	
		
		//outer rect size
		var height = 80; 
		var width = 100;
		
        ctx.translate(drawModule.x, drawModule.y);
		var innerLinGrd = ctx.createLinearGradient(-width/2.2,-height/2.2,width/2.2,height/2.2); //gradiance of inner square
		innerLinGrd.addColorStop(0, "#8491C8"); 
		innerLinGrd.addColorStop(0.50, "#98A1D0"); 
		innerLinGrd.addColorStop(1,"#AEB3DA"); 

		var outterLinGrd = ctx.createLinearGradient(-width/2,-height/2,width/2,height/2); //gradiance of outer square
		outterLinGrd.addColorStop(0, "#AEB3DA"); 
		outterLinGrd.addColorStop(1,"#2F388B"); 
		
		if(isSelected){
			var oh = height*1.06;
			var ow = width*1.06;
			var rad = oh/6.5;
			
			ctx.beginPath();                        
			ctx.moveTo(-ow/2,-oh/2+rad);
			ctx.arcTo(-ow/2,-oh/2,ow/2-rad,-oh/2,rad);
			ctx.arcTo(ow/2,-oh/2,ow/2,oh/2-rad,rad); 
			ctx.arcTo(ow/2,oh/2,-ow/2+rad,oh/2,rad);
			ctx.arcTo(-ow/2,oh/2,-ow/2,-oh/2+rad,rad);
			ctx.fillStyle = "yellow";
			ctx.fill();
		}

		//arc radius
		var r = height/6.5;
		
		//draw outer square
		ctx.beginPath();
		ctx.moveTo(-width/2,-height/2+r);
		ctx.arcTo(-width/2,-height/2,width/2-r,-height/2,r);
		ctx.arcTo(width/2,-height/2,width/2,height/2-r,r); 
		ctx.arcTo(width/2,height/2,-width/2+r,height/2,r);
		ctx.arcTo(-width/2,height/2,-width/2,-height/2+r,r);
		ctx.fillStyle = outterLinGrd;
		ctx.fill();
		//ctx.fillRect(-width/2,-height/2,width,height);

		//inner rect size
        var ss = 0.92*height;
		var ww = 0.92*width;

        //draw inner rect
		ctx.beginPath();                        
		ctx.moveTo(-ww/2,-ss/2+r);
		ctx.arcTo(-ww/2,-ss/2,ww/2-r,-ss/2,r);
		ctx.arcTo(ww/2,-ss/2,ww/2,ss/2-r,r); 
		ctx.arcTo(ww/2,ss/2,-ww/2+r,ss/2,r);
		ctx.arcTo(-ww/2,ss/2,-ww/2,-ss/2+r,r);
		ctx.fillStyle = innerLinGrd;
		ctx.fill();				

		ctx.restore();	
		ctx.lineWidth = "3";
		if (drawModule.rotate == 0) {
			//draw outputs
			for (var i = 0; i < drawModule.inputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsTrue[i].offsetX - 5, drawModule.y + drawModule.outputsTrue[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsTrue[i].offsetX + 5, drawModule.y + drawModule.outputsTrue[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsTrue[i].offsetX, drawModule.y + drawModule.outputsTrue[i].offsetY + 5)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsTrue[i].inputsConnectedTo.length > 0) {
					ctx.fill();
				}
				
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsFalse[i].offsetX - 5, drawModule.y + drawModule.outputsFalse[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX + 5, drawModule.y + drawModule.outputsFalse[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX, drawModule.y + drawModule.outputsFalse[i].offsetY + 5)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsFalse[i].inputsConnectedTo.length > 0) {
					ctx.fill();
				}
			}
			//draw inputs
			for (var i = 0; i < drawModule.inputs.length; i++) {	
				ctx.beginPath();
				ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
				ctx.stroke();
				if (drawModule.inputs[i].outputsConnectedTo.length > 0) {
					ctx.fill();
				}
			}
		}
		else
		{
			//draw outputs
			for (var i = 0; i < drawModule.inputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsTrue[i].offsetX - 5, drawModule.y + drawModule.outputsTrue[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsTrue[i].offsetX - 5, drawModule.y + drawModule.outputsTrue[i].offsetY + 5)
				ctx.lineTo(drawModule.x + drawModule.outputsTrue[i].offsetX + 5, drawModule.y + drawModule.outputsTrue[i].offsetY)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsTrue[i].inputsConnectedTo.length > 0) {
					ctx.fill();
				}
				
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsFalse[i].offsetX - 5, drawModule.y + drawModule.outputsFalse[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX - 5, drawModule.y + drawModule.outputsFalse[i].offsetY + 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX + 5, drawModule.y + drawModule.outputsFalse[i].offsetY)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsTrue[i].inputsConnectedTo.length  > 0) {
					ctx.fill();
				}
			}
			//draw inputs
			for (var i = 0; i < drawModule.inputs.length; i++) {	
				ctx.beginPath();
				ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
				ctx.stroke();
				if (drawModule.inputs[i].outputsConnectedTo.length  > 0) {
					ctx.fill();
				}
			}
		}
}

function drawSource (drawModule)
{
	var isSelected = new Boolean();
	if (drawModule.selected == true){
		ctx.strokeStyle = "#99CC32";
		ctx.fillStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "#7585C1"
		ctx.fillStyle = "#7585C1"
		isSelected = false;
	}
	
	ctx.save();	
		var s = 25;
	    ctx.translate(drawModule.x, drawModule.y);
	    var ss = 0.68*s; 
		
		if (isSelected){
			var orad = s*1.12;
			ctx.fillStyle = "yellow";
			ctx.beginPath();
			ctx.arc(0,0,orad,0,2*Math.PI);
			ctx.fill();
		}
		
		var innerLinGrd = ctx.createLinearGradient(-ss/2,-ss/2,ss/2,ss/2); //gradiance of inner square
		innerLinGrd.addColorStop(0, "#52525A"); 
		innerLinGrd.addColorStop(0.25, "#676770"); 
		innerLinGrd.addColorStop(0.5, "#7D7D85"); 
		innerLinGrd.addColorStop(0.75, "#95959C"); 
		innerLinGrd.addColorStop(1,"#A9A9AF"); 
		
		var outterLinGrd = ctx.createLinearGradient(-s/2,-s/2,s/2,s/2); //gradiance of inner square
		outterLinGrd.addColorStop(0, "#DBDBE0"); 
		outterLinGrd.addColorStop(1,"#7F7F88"); 
		                        						
		ctx.beginPath();
		ctx.arc(0,0,s,0,2*Math.PI);  
	    ctx.fillStyle = outterLinGrd;
	    ctx.fill(); 
	               
		ctx.beginPath();                        
	    ctx.arc(0,0,ss,0,2*Math.PI);  
		ctx.fillStyle = innerLinGrd;
		ctx.fill();
		
		
			
		ctx.restore();
		if (drawModule.rotate == 0) {
		//draw outputs
			ctx.lineWidth = "3";
			for (var i = 0; i < drawModule.outputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX, drawModule.y + drawModule.outputs[i].offsetY + 5)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputs[i].inputsConnectedTo.length > 0) {
					ctx.fill();
				}
			}
		}
		else
		{
		//draw outputs
			ctx.lineWidth = "3";
			for (var i = 0; i < drawModule.outputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY + 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputs[i].inputsConnectedTo.length > 0) {
					ctx.fill();
				}
			}	
		}
}

function drawSink (drawModule)
{
	var isSelected = new Boolean();
	if (drawModule.selected == true){
		ctx.strokeStyle = "#99CC32";
		ctx.fillStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "#7585C1"
		ctx.fillStyle = "#7585C1"
		isSelected = false;
	}
	
	ctx.lineWidth = "3";
	
	if (drawModule.rotate == 0) {
		ctx.beginPath();
		ctx.save();
		var s = 50;
            ctx.translate(drawModule.x, drawModule.y);
            var ss = 0.58*s; 
			var innerLinGrd = ctx.createLinearGradient(-ss/2,-ss/2,ss/2,ss/2); //gradiance of inner square
			innerLinGrd.addColorStop(0, "#52525A"); 
			innerLinGrd.addColorStop(0.25, "#676770"); 
			innerLinGrd.addColorStop(0.5, "#7D7D85"); 
			innerLinGrd.addColorStop(0.75, "#95959C"); 
			innerLinGrd.addColorStop(1,"#A9A9AF"); 
			
			var outterLinGrd = ctx.createLinearGradient(-s/2,-s/2,s/2,s/2); //gradiance of inner square
			outterLinGrd.addColorStop(0, "#DBDBE0"); 
			outterLinGrd.addColorStop(1,"#7F7F88"); 
			
			function drawEtriangle(x,y,l)
			{		
			ctx.beginPath();
			ctx.moveTo(0,0.55735*l);
			ctx.lineTo(-0.5*l,-0.55735*l/2);
			ctx.lineTo(0.5*l,-0.55735*l/2);
			ctx.lineTo(0,0.55735*l);
								             
			}
            
			if (isSelected) {
				var os = s*1.2;
				drawEtriangle(0,0,os);
				ctx.fillStyle = "yellow";
				ctx.fill();
			}
			
            drawEtriangle(0,0,s);
			ctx.fillStyle = outterLinGrd;
			ctx.fill();
				         
			drawEtriangle(0,0,ss);  						
			ctx.fillStyle = innerLinGrd;
			ctx.fill();
        
		ctx.restore();
		//draw inputs
		ctx.lineWidth = "3";
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			if (drawModule.inputs[i].outputsConnectedTo.length > 0) {
				ctx.fill();
			}
		}
	}
	
	else
	{
		ctx.save();
		var s = 50;
            ctx.translate(drawModule.x, drawModule.y);
            var ss = 0.58*s; 
			var innerLinGrd = ctx.createLinearGradient(-ss/2,-ss/2,ss/2,ss/2); //gradiance of inner square
			innerLinGrd.addColorStop(0, "#52525A"); 
			innerLinGrd.addColorStop(0.25, "#676770"); 
			innerLinGrd.addColorStop(0.5, "#7D7D85"); 
			innerLinGrd.addColorStop(0.75, "#95959C"); 
			innerLinGrd.addColorStop(1,"#A9A9AF"); 
			
			var outterLinGrd = ctx.createLinearGradient(-s/2,-s/2,s/2,s/2); //gradiance of inner square
			outterLinGrd.addColorStop(0, "#DBDBE0"); 
			outterLinGrd.addColorStop(1,"#7F7F88"); 
			
			function drawRotatedEtriangle(x,y,l)
			{		
			ctx.beginPath();
			ctx.moveTo(0.55735*l,0);
			ctx.lineTo(-0.55735*l/2,-0.5*l);
			ctx.lineTo(-0.55735*l/2,0.5*l);
			ctx.lineTo(0.55735*l,0);
								             
			}
            
			if (isSelected) {
				var os = s*1.2;
				drawRotatedEtriangle(0,0,os);
				ctx.fillStyle = "yellow";
				ctx.fill();
			}
			
            drawRotatedEtriangle(0,0,s);
			ctx.fillStyle = outterLinGrd;
			ctx.fill();
				         
			drawRotatedEtriangle(0,0,ss);  						
			ctx.fillStyle = innerLinGrd;
			ctx.fill();
        	
		
		ctx.restore();	
		//draw inputs
		ctx.lineWidth = "3";
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			if (drawModule.inputs[i].outputsConnectedTo.length > 0) {
				ctx.fill();
			}
		}
	}
}

function drawStudy (drawModule)
{
	var isSelected = new Boolean();
	if (drawModule.selected == true){
		ctx.strokeStyle = "#99CC32";
		ctx.fillStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "#7585C1"
		ctx.fillStyle = "#7585C1"
		isSelected = false;
	}
	
	 ctx.save();	
	 var s = 50;
        ctx.translate(drawModule.x, drawModule.y);
		
		if (isSelected) {
			var os = s*1.1;
			ctx.fillStyle = "yellow";
			ctx.fillRect(-os/2,-os/2,os,os);
		}
		
		var innerLinGrd = ctx.createLinearGradient(-s/2.2,-s/2.2,s/2.2,s/2.2); //gradiance of inner square
		innerLinGrd.addColorStop(0, "#3D3D47"); 
		innerLinGrd.addColorStop(0.50, "#7D7D84"); 
		innerLinGrd.addColorStop(1,"#BDBDC3"); 
		
		var outterLinGrd = ctx.createLinearGradient(-s/2,-s/2,s/2,s/2); //gradiance of inner square
		outterLinGrd.addColorStop(0, "#DBDBE0"); 
		outterLinGrd.addColorStop(1,"#7F7F88"); 
		
		ctx.fillStyle = outterLinGrd;
		ctx.fillRect(-s/2,-s/2,s,s);
		
		var r = s/6.5; 
		//arc radius    
        var ss = 0.75*s; 
        //side length of inner square
        
		ctx.beginPath();                        
		ctx.moveTo(-ss/2,-ss/2+r);
		ctx.arcTo(-ss/2,-ss/2,ss/2-r,-ss/2,r);
		ctx.arcTo(ss/2,-ss/2,ss/2,ss/2-r,r); 
		ctx.arcTo(ss/2,ss/2,-ss/2+r,ss/2,r);
		ctx.arcTo(-ss/2,ss/2,-ss/2,-ss/2+r,r);
		ctx.fillStyle = innerLinGrd;
		ctx.fill();
		
	
	ctx.restore();					
	if (drawModule.rotate == 0) {
	//draw outputs
		ctx.lineWidth = "3";
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputsConnectedTo.length > 0) {
				ctx.fill();
			}
		}
	}
	else
	{
	//draw outputs
		ctx.lineWidth = "3";
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputsConnectedTo > 0) {
				ctx.fill();
			}
		}	
	}	
}


function animate(module){
	Preparing = function(){
		if (module.lock == false) {
			setTimeout(function(){
				module.lock = false;
				module.status = Status.Preparing;
				module.message = "Prepare to validate";
			}, 2000);
			module.lock = true;
		}
		
	}
	Validate = function(){
		//placeholder for validation
		if (module.lock == false) {
						
			module.lock = false;
			if(module.sequence==-1)
			{module.valid=false;
			 isValid = false;
			 }			
			if (module.valid == true) 
				 validationPassed();
			else 
				 validationFailed();	
				}		
			module.lock = true;			
		
	}
	validationPassed = function(){
		if (module.lock == false) {
			setTimeout(function(){            
				module.lock = false;
				module.status = Status.validationPassed;
				module.message = "Validation Passed";
			}, 2000);
			module.lock = true;
			
		}
	}
	validationFailed = function(){
		if (module.lock == false) {
			setTimeout(function(){
				
				module.lock = false;
				module.status = Status.validationFailed;
				module.message = "Validation Failed";
			}, 2000);
			module.lock = true;
			
		}
	}
	Waiting = function(){
		if(isValid==true){
		if (module.lock == false) {
			
			setTimeout(function(){
				module.lock = false;
				module.status = Status.Waiting;
				module.message = "Waiting";
			}, 2000);
			module.lock = true;
		}
	}
	}
	
	waitingToSubmit = function(){
		if (module.lock == false) {
			setTimeout(function(){
				module.lock = false;
				module.status = Status.waitingToSubmit;
				module.message = "Waiting to submit";
			}, 2000);
			module.lock = true;
		}
	}
	
	Submitting = function(){
		if (module.lock == false) {
			setTimeout(function(){
				module.lock = false;
				module.status = Status.Submitting;
				module.message = "Submitting";
			}, 2000);
			module.lock = true;
		}
	}
	Queued = function(){
		if (module.lock == false) {
			setTimeout(function(){
				module.lock = false;
				module.status = Status.Queued;
				module.message = "Queued";
			}, 2000);
			module.lock = true;
			
		}
	}
	Running = function(){
		if (module.lock == false) {
			setTimeout(function(){
				module.lock = false;
				module.status = Status.Running;
				module.message = "Running";
			}, 2000);
			module.lock = true;
			
		}
	}
	Complete = function(){
		
		if (module.lock == false) {
			setTimeout(function(){
				if(module.isComplete==false)
			{
				console.log(module.type);
				
				module.lock = false;
				
				//watch for parallel
					if (isIncremented == false) {
						processingLevel++;
						isIncremented = true;
					}
				}
				
			    module.status = Status.Complete;
				module.message = "Complete";
				module.lock = true;
				module.isComplete = true;
				},2000);
			}
		}
		
	
	
	Paused = function(){
		if(module.status!=Complete)
		{
		module.status = Status.Paused;
		module.message = "Paused";
		}
		
	}
	Stop = function(){
		module.status = Status.Stop;
		module.message = "Stop";
	}
	Play = function(){
		module.status = Status.Play;
		module.message = "";
	}
	
	Stationary = function(){
	
		module.status = Status.Stationary;
		module.message = "";		
		totalTime = 0;
		isValid = true;
		isIncremented = false;		
		

		
		processingLevel = 1;
	    module.jobNum = 2;
	    module.sequence = -1;
	    module.isComplete = false;
	    module.lock = false;
	    module.valid = true;
	    
	    if(buttonEvent == Status.Play)	
	    { buttonEvent = Status.Play}
	    else if (buttonEvent == Status.m_Reset)
	    {buttonEvent =Status.m_Reset}
	    	
	}
	
	switch (buttonEvent) {
		case Status.Play:	 
			switch (module.status) {			
				case Status.Stationary:
					Preparing();
					break;
				case Status.Preparing:
					Validate();
					break;
				case Status.validationPassed:
				if(isValid != false)				   
					Waiting();
					break;
				case Status.validationFailed:
					validationFailed();
					break;
				case Status.Paused:
				    
				    if(module.valid==false)
				    {
				    module.lock = false;
				    validationFailed();
				    }
				    else if(module.isComplete==true)
				    {
				    module.status = Status.Complete;
					module.message = "Complete";
				    }
				    else if(isValid==true)
				    {
				    module.lock = false;
				    Waiting();
				    }
				    break;
				case Status.Stop:
					Stationary();
					break;
				case Status.Waiting:
					if (module.sequence == processingLevel) {
						waitingToSubmit();
					}
					break;
				case Status.waitingToSubmit:
					//if(module.sequence==processingLevel)
					Submitting();
					break;
				case Status.Submitting:
					Queued();
					break;
				case Status.Queued:
					Running();
					break;
				case Status.Running:
					Complete();
					break;
				case Status.Complete:	
				    module.isComplete = true;		
					break;
				
				default:
					break;		
			}			
			break;
		case Status.Paused:
			Paused();
			break;
		case Status.Stop:
			Stop();
			break;
		case Status.m_Reset:
			Stationary();
			break;
			
		default:
			break;
	}
	
	ctx.save();
	ctx.strokeStyle = "#D9D9D9";
	ctx.lineWidth = 5;
	var n = module.radius / 7;
	var r = 1.2 * module.radius;
	var rotateR = (Math.PI / 180) * 360 / n;
	var archRadian = (Math.PI / 180) * (360 / n - 15);
	var interval = (Math.PI / 180) * 15;
	
	//var timer =0;
	
	ctx.translate(module.x, module.y);
	
	var time = new Date();
	var sec = time.getSeconds();
	if (buttonEvent != Status.m_Reset) {
		for (var rad = 0; rad < 2 * Math.PI; rad += rotateR) {
			var counter = rad / rotateR;
			ctx.rotate(rotateR);
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, archRadian);
			if(module.type != "source")
			{
			if (module.status == Status.Running) {
				if (sec % n == counter) {
					ctx.strokeStyle = "#3B71E4";
				}
			}
			else if (module.status == Status.Queued)
		    {
		    	ctx.strokeStyle = "#3B71E4";
		    }
		    else if (module.status == Status.Complete)
		    {
		    	ctx.strokeStyle = "#82B782";
		    }
		    else if (module.status == Status.validationFailed)
		    {
		    	ctx.strokeStyle = "#EC5353";
		    }
			ctx.stroke();
			ctx.strokeStyle = "#D9D9D9";
		}
		}
		
		
	}
	ctx.restore();
	
	
	if(module.type != "source"&& module.type!="study"&& module.status!=Status.validationFailed)
	ctx.fillText(module.message, module.x + r, module.y + r);
	else if (module.status==Status.validationFailed)
	{   
		ctx.fillStyle = "#EC5353";
		ctx.fillText(module.message, module.x + r, module.y + r);
	}
	
}

function clickConnection(x1,y1,x2,y2, fromRotate, toRotate,mouseX,mouseY) {
    var delta_x = x2 - x1;
    var delta_y = y2 - y1;
    if(fromRotate==0 && toRotate==0) {
	    if(y2>=y1) {
	        if (abs(delta_x) < abs(delta_y) / 2) { // 3 segments
	            var temp = (abs(delta_y) - abs(delta_x)) / 2;
				return (checkLine(x1,y1,x1,y1+signum(delta_y) * temp,mouseX,mouseY) ||
			    checkLine(x1,y1+signum(delta_y) * temp, x2, y2-signum(delta_y) * temp,mouseX,mouseY) ||
			    checkLine(x2, y2-signum(delta_y) * temp, x2, y2,mouseX,mouseY))
	        } else { // 5 segments
	            var y_step = delta_y / 4;
	            var x_step = signum(delta_x) * abs(y_step);
	            var mid_y = (y1 + y2) / 2;
				
			    return (checkLine(x1,y1,x1,y1 + y_step,mouseX,mouseY) ||
			    checkLine(x1,y1 + y_step, x1+x_step, mid_y,mouseX,mouseY) ||
			    checkLine(x1+x_step, mid_y, x2-x_step, mid_y,mouseX,mouseY) ||
			    checkLine(x2-x_step, mid_y, x2, y2-y_step,mouseX,mouseY) ||
			    checkLine(x2, y2-y_step, x2, y2,mouseX,mouseY))
	        }
	     } else {
	     	var midx = (x1+x2)/2;
	     	var midy = (y1+y2)/2;
	     	return (checkULine(x1, y1, midx, midy, 0,mouseX,mouseY) ||  // u shape
	     	checkULine(midx, midy, x2, y2, 1,mouseX,mouseY)) // n shape
	     }
     } else if(fromRotate==1 && toRotate==1) {
     	if(x2>=x1) {
 			if (abs(delta_y) < abs(delta_x) / 2) { // 3 segments
                var temp = (abs(delta_x) - abs(delta_y)) / 2;
			    return (checkLine(x1,y1,x1+signum(delta_x) * temp,y1,mouseX,mouseY) ||
			    checkLine(x1+signum(delta_x) * temp,y1, x2-signum(delta_x) * temp, y2,mouseX,mouseY) ||
			    checkLine(x2-signum(delta_x) * temp, y2, x2, y2,mouseX,mouseY))
            } else { // 5 segments |
                var x_step = delta_x / 4;
                var y_step = signum(delta_y) * abs(x_step);
                var mid_x = (x1+ x2) / 2;
			    return (checkLine(x1,y1,x1+x_step,y1,mouseX,mouseY) ||
			    checkLine(x1+x_step,y1,mid_x,y1+y_step,mouseX,mouseY) ||
			    checkLine(mid_x,y1+y_step,mid_x, y2-y_step,mouseX,mouseY) ||
			    checkLine(mid_x, y2-y_step, x2-x_step, y2,mouseX,mouseY) ||
			    checkLine(x2-x_step, y2, x2, y2,mouseX,mouseY))
            }
         } else {
	     	var midx = (x1+x2)/2;
	     	var midy = (y1+y2)/2;
	     	return (checkULine(x1, y1, midx, midy, 2,mouseX,mouseY) || // ) shape
	     	checkULine(midx, midy, x2, y2, 3,mouseX,mouseY)) // ( shape
         }
     } else {
     	if(fromRotate==0 && toRotate==1) { // Down, 45, Left/Right 
     		if (abs(delta_x) > abs(delta_y)) {
                var y_step = delta_y / 2;
			    return (checkLine(x1,y1,x1,y1+y_step,mouseX,mouseY) ||
			    checkLine(x1,y1+y_step,x1+signum(delta_x)*abs(y_step), y2,mouseX,mouseY) ||
			    checkLine(x1+signum(delta_x)*abs(y_step), y2,x2,y2,mouseX,mouseY))
            } else {
                var x_step = delta_x / 2;
                var temp = abs(delta_y) - abs(x_step);
			    return (checkLine(x1,y1,x1,y1+signum(delta_y) * temp,mouseX,mouseY) ||
			    checkLine(x1,y1+signum(delta_y) * temp,x1+x_step,y2,mouseX,mouseY) ||
			    checkLine(x1+x_step,y2,x2,y2,mouseX,mouseY))
            }
     	} else {
            if (abs(delta_y) > abs(delta_x)) {
                var x_step = delta_x / 2;
			    return (checkLine(x1,y1,x1+x_step,y1,mouseX,mouseY) ||
			    checkLine(x1+x_step,y1,x2,y1+signum(delta_y)*abs(x_step),mouseX,mouseY) ||
			    checkLine(x2,y1+signum(delta_y)*abs(x_step),x2,y2,mouseX,mouseY))
            } else {
                var y_step = delta_y / 2;
                var temp = abs(delta_x) - abs(y_step);
			    return (checkLine(x1,y1,x1+signum(delta_x)*temp,y1,mouseX,mouseY) ||
			    checkLine(x1+signum(delta_x)*temp,y1,x2,y2-y_step,mouseX,mouseY) ||
			    checkLine(x2,y2-y_step,x2,y2,mouseX,mouseY))
            }
     	
     	}
     }
  }
function checkULine(x1, y1, x2, y2, direction,mouseX,mouseY){
	var delta_x = x2 - x1;
	var delta_y = y2 - y1;
	var extension = 0; // How far the line will go out before looping back
	if (direction <= 1) {
		var step_x = delta_x / 3;
		var step_y = abs(step_x);
		if (direction == 0) {
			// open up: u shape
			if (y1 >= y2) { // pointing down
				step_y = step_y * signum(-delta_y);
				if (delta_y > 0) 
					extension += delta_y;
			}
			else {
				step_y = step_y * signum(delta_y);
				if (delta_y < 0) // pointing up
					extension += delta_y;
			}
		}
		else {
			// open down: n shape
			if (y2 >= y1) { // pointing down
				step_y *= signum(-delta_y);
				if (delta_y > 0) 
					extension += delta_y;
			}
			else {
				step_y *= signum(delta_y);
				if (delta_y < 0) // pointing up
					extension += delta_y;
			}
		}
		return (checkLine(x1, y1, x1, y1 + extension + step_y,mouseX,mouseY) ||
		checkLine(x1, y1 + extension + step_y, x1 + step_x, y1 + extension + 2 * step_y,mouseX,mouseY) ||
		checkLine(x1 + step_x, y1 + extension + 2 * step_y, x2 - step_x, y1 + extension + 2 * step_y,mouseX,mouseY) ||
		checkLine(x2 - step_x, y1 + extension + 2 * step_y, x2, y1 + extension + step_y,mouseX,mouseY) ||
		checkLine(x2, y1 + extension + step_y, x2, y2,mouseX,mouseY))
		
	}
	else {
		var step_y = delta_y / 3;
		var step_x = abs(step_y);
		if (direction == 2) {
			// open left: ) shape
			step_x *= signum(-delta_x);
			if (delta_x > 0) 
				extension += delta_x;
		}
		else {
			// open right: ( shape
			step_x *= signum(delta_x);
			if (delta_x < 0) 
				extension += delta_x;
		}
		
		return (checkLine(x1, y1, x1 + extension + step_x, y1,mouseX,mouseY) ||
		checkLine(x1 + extension + step_x, y1, x1 + extension + 2 * step_x, y1 + step_y,mouseX,mouseY) ||
		checkLine(x1 + extension + 2 * step_x, y1 + step_y, x1 + extension + 2 * step_x, y2 - step_y,mouseX,mouseY) ||
		checkLine(x1 + extension + 2 * step_x, y2 - step_y, x1 + extension + step_x, y2,mouseX,mouseY) ||
		checkLine(x1 + extension + step_x, y2, x2, y2,mouseX,mouseY))
	}
}
	

function checkLine(x1,y1,x2,y2,mouseX,mouseY)
{
	//3 pixel buffer
	var buffer = 5;
	//horizontal line -->
	if (y1==y2 && x1 < x2)
	{
		if ((mouseX < x2) && (mouseX > x1) && (mouseY < y1 + buffer ) && (mouseY> y1 - buffer ))
			return true;
		else
			return false;
	}
	//horizontal line <--
	else if (y1 == y2 && x1 > x2)
	{
		if ((mouseX > x2) && (mouseX < x1) && (mouseY < y1 + buffer) && (mouseY > y1 - buffer))
			return true;
		else
			return false;		
	}
	//vertical line down
	else if (x1==x2 && y1 < y2)
	{
		if ((mouseY < y2) && (mouseY > y1) && (mouseX < x1 + buffer) && (mouseX > x1 - buffer))
			return true;
		else
			return false;		
	}
	//vertical line up
	else if (x1==x2 && y1 > y2)
	{
		if ((mouseY > y2) && (mouseY < y1) && (mouseX < x1 + buffer) && (mouseX > x1 - buffer))
			return true;
		else
			return false;				
	}
	//top left bottom right
	else if (x1 < x2 && y1 < y2)
	{
		if (abs((y1-mouseY)-(x1-mouseX)) < buffer && mouseX > x1 && mouseX < x2)
			return true
		else
			return false;
	}
	//bottom right top left
	else if (x1 > x2 && y1 > y2)
	{
		if (abs((y2-mouseY)-(x2-mouseX)) < buffer && mouseX < x1 && mouseX > x2)
			return true
		else 
			return false;		
	}
	//top right bottom left
	else if (x2 < x1 && y2 > y1)
	{
		if (abs((y2-mouseY)-(mouseX -x2)) < buffer && mouseX < x1 && mouseX > x2)
			return true
		else
			return false;		
	}
	//bottom left top right
	else if (x2 > x1 && y2 < y1)
	{
		if (abs((y1-mouseY)-(mouseX -x1)) < buffer && mouseX > x1 && mouseX < x2)
			return true
		else 
			return false;		
	}	
}
	

	function abs(i) {
	if(i>=0)
	 	return i;
	else
		return -1*i;
}

	function signum(i) {
	if(i==0)
		return 0;
	else if(i<0)
		return -1;
	else
		return 1;
}


function drawConnection(x1,y1,x2,y2, fromRotate, toRotate) {
    var delta_x = x2 - x1;
    var delta_y = y2 - y1;
    if(fromRotate==0 && toRotate==0) {
	    if(y2>=y1) {
	        if (abs(delta_x) < abs(delta_y) / 2) { // 3 segments
	            var temp = (abs(delta_y) - abs(delta_x)) / 2;
			    drawLine(x1,y1,x1,y1+signum(delta_y) * temp);
			    drawLine(x1,y1+signum(delta_y) * temp, x2, y2-signum(delta_y) * temp);
			    drawLine(x2, y2-signum(delta_y) * temp, x2, y2);
	        } else { // 5 segments
	            var y_step = delta_y / 4;
	            var x_step = signum(delta_x) * abs(y_step);
	            var mid_y = (y1 + y2) / 2;
			    drawLine(x1,y1,x1,y1 + y_step);
			    drawLine(x1,y1 + y_step, x1+x_step, mid_y);
			    drawLine(x1+x_step, mid_y, x2-x_step, mid_y);
			    drawLine(x2-x_step, mid_y, x2, y2-y_step);
			    drawLine(x2, y2-y_step, x2, y2);
	        }
	     } else {
	     	var midx = (x1+x2)/2;
	     	var midy = (y1+y2)/2;
	     	drawULine(x1, y1, midx, midy, 0); // u shape
	     	drawULine(midx, midy, x2, y2, 1); // n shape
	     }
     } else if(fromRotate==1 && toRotate==1) {
     	if(x2>=x1) {
 			if (abs(delta_y) < abs(delta_x) / 2) { // 3 segments
                var temp = (abs(delta_x) - abs(delta_y)) / 2;
			    drawLine(x1,y1,x1+signum(delta_x) * temp,y1);
			    drawLine(x1+signum(delta_x) * temp,y1, x2-signum(delta_x) * temp, y2);
			    drawLine(x2-signum(delta_x) * temp, y2, x2, y2);
            } else { // 5 segments |
                var x_step = delta_x / 4;
                var y_step = signum(delta_y) * abs(x_step);
                var mid_x = (x1+ x2) / 2;
			    drawLine(x1,y1,x1+x_step,y1);
			    drawLine(x1+x_step,y1,mid_x,y1+y_step);
			    drawLine(mid_x,y1+y_step,mid_x, y2-y_step);
			    drawLine(mid_x, y2-y_step, x2-x_step, y2);
			    drawLine(x2-x_step, y2, x2, y2);
            }
         } else {
	     	var midx = (x1+x2)/2;
	     	var midy = (y1+y2)/2;
	     	drawULine(x1, y1, midx, midy, 2); // ) shape
	     	drawULine(midx, midy, x2, y2, 3); // ( shape
         }
     } else {
     	if(fromRotate==0 && toRotate==1) { // Down, 45, Left/Right 
     		if (abs(delta_x) > abs(delta_y)) {
                var y_step = delta_y / 2;
			    drawLine(x1,y1,x1,y1+y_step);
			    drawLine(x1,y1+y_step,x1+signum(delta_x)*abs(y_step), y2);
			    drawLine(x1+signum(delta_x)*abs(y_step), y2,x2,y2);
            } else {
                var x_step = delta_x / 2;
                var temp = abs(delta_y) - abs(x_step);
			    drawLine(x1,y1,x1,y1+signum(delta_y) * temp);
			    drawLine(x1,y1+signum(delta_y) * temp,x1+x_step,y2);
			    drawLine(x1+x_step,y2,x2,y2);
            }
     	} else {
            if (abs(delta_y) > abs(delta_x)) {
                var x_step = delta_x / 2;
			    drawLine(x1,y1,x1+x_step,y1);
			    drawLine(x1+x_step,y1,x2,y1+signum(delta_y)*abs(x_step));
			    drawLine(x2,y1+signum(delta_y)*abs(x_step),x2,y2);
            } else {
                var y_step = delta_y / 2;
                var temp = abs(delta_x) - abs(y_step);
			    drawLine(x1,y1,x1+signum(delta_x)*temp,y1);
			    drawLine(x1+signum(delta_x)*temp,y1,x2,y2-y_step);
			    drawLine(x2,y2-y_step,x2,y2);
            }
     	
     	}
     }
  }
function drawULine(x1, y1, x2, y2, direction,selected){
	var delta_x = x2 - x1;
	var delta_y = y2 - y1;
	var extension = 0; // How far the line will go out before looping back
	if (direction <= 1) {
		var step_x = delta_x / 3;
		var step_y = abs(step_x);
		if (direction == 0) {
			// open up: u shape
			if (y1 >= y2) { // pointing down
				step_y = step_y * signum(-delta_y);
				if (delta_y > 0) 
					extension += delta_y;
			}
			else {
				step_y = step_y * signum(delta_y);
				if (delta_y < 0) // pointing up
					extension += delta_y;
			}
		}
		else {
			// open down: n shape
			if (y2 >= y1) { // pointing down
				step_y *= signum(-delta_y);
				if (delta_y > 0) 
					extension += delta_y;
			}
			else {
				step_y *= signum(delta_y);
				if (delta_y < 0) // pointing up
					extension += delta_y;
			}
		}
		drawLine(x1, y1, x1, y1 + extension + step_y);
		drawLine(x1, y1 + extension + step_y, x1 + step_x, y1 + extension + 2 * step_y);
		drawLine(x1 + step_x, y1 + extension + 2 * step_y, x2 - step_x, y1 + extension + 2 * step_y);
		drawLine(x2 - step_x, y1 + extension + 2 * step_y, x2, y1 + extension + step_y);
		drawLine(x2, y1 + extension + step_y, x2, y2);
		
	}
	else {
		var step_y = delta_y / 3;
		var step_x = abs(step_y);
		if (direction == 2) {
			// open left: ) shape
			step_x *= signum(-delta_x);
			if (delta_x > 0) 
				extension += delta_x;
		}
		else {
			// open right: ( shape
			step_x *= signum(delta_x);
			if (delta_x < 0) 
				extension += delta_x;
		}
		
		drawLine(x1, y1, x1 + extension + step_x, y1);
		drawLine(x1 + extension + step_x, y1, x1 + extension + 2 * step_x, y1 + step_y);
		drawLine(x1 + extension + 2 * step_x, y1 + step_y, x1 + extension + 2 * step_x, y2 - step_y);
		drawLine(x1 + extension + 2 * step_x, y2 - step_y, x1 + extension + step_x, y2);
		drawLine(x1 + extension + step_x, y2, x2, y2);
	}
}

function drawLine(x1,y1,x2,y2)
{
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	
}
