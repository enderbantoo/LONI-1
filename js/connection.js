// JavaScript Document

//initial variables
var canvas;
var ctx;
var WIDTH = 800;
var HEIGHT = 600;
var myModules=new Array();


//object literals
makingConnection= {
	x : 0,
	y : 0,
	connecting : false,
	output : null
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


testMouse = {
	X : -1,
	Y : -1
}

var copyModules = new Array();
init()
canvas.onmousedown = moduleMouseDown;
canvas.onmouseup = moduleMouseUp;
canvas.onmousemove = captureMousePosition; //'capture mouse saves mouse position

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
	
	//radius
	switch(this.type)
	{
	case "normal":
		this.radius=57;
		break;
	case "conditional":
		this.radius=53;
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
 }
 
function Output(type,parentModule)
{
	this.offsetX;
	this.offsetY;
	this.type;
	this.inputConnectedTo = null;
	this.connectOut = connectOut;
	this.parentModule = parentModule;
}

function Input(type,parentModule)
{
	this.offsetX;
	this.offsetY;
	this.type;
	this.outputConnectedTo = null;
	this.parentModule = parentModule;
}

function connectOut(input)
{
	this.inputConnectedTo = input;
	input.outputConnectedTo = this;
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
	this.outputs=new Array();
	
	for (var p=0;p<sourceModule.outputs.length;p++)
	{
		this.outputs[p]=sourceModule.outputs[p];
	}
		
	this.outputsTrue=new Array();
	
	for (var p=0;p<sourceModule.outputsTrue.length;p++)
	{
		this.outputsTrue[p]=sourceModule.outputsTrue[p];
	}
	
	this.outputsFalse=new Array();
	
	for (var p=0;p<sourceModule.outputsFalse.length;p++)
	{
		this.outputsFalse[p]=sourceModule.outputsFalse[p];
	}
	
	this.selected=false;
	this.groupMoveOffsetX = sourceModule.groupMoveOffsetX;
	this.groupMoveOffsetY = sourceModule.groupMoveOffsetY;
	
	switch(this.type)
	{
	case "normal":
		this.radius=53;
		break;
	case "conditional":
		this.radius=53;
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
<<<<<<< HEAD
	if (this.rotate == 0) {
		if (mouseX < this.x + 5 + offsetLeft &&
		mouseX > this.x - 5 + offsetLeft &&
		mouseY > this.y - 62 + offsetTop &&
		mouseY < this.y - 52 + offsetTop) 
			return true;
	}
	else if (this.rotate == 1){
		if (mouseX > this.x - 62 + offsetLeft &&
		mouseX < this.x - 52 + offsetLeft &&
		mouseY < this.y + 5 + offsetTop &&
		mouseY > this.y - 5 + offsetTop) 
			return true;
	}
	else 
		return false;
		
	case "conditional":	
	if (this.rotate == 0) {
		if (mouseX < this.x + 5 + offsetLeft &&
		mouseX > this.x - 5 + offsetLeft &&
		mouseY > this.y - 58 + offsetTop &&
		mouseY < this.y - 48 + offsetTop) 
			return true;
	}
	else if (this.rotate == 1){
		if (mouseX > this.x - 58 + offsetLeft &&
		mouseX < this.x - 48 + offsetLeft &&
		mouseY < this.y + 5 + offsetTop &&
		mouseY > this.y - 5 + offsetTop) 
			return true;
	}
	else 
		return false;
=======
	case "conditional":
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
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
<<<<<<< HEAD
		if (this.rotate == 0) {
			if (mouseX < this.x + 7 + offsetLeft &&
			mouseX > this.x - 7 + offsetLeft &&
			mouseY < this.y + 63 + offsetTop &&
			mouseY > this.y + 53 + offsetTop) {
=======
	case "source":
	case "study":
		for (var i = 0;i < this.outputs.length;i++) {
			if (mouseX < this.x + this.outputs[i].offsetX + 7 + offsetLeft &&
			mouseX > this.x + this.outputs[i].offsetX  - 7 + offsetLeft &&
			mouseY < this.y + this.outputs[i].offsetY + 7  + offsetTop &&
			mouseY > this.y + this.outputs[i].offsetY - 7 + offsetTop) {
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
				this.connecting = true;
				return this.outputs[i];
			}
<<<<<<< HEAD
			else 
				return -1;
		}
		else
		{
			if (mouseX > this.x + 53 + offsetLeft &&
			mouseX < this.x + 63 + offsetLeft &&
			mouseY > this.y - 7  + offsetTop &&
			mouseY < this.y + 7 + offsetTop) {
				this.connecting = true;
				return 1;
			}
			else 
				return -1;
=======
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
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
 //        Module Manipulations
 //============================================
 function createModule(x,y,type,input,output)
{
 	var index=myModules.length;
	var module1=new module(x,y,type,input,output);
	
	switch (type) {
		case "normal":
		case "source":
		case "sink":
		case "study":
			for (var o = 0; o < output; o++) {
				//placeholder
				module1.addOutput("untyped");
			}
			
			for (var i = 0; i < input; i++) {
				//placeholder
				module1.addInput("untyped");
			}
			break;
		case "conditional":
			for (var i = 0; i < input; i++) {
				//placeholder
				module1.addInput("untyped");
			}
			break;
	}	 
	 myModules[index]=module1;
}
 
 function deleteModule(index){
 	switch (myModules[index].type) {
 		case "normal":
 		case "source":
 		case "sink":
 		case "study":
 			for (var o = 0; o < myModules[index].outputs.length; o++) {
 				if (myModules[index].outputs[o].inputConnectedTo != null) 
 					myModules[index].outputs[o].inputConnectedTo = null;
 			}
 			
 			for (var i = 0; i < myModules[index].inputs.length; i++) {
 				if (myModules[index].inputs[i].outputConnectedTo != null) 
 					myModules[index].inputs[i].inputConnectedTo = null;
 			}
 			break;
 		case "conditional":
 			for (var i = 0; i < myModules[index].inputs.length; i++) {
 				if (myModules[index].inputs[i].outputConnectedTo != null) 
 					myModules[index].inputs[i].inputConnectedTo = null;
 				
 				if (myModules[index].outputsTrue[i].outputConnectedTo != null) 
 					myModules[index].outputsTrue[i].inputConnectedTo = null;
 				
 				if (myModules[index].outputsFalse[i].outputConnectedTo != null) 
 					myModules[index].outputsFalse[i].inputConnectedTo = null;
 			}
 			myModules.splice(index, 1);
 	}
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
				this.inputs[i].offsetX = i*10;
			else
				this.inputs[i].offsetX = 0-i*10;
		}
		
		for (var i = 0; i < this.outputs.length; i++)
		{
			this.outputs[i].offsetY = 58;
			if (i % 2 == 0)
				this.outputs[i].offsetX = i*10;
			else
				this.outputs[i].offsetX = 0-i*10;
		}	
		return;
		
	case "source":
	case "study":
		for (var i = 0; i < this.outputs.length; i++)
		{
			this.outputs[i].offsetY = 37;
			if (i % 2 == 0)
				this.outputs[i].offsetX = i*10;
			else
				this.outputs[i].offsetX = 0-i*10;
		}
		return;
		
	case "sink":
		for (var i = 0; i < this.inputs.length; i++)
		{
			this.inputs[i].offsetY = -37;
			if (i % 2 == 0)
				this.inputs[i].offsetX = i*10;
			else
				this.inputs[i].offsetX = 0-i*10;
		}
		return;
		
	case "conditional":
		for (var i = 0; i < this.inputs.length; i++)
		{
			this.inputs[i].offsetY = -45;
			if (i % 2 == 0)
			
				this.inputs[i].offsetX = i*10;
			else
				this.inputs[i].offsetX = 0-i*10;
				
			this.outputsTrue[i].offsetY = 45;
			this.outputsFalse[i].offsetY = 45;
			this.outputsTrue[i].offsetX = -10-10*i;
			this.outputsFalse[i].offsetX = 10+10*i;;
			
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
	testMouse.X = e.pageX - canvas.offsetLeft;
	testMouse.Y = e.pageY - canvas.offsetTop;
	
	for (var i = 0; i < myModules.length; i++)
	{
		if (myModules[i].dragOK == true) {
			myModules[i].x = e.pageX - canvas.offsetLeft - myModules[i].groupMoveOffsetX;
			myModules[i].y = e.pageY - canvas.offsetTop - myModules[i].groupMoveOffsetY;
			
			if (myModules[i].selected == true)
			{
				for (var k=0;k<myModules.length;k++)
				{
					if (k != i && myModules[k].selected == true)
					{
						myModules[k].x = e.pageX - canvas.offsetLeft - myModules[k].groupMoveOffsetX;
						myModules[k].y = e.pageY - canvas.offsetTop - myModules[k].groupMoveOffsetY;
					}
				}
			}
		return;
		}
	}
}
 
function moveLine(e)
{
	testMouse.X = e.pageX - canvas.offsetLeft;
	testMouse.Y = e.pageY - canvas.offsetTop;
	
	
	makingConnection.x = e.pageX - canvas.offsetLeft;
	makingConnection.y = e.pageY - canvas.offsetTop;

}

function selectBox(e)
{
	testMouse.X = e.pageX - canvas.offsetLeft;
	testMouse.Y = e.pageY - canvas.offsetTop;
	
	
	selectionBox.x = e.pageX - canvas.offsetLeft;
	selectionBox.y = e.pageY - canvas.offsetTop;
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

//============================================
//        Mouse Manipulations
//============================================
function moduleMouseDown(e){
	if (e.button == 2) //right click
	{
		//check if right click selecting
		for (var i = 0; i < myModules.length; i++) {
<<<<<<< HEAD
			if (myModules[i].checkMoving(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop))
			{
				if (myModules[i].selected == true)
=======
			if (myModules[i].checkMoving(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop)) {
				if (myModules[i].selected == true) 
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
					break;
				else {
					//if not selected reset selection and select
					for (var k = 0; k < myModules.length; k++) {
						myModules[k].selected = false;
					}
					lineSelection.selected = false;
<<<<<<< HEAD
					lineSelection.fromModule = -1;
					lineSelection.toIndex = -1;
					lineSelection.fromType = "none";
=======
					lineSelection.fromOutput = null;
					lineSelection.toInput = null;
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
					
					myModules[i].selected = true;
					break;
				}
			}
		}
		testMouse.X = e.pageX - canvas.offsetLeft;
		testMouse.Y = e.pageY - canvas.offsetTop;
		return;
	}

	//check if moving module
	for (var i = 0; i < myModules.length; i++) {
		if (myModules[i].checkMoving(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop)) {
			
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
						myModules[k].groupMoveOffsetX = e.pageX - canvas.offsetLeft - myModules[k].x;
						myModules[k].groupMoveOffsetY = e.pageY - canvas.offsetTop- myModules[k].y;
					}
				}
			}
			myModules[i].groupMoveOffsetX = e.pageX - canvas.offsetLeft - myModules[i].x;
			myModules[i].groupMoveOffsetY = e.pageY - canvas.offsetTop- myModules[i].y;
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
		var connectionStart = myModules[i].checkConnection (e.pageX,e.pageY,canvas.offsetLeft,canvas.offsetTop);

		if (connectionStart != null) {
			makingConnection.connecting = true;
			makingConnection.output = connectionStart;
			makingConnection.x = e.pageX - canvas.offsetLeft;
			makingConnection.y = e.pageY - canvas.offsetTop;
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
				if (myModules[i].outputs[j].inputConnectedTo == null)
					continue;
					
				var startX = myModules[i].x+myModules[i].outputs[j].offsetX;
				var startY = myModules[i].y+myModules[i].outputs[j].offsetY;
				var startRotate = myModules[i].rotate;
				var endX = myModules[i].outputs[j].inputConnectedTo.parentModule.x + myModules[i].outputs[j].inputConnectedTo.offsetX;
				var endY = myModules[i].outputs[j].inputConnectedTo.parentModule.y + myModules[i].outputs[j].inputConnectedTo.offsetY;	
				var endRotate = myModules[i].outputs[j].inputConnectedTo.parentModule.rotate;
				
				if (clickConnection(startX, startY, endX, endY, startRotate, endRotate))
				{
<<<<<<< HEAD
					if (clickConnection(myModules[i].x, myModules[i].y + 65, myModules[myModules[i].outputs[p]].x, myModules[myModules[i].outputs[p]].y - myModules[myModules[i].outputs[p]].radius, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
					{
						lineSelection.selected = true;
						lineSelection.fromModule = i;
						lineSelection.toIndex = p;
						lineSelection.fromType = "normal";
					}

=======
					lineSelection.selected = true;
					lineSelection.fromOutput = myModules[i].outputs[j];
					lineSelection.toInput = myModules[i].outputs[j].inputConnectedTo;
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
				}
			}
			break;
			
		case "conditional":
			for (var j=0;j<myModules[i].outputsTrue.length;j++)
			{
				if (myModules[i].outputsTrue[j].inputConnectedTo == null)
					continue;
					
				var startX = myModules[i].x+myModules[i].outputsTrue[j].offsetX;
				var startY = myModules[i].y+myModules[i].outputsTrue[j].offsetY;
				var startRotate = myModules[i].rotate;
				var endX = myModules[i].outputsTrue[j].inputConnectedTo.parentModule.x + myModules[i].outputsTrue[j].inputConnectedTo.offsetX;
				var endY = myModules[i].outputsTrue[j].inputConnectedTo.parentModule.y + myModules[i].outputsTrue[j].inputConnectedTo.offsetY;	
				var endRotate = myModules[i].outputsTrue[j].inputConnectedTo.parentModule.rotate;
				
				if (clickConnection(startX, startY, endX, endY, startRotate, endRotate))
				{
					lineSelection.selected = true;
					lineSelection.fromOutput = myModules[i].outputsTrue[j];
					lineSelection.toInput = myModules[i].outputsTrue[j].inputConnectedTo;
				}
			}
			
			for (var j=0;j<myModules[i].outputsFalse.length;j++)
			{		
				if (myModules[i].outputsFalse[j].inputConnectedTo == null)
					continue;
					
				var startX = myModules[i].x+myModules[i].outputsFalse[j].offsetX;
				var startY = myModules[i].y+myModules[i].outputsFalse[j].offsetY;
				var startRotate = myModules[i].rotate;
				var endX = myModules[i].outputsFalse[j].inputConnectedTo.parentModule.x + myModules[i].outputsFalse[j].inputConnectedTo.offsetX;
				var endY = myModules[i].outputsFalse[j].inputConnectedTo.parentModule.y + myModules[i].outputsFalse[j].inputConnectedTo.offsetY;	
				var endRotate = myModules[i].outputsFalse[j].inputConnectedTo.parentModule.rotate;
				
				if (clickConnection(startX, startY, endX, endY, startRotate, endRotate))
				{
					lineSelection.selected = true;
					lineSelection.fromOutput = myModules[i].outputsFalse[j];
					lineSelection.toInput = myModules[i].outputsFalse[j].inputConnectedTo;
				}
			}
			break;
			
		default:
			break;
		}
	}
	
	
	//otherwise start dragging selection box.
	selectionBox.startX = e.pageX - canvas.offsetLeft;
	selectionBox.startY = e.pageY - canvas.offsetTop;
	selectionBox.x = e.pageX - canvas.offsetLeft;
	selectionBox.y = e.pageY - canvas.offsetTop;
	canvas.onmousemove = selectBox;
	selectionBox.selecting = true;
}

function moduleMouseUp(e){
	if (e.button == 2)
		return;
	if (makingConnection.connecting == true) {
		for (var i = 0; i < myModules.length; i++) {
			var checkConnect = myModules[i].checkConnected(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop)
			if (checkConnect != null) {
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
				if (doubleFlag == false && checkConnect != null) 
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
	testMouse.X = e.pageX - canvas.offsetLeft;
	testMouse.Y = e.pageY - canvas.offsetTop;
}
 
//=============================================== 
//initial conditions
//===============================================
function init()
{
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
	 
		createModule(75,50,"normal",1,1);
		myModules[0].addInput("untyped");
		myModules[0].addOutput("untyped");
		createModule(200,200,"conditional",1,1)
		createModule(150,150,"source",0,1)
		createModule(300,300,"sink",1,0)
		createModule(400,400,"study",0,1)
	 return setInterval(draw, 10);
}

//============================================
//        Draw Functions
//============================================
function clear() 
{
 	ctx.clearRect(0, 0, WIDTH, HEIGHT);
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
				if (myModules[i].outputs[j].inputConnectedTo != null) {
					if (myModules[i].outputs[j].inputConnectedTo.parentModule.selected == true || myModules[i].selected == true)
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
<<<<<<< HEAD
						
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[j]].rotate == 0)	
						drawConnection(myModules[i].x, myModules[i].y + 65, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[j]].rotate == 0)
						drawConnection(myModules[i].x+65, myModules[i].y, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[j]].rotate == 1)	
						drawConnection(myModules[i].x, myModules[i].y+65, myModules[myModules[i].outputs[j]].x - myModules[myModules[i].outputs[j]].radius, myModules[myModules[i].outputs[j]].y, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)			
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[j]].rotate == 1)							
						drawConnection(myModules[i].x+65, myModules[i].y, myModules[myModules[i].outputs[j]].x - myModules[myModules[i].outputs[j]].radius, myModules[myModules[i].outputs[j]].y, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
=======
					
					var startX = myModules[i].x+myModules[i].outputs[j].offsetX;
					var startY = myModules[i].y+myModules[i].outputs[j].offsetY;
					var startRotate = myModules[i].rotate;
					var endX = myModules[i].outputs[j].inputConnectedTo.parentModule.x + myModules[i].outputs[j].inputConnectedTo.offsetX;
					var endY = myModules[i].outputs[j].inputConnectedTo.parentModule.y + myModules[i].outputs[j].inputConnectedTo.offsetY;	
					var endRotate = myModules[i].outputs[j].inputConnectedTo.parentModule.rotate;
					
					if (myModules[i].outputs[j] == lineSelection.fromOutput && myModules[i].outputs[j].inputConnectedTo == lineSelection.toInput)
						ctx.strokeStyle="#99CC32";
					drawConnection(startX, startY, endX, endY, startRotate, endRotate);
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
				}
			}
			break;
			
		case "conditional":
			for (var j=0;j<myModules[i].outputsTrue.length;j++)
			{
				if (myModules[i].outputsTrue[j].inputConnectedTo != null) {
					if (myModules[i].outputsTrue[j].inputConnectedTo.parentModule.selected == true || myModules[i].selected == true)
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
					
					var startX = myModules[i].x+myModules[i].outputsTrue[j].offsetX;
					var startY = myModules[i].y+myModules[i].outputsTrue[j].offsetY;
					var startRotate = myModules[i].rotate;
					var endX = myModules[i].outputsTrue[j].inputConnectedTo.parentModule.x + myModules[i].outputsTrue[j].inputConnectedTo.offsetX;
					var endY = myModules[i].outputsTrue[j].inputConnectedTo.parentModule.y + myModules[i].outputsTrue[j].inputConnectedTo.offsetY;	
					var endRotate = myModules[i].outputsTrue[j].inputConnectedTo.parentModule.rotate;
					
					if (myModules[i].outputsTrue[j] == lineSelection.fromOutput && myModules[i].outputsTrue[j].inputConnectedTo == lineSelection.toInput)
						ctx.strokeStyle="#99CC32";
					drawConnection(startX, startY, endX, endY, startRotate, endRotate);
				}
			}
			
			for (var j=0;j<myModules[i].outputsFalse.length;j++)
			{
				if (myModules[i].outputsFalse[j].inputConnectedTo != null) {
					if (myModules[i].outputsFalse[j].inputConnectedTo.parentModule.selected == true || myModules[i].selected == true)
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
					
					var startX = myModules[i].x+myModules[i].outputsFalse[j].offsetX;
					var startY = myModules[i].y+myModules[i].outputsFalse[j].offsetY;
					var startRotate = myModules[i].rotate;
					var endX = myModules[i].outputsFalse[j].inputConnectedTo.parentModule.x + myModules[i].outputsFalse[j].inputConnectedTo.offsetX;
					var endY = myModules[i].outputsFalse[j].inputConnectedTo.parentModule.y + myModules[i].outputsFalse[j].inputConnectedTo.offsetY;	
					var endRotate = myModules[i].outputsFalse[j].inputConnectedTo.parentModule.rotate;
					
					if (myModules[i].outputsFalse[j] == lineSelection.fromOutput && myModules[i].outputsFalse[j].inputConnectedTo == lineSelection.toInput)
						ctx.strokeStyle="#99CC32";
					drawConnection(startX, startY, endX, endY, startRotate, endRotate);
				}
			}
			break;
			
		default:
			break;
		}
	}
	ctx.lineWidth = "3";
	ctx.strokeStyle="#7585C1";
	//Drawing a Line
	if (makingConnection.connecting==true)
	{
<<<<<<< HEAD
		for (var i = 0; i < myModules.length; i++) {
			switch(myModules[i].type)
			{
			case "normal":
				if (myModules[i].connecting == true) {
					if (myModules[i].rotate == 0)
						drawConnection(myModules[i].x, myModules[i].y + 65, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
					else
						drawConnection(myModules[i].x + 65, myModules[i].y, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
				}
				break;	
			case "conditional":
				if (myModules[i].connectingTrue == true) {
					if (myModules[i].rotate == 0)
						drawConnection(myModules[i].x - 20, myModules[i].y + 53, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
					else
						drawConnection(myModules[i].x + 53, myModules[i].y - 20, makingConnection.x, makingConnection.y,myModules[i].rotate,0)						
					break;
				}
				else 
					if (myModules[i].connectingFalse == true) {
						if (myModules[i].rotate == 0)
							drawConnection(myModules[i].x + 20, myModules[i].y + 53, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
						else
							drawConnection(myModules[i].x + 53, myModules[i].y + 20, makingConnection.x, makingConnection.y,myModules[i].rotate,0)						
						break;
					}
				else
					break;
			
			case "source":
			case "study":
				if (myModules[i].connecting == true) {
					if (myModules[i].rotate == 0)
						drawConnection(myModules[i].x, myModules[i].y + 36, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
					else
						drawConnection(myModules[i].x + 36, myModules[i].y, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
				}
				break;	
						
			}
		}
=======
		var startX = makingConnection.output.parentModule.x+makingConnection.output.offsetX;
		var startY = makingConnection.output.parentModule.y+makingConnection.output.offsetY;
		var parentRotate = makingConnection.output.parentModule.rotate;
		drawConnection(startX,startY, testMouse.X,testMouse.Y ,parentRotate,0)
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
	}
	
	//Draw the Modules
	for (var i = 0; i < myModules.length; i++)
	{
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
	
	
}

function drawNormal(drawModule){

	var isSelected = new Boolean();
	if (drawModule.selected == true){
		ctx.strokeStyle = "#99CC32";
<<<<<<< HEAD
	else
		ctx.strokeStyle = "#7585C1"
	/*ctx.beginPath();
	ctx.fillStyle = "LightBlue";
	ctx.lineWidth = "3";
	ctx.beginPath();
	ctx.arc(drawModule.x, drawModule.y, 45, 0, 2 * 3.141592653589792348624, 0);
	ctx.stroke();
	ctx.fill();*/
	 ctx.save();
=======
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "#7585C1"
		isSelected = false;
	}

	ctx.save();
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
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
	ctx.lineWidth = "1";
	ctx.fillStyle = "#7585C1";
	if (drawModule.rotate == 0) {
<<<<<<< HEAD
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.moveTo(drawModule.x-7,drawModule.y+53)
		ctx.lineTo(drawModule.x+7,drawModule.y+53)
		ctx.lineTo(drawModule.x,drawModule.y+65)
		ctx.closePath();
		ctx.stroke();
		if (drawModule.outputs.length > 0) {
			ctx.fillStyle = "#7585C1"
			ctx.fill();
		}

		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		
		ctx.beginPath();
		ctx.arc(drawModule.x, drawModule.y - 57, 5, 0, 2 * 3.141592653589792348624, 0)
		ctx.stroke();
	}
	else
	{
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		
		ctx.moveTo(drawModule.x+53,drawModule.y-7)
		ctx.lineTo(drawModule.x+53,drawModule.y+7)
		ctx.lineTo(drawModule.x+65,drawModule.y)
		ctx.closePath();
		ctx.stroke();
		if (drawModule.outputs.length > 0) {
			ctx.fillStyle = "#7585C1"
			ctx.fill();
		}
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		
		ctx.beginPath();
		ctx.arc(drawModule.x-57, drawModule.y , 5, 0, 2 * 3.141592653589792348624, 0)
		ctx.stroke();
		/*if (drawModule.outputs.length > 0) {
			ctx.fillstyle = "#7585C1"
			ctx.fill();
		}*/
	}
}		
                                                                
=======
		//draw outputs
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 7, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 7, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputConnectedTo != null) {
				ctx.fill();
			}
		}
		//draw inputs
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)

			ctx.stroke();
			if (drawModule.inputs[i].outputConnectedTo != null) {
				ctx.fill();
			}
		}
	}
	else
	{
		//draw outputs
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY + 7)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 7)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputConnectedTo != null) {
				ctx.fill();
			}
		}
		//draw inputs
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			if (drawModule.inputs[i].outputConnectedTo != null) {
				ctx.fill();
			}
		}
	}
}		                             
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
                                             
