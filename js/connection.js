// JavaScript Document

//initial variables
var testMouseX=50;
var testMouseY=50;
var canvas;
var ctx;
var x = 75;
var y = 50;
var WIDTH = 800;
var HEIGHT = 600;
var myModules=new Array();
makingConnection=new Object();
makingConnection.x=0;
makingConnection.y=0;
makingConnection.connecting=false;

selectionBox = new Object();
selectionBox.startX = 0;
selectionBox.startY = 0;
selectionBox.x=0;
selectionBox.y=0;
selectionBox.selecting = false;

lineSelection = new Object();
lineSelection.selected = false;
lineSelection.fromModule = -1;
lineSelection.fromType = "none"; //normal false or true
lineSelection.toIndex = -1;

input =  {
ctrlFlag : false
}

var copyModules = new Array();
init()
canvas.onmousedown = moduleMouseDown;
canvas.onmouseup = moduleMouseUp;

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
	
	//outputs
	this.outputs=new Array();	
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
	
	for (p=0;p<sourceModule.outputs.length;p++)
	{
		this.outputs[p]=sourceModule.outputs[p];
	}
		
	this.outputsTrue=new Array();
	
	for (p=0;p<sourceModule.outputsTrue.length;p++)
	{
		this.outputsTrue[p]=sourceModule.outputsTrue[p];
	}
	
	this.outputsFalse=new Array();
	
	for (p=0;p<sourceModule.outputsFalse.length;p++)
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
	case "sink":
	if (this.rotate == 0) {
		if (mouseX < this.x + 5 + offsetLeft &&
		mouseX > this.x - 5 + offsetLeft &&
		mouseY > this.y - 38 + offsetTop &&
		mouseY < this.y - 28 + offsetTop) 
			return true;
	}
	else if (this.rotate == 1){
		if (mouseX > this.x - 38 + offsetLeft &&
		mouseX < this.x - 28 + offsetLeft &&
		mouseY < this.y + 5 + offsetTop &&
		mouseY > this.y - 5 + offsetTop) 
			return true;
	}
	else 
		return false;
	default:
		return false;
	}
 }
 function checkConnection (mouseX,mouseY,offsetLeft,offsetTop)
 {
 	switch(this.type)
	{
		
	case "normal":
		if (this.rotate == 0) {
			if (mouseX < this.x + 7 + offsetLeft &&
			mouseX > this.x - 7 + offsetLeft &&
			mouseY < this.y + 58 + offsetTop &&
			mouseY > this.y + 48 + offsetTop) {
				this.connecting = true;
				return 1;
			}
			else 
				return -1;
		}
		else
		{
			if (mouseX > this.x + 48 + offsetLeft &&
			mouseX < this.x + 58 + offsetLeft &&
			mouseY > this.y - 7  + offsetTop &&
			mouseY < this.y + 7 + offsetTop) {
				this.connecting = true;
				return 1;
			}
			else 
				return -1;
		}
		break;	
	case "conditional":
		if (this.rotate == 0) {
			if (mouseX < this.x + 25 + offsetLeft &&
			mouseX > this.x + 15 + offsetLeft &&
			mouseY < this.y + 58 + offsetTop &&
			mouseY > this.y + 48 + offsetTop) {
				this.connecting = true;
				this.connectingFalse = true;
				return 2;
			}
			else 
				if (mouseX < this.x - 15 + offsetLeft &&
				mouseX > this.x - 25 + offsetLeft &&
				mouseY < this.y + 58 + offsetTop &&
				mouseY > this.y + 48 + offsetTop) {
					this.connecting = true;
					this.connectingTrue = true;
					return 1;
				}
				
				else 
					return -1;
		}
		else
		{
			if (mouseX > this.x + 48 + offsetLeft &&
			mouseX < this.x + 58 + offsetLeft &&
			mouseY > this.y + 15 + offsetTop &&
			mouseY < this.y + 25 + offsetTop) {
				this.connecting = true;
				this.connectingFalse = true;
				return 2;
			}
			else 
				if (mouseX > this.x + 48 + offsetLeft &&
				mouseX < this.x + 58 + offsetLeft &&
				mouseY > this.y - 25 + offsetTop &&
				mouseY < this.y - 15 + offsetTop) {
					this.connecting = true;
					this.connectingTrue = true;
					return 1;
				}
				
				else 
					return -1;
		}
		break;
	case "source":
	case "study":
		if (this.rotate == 0) {
			if (mouseX < this.x + 7 + offsetLeft &&
			mouseX > this.x - 7 + offsetLeft &&
			mouseY < this.y + 45 + offsetTop &&
			mouseY > this.y + 30 + offsetTop) {
				this.connecting = true;
				return 1;
			}
			else 
				return -1;
		}
		else
		{
			if (mouseX > this.x + 30 + offsetLeft &&
			mouseX < this.x + 45 + offsetLeft &&
			mouseY > this.y - 7 + offsetTop &&
			mouseY < this.y + 7 + offsetTop) {
				this.connecting = true;
				return 1;
			}
			else 
				return -1;
		}
		break;
	default:
		return -1;
	} 
 }
 
 //============================================
 //        Module Manipulations
 //============================================
 function createModule(x,y,type,input,output)
 {
 	var index=myModules.length;
	 var module1=new module(x,y,type,1,1);
	 myModules[index]=module1;
 }
 
 function deleteModule(index)
 {
 	var cutOff = index;
	myModules.splice(index, 1);
	
	for (i=0;i<myModules.length;i++)
	{
		switch(myModules[i].type)
		{
		case "study":
		case "source":
		case "normal":
			for (j=0;j<myModules[i].outputs.length;j++)
			{
				if (myModules[i].outputs[j] == cutOff) {
					myModules[i].outputs.splice(j, 1);
					j--;
				}
				else 
					if (myModules[i].outputs[j] > cutOff) 
						myModules[i].outputs[j]--;
				
			}
			break;
			
		case "conditional":
			for (j=0;j<myModules[i].outputsTrue.length;j++)
			{
				if (myModules[i].outputsTrue[j] == cutOff) {
					myModules[i].outputsTrue.splice(j, 1)
					j--;
				}
				else 
					if (myModules[i].outputsTrue[j] > cutOff) 
						myModules[i].outputsTrue[j]--;
			}
			for (j=0;j<myModules[i].outputsFalse.length;j++)
			{
				if (myModules[i].outputsFalse[j] == cutOff) {
					myModules[i].outputsFalse.splice(j, 1)
					j--;
				}
				else 
					if (myModules[i].outputsFalse[j] > cutOff) 
						myModules[i].outputsFalse[j]--;
			}
			break;
		
		}
	}
 }
 
 
function moveModule(e){
	for (i = 0; i < myModules.length; i++)
	{
		if (myModules[i].dragOK == true) {
			myModules[i].x = e.pageX - canvas.offsetLeft;
			myModules[i].y = e.pageY - canvas.offsetTop;
			
			if (myModules[i].selected == true)
			{
				for (k=0;k<myModules.length;k++)
				{
					if (k != i && myModules[k].selected == true)
					{
						myModules[k].x = e.pageX - canvas.offsetLeft - myModules[k].groupMoveOffsetX;
						myModules[k].y = e.pageY - canvas.offsetLeft - myModules[k].groupMoveOffsetY;
					}
				}
			}
		return;
		}
	}
}
 
function moveLine(e)
{
	makingConnection.x = e.pageX - canvas.offsetLeft;
	makingConnection.y = e.pageY - canvas.offsetTop;

}

function selectBox(e)
{
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
		
	for (i=0;i<myModules.length;i++)
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
}

//sarashour@gmail.com
//============================================
//        Mouse Manipulations
//============================================
function moduleMouseDown(e){
	if (e.button == 2) //right click
		return;
	var i = 0
	//check if moving module
	for (i = 0; i < myModules.length; i++) {
		if (myModules[i].checkMoving(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop)) {
			
			//if not selected reset selection
			if (myModules[i].selected == false)
			{
					for (k = 0; k < myModules.length; k++) {
						myModules[k].selected = false;
					}
					lineSelection.selected = false;
					lineSelection.fromModule = -1;
					lineSelection.toIndex = -1;
					lineSelection.fromType = "none";
			}
			else
			{
				for (k=0;k < myModules.length;k++)
				{
					if (i != k && myModules[k].selected == true)
					{
						myModules[k].groupMoveOffsetX = myModules[i].x - myModules[k].x;
						myModules[k].groupMoveOffsetY = myModules[i].y - myModules[k].y;
					}
				}
			}
			myModules[i].x = e.pageX - canvas.offsetLeft;
			myModules[i].y = e.pageY - canvas.offsetTop;
			myModules[i].dragOK = true;
			canvas.onmousemove = moveModule;
			myModules[i].selected = true;
			return;
		}
	}
	
	//if not moving, reset selection
	for (i = 0; i < myModules.length; i++) {
		myModules[i].selected = false;
	}
	lineSelection.selected = false;
	lineSelection.fromModule = -1;
	lineSelection.toIndex = -1;
	lineSelection.fromType = "none";	
	
	//check if connecting
	for (i = 0; i < myModules.length; i++) {
		var testConnect = myModules[i].checkConnection (e.pageX,e.pageY,canvas.offsetLeft,canvas.offsetTop);
		if (testConnect >0) {
			makingConnection.connecting = true;
			makingConnection.x = e.pageX - canvas.offsetLeft;
			makingConnection.y = e.pageY - canvas.offsetTop;
			canvas.onmousemove = moveLine;
			return;
		}
	}
	
	//check if selecting line.
	for (i=0;i < myModules.length;i++)
	{
		switch (myModules[i].type)
		{
			case "normal":
				for (p=0;p<myModules[i].outputs.length;p++)
				{
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[p]].rotate == 0) {
						if (clickConnection(myModules[i].x, myModules[i].y + 53, myModules[myModules[i].outputs[p]].x, myModules[myModules[i].outputs[p]].y - myModules[myModules[i].outputs[p]].radius, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[p]].rotate == 0) {
						if 	(clickConnection(myModules[i].x + 53, myModules[i].y, myModules[myModules[i].outputs[p]].x, myModules[myModules[i].outputs[p]].y - myModules[myModules[i].outputs[p]].radius, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[p]].rotate == 1) {
						if (clickConnection(myModules[i].x, myModules[i].y + 53, myModules[myModules[i].outputs[p]].x - myModules[myModules[i].outputs[p]].radius, myModules[myModules[i].outputs[p]].y, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[p]].rotate == 1) {
						if (clickConnection(myModules[i].x + 53, myModules[i].y, myModules[myModules[i].outputs[p]].x - myModules[myModules[i].outputs[p]].radius, myModules[myModules[i].outputs[p]].y, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
				}
			
				break;
			case "source":
			case "study":
				for (p=0;p<myModules[i].outputs.length;p++)
				{
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[p]].rotate == 0) {
						if (clickConnection(myModules[i].x, myModules[i].y + 36, myModules[myModules[i].outputs[p]].x, myModules[myModules[i].outputs[p]].y - myModules[myModules[i].outputs[p]].radius, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[p]].rotate == 0) {
						if 	(clickConnection(myModules[i].x + 36, myModules[i].y, myModules[myModules[i].outputs[p]].x, myModules[myModules[i].outputs[p]].y - myModules[myModules[i].outputs[p]].radius, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[p]].rotate == 1) {
						if (clickConnection(myModules[i].x, myModules[i].y + 36, myModules[myModules[i].outputs[p]].x - myModules[myModules[i].outputs[p]].radius, myModules[myModules[i].outputs[p]].y, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[p]].rotate == 1) {
						if (clickConnection(myModules[i].x + 36, myModules[i].y, myModules[myModules[i].outputs[p]].x - myModules[myModules[i].outputs[p]].radius, myModules[myModules[i].outputs[p]].y, myModules[i].rotate, myModules[myModules[i].outputs[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "normal";
						}
					}
				}
			
				break;
			
			
			case "conditional":
				for (p=0;p<myModules[i].outputsFalse.length;p++)
				{
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputsFalse[p]].rotate == 0) {
						if (clickConnection(myModules[i].x+20, myModules[i].y + 53, myModules[myModules[i].outputsFalse[p]].x, myModules[myModules[i].outputsFalse[p]].y - myModules[myModules[i].outputsFalse[p]].radius, myModules[i].rotate, myModules[myModules[i].outputsFalse[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "False";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsFalse[p]].rotate == 0) {
						if 	(clickConnection(myModules[i].x + 53, myModules[i].y+20, myModules[myModules[i].outputsFalse[p]].x, myModules[myModules[i].outputsFalse[p]].y - myModules[myModules[i].outputsFalse[p]].radius, myModules[i].rotate, myModules[myModules[i].outputsFalse[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "False";
						}
					}
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputsFalse[p]].rotate == 1) {
						if (clickConnection(myModules[i].x+20, myModules[i].y + 53, myModules[myModules[i].outputsFalse[p]].x - myModules[myModules[i].outputsFalse[p]].radius, myModules[myModules[i].outputsFalse[p]].y, myModules[i].rotate, myModules[myModules[i].outputsFalse[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "False";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsFalse[p]].rotate == 1) {
						if (clickConnection(myModules[i].x + 53, myModules[i].y+20, myModules[myModules[i].outputsFalse[p]].x - myModules[myModules[i].outputsFalse[p]].radius, myModules[myModules[i].outputsFalse[p]].y, myModules[i].rotate, myModules[myModules[i].outputsFalse[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "False";
						}
					}
				}
				
				for (p=0;p<myModules[i].outputsTrue.length;p++)
				{
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputsTrue[p]].rotate == 0) {
						if (clickConnection(myModules[i].x-20, myModules[i].y + 53, myModules[myModules[i].outputsTrue[p]].x, myModules[myModules[i].outputsTrue[p]].y - myModules[myModules[i].outputsTrue[p]].radius, myModules[i].rotate, myModules[myModules[i].outputsTrue[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "True";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsTrue[p]].rotate == 0) {
						if 	(clickConnection(myModules[i].x + 53, myModules[i].y-20, myModules[myModules[i].outputsTrue[p]].x, myModules[myModules[i].outputsTrue[p]].y - myModules[myModules[i].outputsTrue[p]].radius, myModules[i].rotate, myModules[myModules[i].outputsTrue[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "True";
						}
					}
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputsTrue[p]].rotate == 1) {
						if (clickConnection(myModules[i].x-20, myModules[i].y + 53, myModules[myModules[i].outputsTrue[p]].x - myModules[myModules[i].outputsTrue[p]].radius, myModules[myModules[i].outputsTrue[p]].y, myModules[i].rotate, myModules[myModules[i].outputsTrue[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "True";
						}
					}
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsTrue[p]].rotate == 1) {
						if (clickConnection(myModules[i].x + 53, myModules[i].y-20, myModules[myModules[i].outputsTrue[p]].x - myModules[myModules[i].outputsTrue[p]].radius, myModules[myModules[i].outputsTrue[p]].y, myModules[i].rotate, myModules[myModules[i].outputsTrue[p]].rotate, e.pageX - canvas.offsetLeft,e.pageY - canvas.offsetTop))
						{
							lineSelection.selected = true;
							lineSelection.fromModule = i;
							lineSelection.toIndex = p;
							lineSelection.fromType = "True";
						}
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
	for (i = 0; i < myModules.length; i++) {
		var checkConnect = myModules[i].checkConnected(e.pageX,e.pageY,canvas.offsetLeft,canvas.offsetTop)
		if (checkConnect == true)
		{
			var doubleFlag = false;
			var k = 0;
			for (k = 0; k < myModules.length; k++) {
				if (i != k && myModules[k].connecting == true) {
					switch(myModules[k].type)
					{
						
					case "study":
					case "source":
					case "normal":
						for (j=0;j<myModules[k].outputs.length;j++)
						{
							if (myModules[k].outputs[j]==i)
								doubleFlag = true;
						}
						if (doubleFlag == false)
							myModules[k].outputs[myModules[k].outputs.length]=i;
						else
							doubleFlag = false;
						break;
					
					case "conditional":
						if (myModules[k].connectingTrue == true) {
							for (j = 0; j < myModules[k].outputsTrue.length; j++) {
								if (myModules[k].outputsTrue[j] == i) 
									doubleFlag = true;
							}
							if (doubleFlag == false)
								myModules[k].outputsTrue[myModules[k].outputsTrue.length] = i;
							else
								doubleFlag = false;
						}
						else 
							if (myModules[k].connectingFalse == true) {
								for (j = 0; j < myModules[k].outputsFalse.length; j++) {
									if (myModules[k].outputsFalse[j] == i) 
										doubleFlag = true;
								}
								if (doubleFlag == false)
									myModules[k].outputsFalse[myModules[k].outputsFalse.length] = i;
								else
									doubleFlag = false;
							}
						break;
					}
				break;
				}
				
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
	for (i = 0; i < myModules.length; i++) {
		myModules[i].dragOK = false;
		myModules[i].connecting=false;
		myModules[i].connectingTrue=false;
		myModules[i].connectingFalse=false;
	}
	
	makingConnection.connecting=false;
	canvas.onmousemove = null;
	
	selectionBox.selecting = false;

	
	
} 
 
 
//=============================================== 
//initial conditions
//===============================================
function init()
{
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
		createModule(75,50,"normal",1,1);
		myModules[0].rotate = 1;
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
	
	/*
	ctx.strokeRect(3,3,50,100);
	ctx.strokeRect(3,53,50,100);
	
	ctx.beginPath;
	ctx.fillStyle= "Blue";
	ctx.arc(28,28,10,2*3.14159265, 0);
	ctx.stroke();
	ctx.fill();
	*/
	
	
	//Draw the connections
	ctx.strokeStyle="#7585C1";
	for (i=0; i < myModules.length; i++)
	{
		switch(myModules[i].type)
		{
		case "normal":
			for (j=0;j<myModules[i].outputs.length;j++)
			{
				if (myModules[i].outputs[j] != -1) {
					if (myModules[myModules[i].outputs[j]].selected == true || myModules[i].selected == true || ((lineSelection.selected == true) && (lineSelection.fromType == "normal") && (lineSelection.fromModule == i) && (lineSelection.toIndex == j)))
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
						
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[j]].rotate == 0)	
						drawConnection(myModules[i].x, myModules[i].y + 53, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[j]].rotate == 0)
						drawConnection(myModules[i].x+53, myModules[i].y, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[j]].rotate == 1)	
						drawConnection(myModules[i].x, myModules[i].y+53, myModules[myModules[i].outputs[j]].x - myModules[myModules[i].outputs[j]].radius, myModules[myModules[i].outputs[j]].y, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)			
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[j]].rotate == 1)							
						drawConnection(myModules[i].x+53, myModules[i].y, myModules[myModules[i].outputs[j]].x - myModules[myModules[i].outputs[j]].radius, myModules[myModules[i].outputs[j]].y, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
				}
			}
			break;
			
		case "conditional":
			for (j = 0; j < myModules[i].outputsTrue.length; j++) 
				if (myModules[i].outputsTrue[j] != -1) {
					
					if (myModules[myModules[i].outputsTrue[j]].selected == true || myModules[i].selected == true || ((lineSelection.fromType == "True") &&(lineSelection.selected == true) && (lineSelection.fromModule == i) && (lineSelection.toIndex == j)))
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
						
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputsTrue[j]].rotate == 0)	
						drawConnection(myModules[i].x-20, myModules[i].y + 53, myModules[myModules[i].outputsTrue[j]].x, myModules[myModules[i].outputsTrue[j]].y - myModules[myModules[i].outputsTrue[j]].radius, myModules[i].rotate,myModules[myModules[i].outputsTrue[j]].rotate)
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsTrue[j]].rotate == 0)
						drawConnection(myModules[i].x+53, myModules[i].y-20, myModules[myModules[i].outputsTrue[j]].x, myModules[myModules[i].outputsTrue[j]].y - myModules[myModules[i].outputsTrue[j]].radius, myModules[i].rotate,myModules[myModules[i].outputsTrue[j]].rotate)
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputsTrue[j]].rotate == 1)	
						drawConnection(myModules[i].x-20, myModules[i].y+53, myModules[myModules[i].outputsTrue[j]].x - myModules[myModules[i].outputsTrue[j]].radius, myModules[myModules[i].outputsTrue[j]].y, myModules[i].rotate,myModules[myModules[i].outputsTrue[j]].rotate)			
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsTrue[j]].rotate == 1)							
						drawConnection(myModules[i].x+53, myModules[i].y-20, myModules[myModules[i].outputsTrue[j]].x - myModules[myModules[i].outputsTrue[j]].radius, myModules[myModules[i].outputsTrue[j]].y, myModules[i].rotate,myModules[myModules[i].outputsTrue[j]].rotate)
				}	
			for (j = 0; j < myModules[i].outputsFalse.length; j++) 
				if (myModules[i].outputsFalse[j] != -1) {
					
					if (myModules[myModules[i].outputsFalse[j]].selected == true || myModules[i].selected == true || ((lineSelection.fromType == "False") &&(lineSelection.selected == true) && (lineSelection.fromModule == i) && (lineSelection.toIndex == j)))
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
					
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputsFalse[j]].rotate == 0)	
						drawConnection(myModules[i].x+20, myModules[i].y + 53, myModules[myModules[i].outputsFalse[j]].x, myModules[myModules[i].outputsFalse[j]].y - myModules[myModules[i].outputsFalse[j]].radius, myModules[i].rotate,myModules[myModules[i].outputsFalse[j]].rotate)
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsFalse[j]].rotate == 0)
						drawConnection(myModules[i].x+53, myModules[i].y+20, myModules[myModules[i].outputsFalse[j]].x, myModules[myModules[i].outputsFalse[j]].y - myModules[myModules[i].outputsFalse[j]].radius, myModules[i].rotate,myModules[myModules[i].outputsFalse[j]].rotate)
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputsFalse[j]].rotate == 1)	
						drawConnection(myModules[i].x+20, myModules[i].y+53, myModules[myModules[i].outputsFalse[j]].x - myModules[myModules[i].outputsFalse[j]].radius, myModules[myModules[i].outputsFalse[j]].y, myModules[i].rotate,myModules[myModules[i].outputsFalse[j]].rotate)			
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputsFalse[j]].rotate == 1)							
						drawConnection(myModules[i].x+53, myModules[i].y+20, myModules[myModules[i].outputsFalse[j]].x - myModules[myModules[i].outputsFalse[j]].radius, myModules[myModules[i].outputsFalse[j]].y, myModules[i].rotate,myModules[myModules[i].outputsFalse[j]].rotate)
				}
			break;
			
		case "source":
		case "study":
			for (j=0;j<myModules[i].outputs.length;j++)
			{
				if (myModules[i].outputs[j] != -1) {
					
					if (myModules[myModules[i].outputs[j]].selected == true || myModules[i].selected == true || ((lineSelection.fromType == "normal") && (lineSelection.fromModule == i) && (lineSelection.toIndex == j)))
						ctx.strokeStyle="#99CC32";
					else
						ctx.strokeStyle="#7585C1";
					
					if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[j]].rotate == 0)	
						drawConnection(myModules[i].x, myModules[i].y + 36, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[j]].rotate == 0)
						drawConnection(myModules[i].x+36, myModules[i].y, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
					else if (myModules[i].rotate == 0 && myModules[myModules[i].outputs[j]].rotate == 1)	
						drawConnection(myModules[i].x, myModules[i].y+36, myModules[myModules[i].outputs[j]].x - myModules[myModules[i].outputs[j]].radius, myModules[myModules[i].outputs[j]].y, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)			
					else if (myModules[i].rotate == 1 && myModules[myModules[i].outputs[j]].rotate == 1)							
						drawConnection(myModules[i].x+36, myModules[i].y, myModules[myModules[i].outputs[j]].x - myModules[myModules[i].outputs[j]].radius, myModules[myModules[i].outputs[j]].y, myModules[i].rotate,myModules[myModules[i].outputs[j]].rotate)
				}
			}
			break;
			
			
		}
	}
	ctx.strokeStyle="#7585C1";
	//Drawing a Line
	if (makingConnection.connecting==true)
	{
		for (i = 0; i < myModules.length; i++) {
			switch(myModules[i].type)
			{
			case "normal":
				if (myModules[i].connecting == true) {
					if (myModules[i].rotate == 0)
						drawConnection(myModules[i].x, myModules[i].y + 53, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
					else
						drawConnection(myModules[i].x + 53, myModules[i].y, makingConnection.x, makingConnection.y,myModules[i].rotate,0)
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
	}
	
	//Draw the Modules
	for (i = 0; i < myModules.length; i++)
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
	
	if (drawModule.selected == true)
		ctx.strokeStyle = "#99CC32";
	else
		ctx.strokeStyle = "black"
	ctx.beginPath();
	ctx.fillStyle = "LightBlue";
	ctx.lineWidth = "3";
	ctx.beginPath();
	ctx.arc(drawModule.x, drawModule.y, 45, 0, 2 * 3.141592653589792348624, 0);
	ctx.stroke();
	ctx.fill();
	
	if (drawModule.rotate == 0) {
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.arc(drawModule.x, drawModule.y + 53, 5, 0, 2 * 3.141592653589792348624, 0)
		ctx.stroke();
		ctx.fill();
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		
		ctx.beginPath();
		ctx.arc(drawModule.x, drawModule.y - 53, 5, 0, 2 * 3.141592653589792348624, 0)
		ctx.stroke();
		ctx.fill();
	}
	else
	{
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.arc(drawModule.x+53, drawModule.y, 5, 0, 2 * 3.141592653589792348624, 0)
		ctx.stroke();
		ctx.fill();
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		
		ctx.beginPath();
		ctx.arc(drawModule.x-53, drawModule.y , 5, 0, 2 * 3.141592653589792348624, 0)
		ctx.stroke();
		ctx.fill();
	}
}		

function drawConditional (drawModule)
{
		if (drawModule.selected == true)
			ctx.strokeStyle = "#99CC32";
		else
			ctx.strokeStyle = "black"
			
		ctx.beginPath();
		ctx.fillStyle = "LightBlue";
		ctx.lineWidth = "2";
		ctx.fillRect(drawModule.x - 45, drawModule.y - 45, 90, 90);
		ctx.strokeRect(drawModule.x - 45, drawModule.y - 45, 90, 90);
		
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		
		if (drawModule.rotate == 0) {
			ctx.beginPath();
			ctx.arc(drawModule.x, drawModule.y - 53, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(drawModule.x - 20, drawModule.y + 53, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(drawModule.x + 20, drawModule.y + 53, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
		}
		else
		{
			ctx.beginPath();
			ctx.arc(drawModule.x-53, drawModule.y, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(drawModule.x + 53, drawModule.y -20, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(drawModule.x +53, drawModule.y +20, 5, 0, 2 * 3.141592653589792348624, 0)
			ctx.stroke();
			ctx.fill();
		}
}

function drawSource (drawModule)
{
	if (drawModule.selected == true)
		ctx.strokeStyle = "#99CC32";
	else
		ctx.strokeStyle = "black"
			
	ctx.beginPath();
	ctx.fillStyle = "LightGray";
	ctx.lineWidth = "3";
	ctx.beginPath();
	ctx.arc(drawModule.x, drawModule.y, 25, 0, 2 * 3.141592653589792348624, 0);
	ctx.stroke();
	ctx.fill();
	
	if (drawModule.rotate == 0) {
		ctx.lineWidth = "1";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.moveTo(drawModule.x - 8, drawModule.y + 30);
		ctx.lineTo(drawModule.x + 8, drawModule.y + 30);
		ctx.lineTo(drawModule.x, drawModule.y + 45);
		ctx.closePath();
		ctx.stroke();
	}
	else
	{
		ctx.lineWidth = "1";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.moveTo(drawModule.x + 30, drawModule.y- 8);
		ctx.lineTo(drawModule.x + 30, drawModule.y +8);
		ctx.lineTo(drawModule.x + 45, drawModule.y);
		ctx.closePath();
		ctx.stroke();		
	}
	ctx.lineWidth = "3";
}

function drawSink (drawModule)
{
	if (drawModule.selected == true)
		ctx.strokeStyle = "#99CC32";
	else
		ctx.strokeStyle = "black"
		
	ctx.fillStyle = "LightGray";
	ctx.lineWidth = "3";
	
	if (drawModule.rotate == 0) {
		ctx.beginPath();
		ctx.moveTo(drawModule.x - 25, drawModule.y - 25);
		ctx.lineTo(drawModule.x + 25, drawModule.y - 25);
		ctx.lineTo(drawModule.x, drawModule.y + 25);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		
		ctx.lineWidth = "1";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.arc(drawModule.x, drawModule.y - 35, 5, 0, 2 * 3.14159265, 0);
		ctx.stroke();
	}
	
	else
	{
		ctx.beginPath();
		ctx.moveTo(drawModule.x - 25, drawModule.y - 25);
		ctx.lineTo(drawModule.x - 25, drawModule.y + 25);
		ctx.lineTo(drawModule.x + 25, drawModule.y);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		
		ctx.lineWidth = "1";
		ctx.fillStyle = "Gray";
		ctx.beginPath();
		ctx.arc(drawModule.x - 35, drawModule.y, 5, 0, 2 * 3.14159265, 0);
		ctx.stroke();		
	}
	ctx.lineWidth = "3";
}

function drawStudy (drawModule)
{
	if (drawModule.selected == true)
		ctx.strokeStyle = "#99CC32";
	else
		ctx.strokeStyle = "black"
		
	ctx.beginPath();
	ctx.fillStyle = "LightGray";
	ctx.lineWidth = "3";
	
	ctx.strokeRect(drawModule.x-25,drawModule.y-25,50,50);
	ctx.fillRect(drawModule.x-25,drawModule.y-25,50,50);
	
	ctx.lineWidth = "1";
	ctx.fillStyle = "Gray";
	
	if (drawModule.rotate == 0) {
		ctx.beginPath();
		ctx.moveTo(drawModule.x - 8, drawModule.y + 30);
		ctx.lineTo(drawModule.x + 8, drawModule.y + 30);
		ctx.lineTo(drawModule.x, drawModule.y + 45);
		ctx.closePath();
		ctx.stroke();
	}
	else
	{
		ctx.beginPath();
		ctx.moveTo(drawModule.x + 30, drawModule.y-8);
		ctx.lineTo(drawModule.x + 30, drawModule.y + 8);
		ctx.lineTo(drawModule.x + 45, drawModule.y);
		ctx.closePath();
		ctx.stroke();		
	}
	
	ctx.lineWidth = "3";
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