function drawConditional (drawModule)
{
		var isSelected = new Boolean();
		if (drawModule.selected == true){
			ctx.strokeStyle = "#99CC32";
			isSelected = true;
		}
		else{
			ctx.strokeStyle = "black"
			isSelected = false;
		}
			
<<<<<<< HEAD
			/*
		ctx.beginPath();
		ctx.fillStyle = "LightBlue";
		ctx.lineWidth = "2";
		ctx.fillRect(drawModule.x - 45, drawModule.y - 45, 90, 90);
		ctx.strokeRect(drawModule.x - 45, drawModule.y - 45, 90, 90);
		
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		*/
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
		
=======
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
		
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
		if(isSelected){
			var oh = height*1.06;
			var ow = width*1.06;
			var rad = oh/6.5;
<<<<<<< HEAD
			
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

		ctx.lineWidth = "1";
		ctx.fillStyle = "Grey";
	
		if (drawModule.rotate == 0) {
			ctx.beginPath();
			ctx.arc(drawModule.x, drawModule.y - 53, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(drawModule.x - 20, drawModule.y + 53, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
=======
>>>>>>> 4fc6a47666baf0cc1cd8f7239a95913c5694a87f
			
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
		ctx.fillStyle = "#7585C1";
		ctx.strokeStyle = "#7585C1";
		if (drawModule.rotate == 0) {
			//draw outputs
			for (var i = 0; i < drawModule.inputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsTrue[i].offsetX - 5, drawModule.y + drawModule.outputsTrue[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsTrue[i].offsetX + 5, drawModule.y + drawModule.outputsTrue[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsTrue[i].offsetX, drawModule.y + drawModule.outputsTrue[i].offsetY + 5)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsTrue[i].inputConnectedTo != null) {
					ctx.fill();
				}
				
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsFalse[i].offsetX - 5, drawModule.y + drawModule.outputsFalse[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX + 5, drawModule.y + drawModule.outputsFalse[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX, drawModule.y + drawModule.outputsFalse[i].offsetY + 5)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsTrue[i].inputConnectedTo != null) {
					ctx.fill();
				}
			}
			//draw inputs
			for (var i = 0; i < drawModule.inputs.length; i++) {	
				ctx.beginPath();
				ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
				ctx.stroke();
				if (drawModule.inputs[i].outputConnectedTo != null) {
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
				if (drawModule.outputsTrue[i].inputConnectedTo != null) {
					ctx.fill();
				}
				
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputsFalse[i].offsetX - 5, drawModule.y + drawModule.outputsFalse[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX - 5, drawModule.y + drawModule.outputsFalse[i].offsetY + 5)
				ctx.lineTo(drawModule.x + drawModule.outputsFalse[i].offsetX + 5, drawModule.y + drawModule.outputsFalse[i].offsetY)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputsTrue[i].inputConnectedTo != null) {
					ctx.fill();
				}
			}
			//draw inputs
			for (var i = 0; i < drawModule.inputs.length; i++) {	
				ctx.beginPath();
				ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
				ctx.stroke();
				if (drawModule.inputs[i].outputConnectedTo != null) {
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
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "black"
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
			ctx.fillStyle = "#7585C1";
			ctx.strokeStyle = "#7585C1";
			for (var i = 0; i < drawModule.outputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX, drawModule.y + drawModule.outputs[i].offsetY + 5)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputs[i].inputConnectedTo != null) {
					ctx.fill();
				}
			}
		}
		else
		{
		//draw outputs
			ctx.lineWidth = "3";
			ctx.fillStyle = "#7585C1";
			ctx.strokeStyle = "#7585C1";
			for (var i = 0; i < drawModule.outputs.length; i++) {
				ctx.beginPath();
				ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY + 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
				ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY)
				ctx.closePath();
				ctx.stroke();
				if (drawModule.outputs[i].inputConnectedTo != null) {
					ctx.fill();
				}
			}	
		}
}

function drawSink (drawModule)
{
	var isSelected = new Boolean();
	if (drawModule.selected == true) {
		ctx.strokeStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "black";
		isSelected = false;
	}	
		
	ctx.fillStyle = "LightGray";
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
		ctx.fillStyle = "#7585C1";
		ctx.strokeStyle = "#7585C1";
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			if (drawModule.inputs[i].outputConnectedTo != null) {
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
		ctx.fillStyle = "#7585C1";
		ctx.strokeStyle = "#7585C1";
		for (var i = 0; i < drawModule.inputs.length; i++) {	
			ctx.beginPath();
			ctx.arc(drawModule.x + drawModule.inputs[i].offsetX, drawModule.y + drawModule.inputs[i].offsetY, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			if (drawModule.inputs[i].outputConnectedTo != null) {
				ctx.fill();
			}
		}
	}
}

function drawStudy (drawModule)
{
	var isSelected = new Boolean();
	if (drawModule.selected == true) {
		ctx.strokeStyle = "#99CC32";
		isSelected = true;
	}
	else {
		ctx.strokeStyle = "black";
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
		ctx.fillStyle = "#7585C1";
		ctx.strokeStyle = "#7585C1";
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputConnectedTo != null) {
				ctx.fill();
			}
		}
	}
	else
	{
	//draw outputs
		ctx.lineWidth = "3";
		ctx.fillStyle = "#7585C1";
		ctx.strokeStyle = "#7585C1";
		for (var i = 0; i < drawModule.outputs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY + 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX - 5, drawModule.y + drawModule.outputs[i].offsetY - 5)
			ctx.lineTo(drawModule.x + drawModule.outputs[i].offsetX + 5, drawModule.y + drawModule.outputs[i].offsetY)
			ctx.closePath();
			ctx.stroke();
			if (drawModule.outputs[i].inputConnectedTo != null) {
				ctx.fill();
			}
		}	
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
