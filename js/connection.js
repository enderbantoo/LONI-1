// JavaScript Document

//initial variables
var testMouseX=0;
var testMouseY=0;
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
makingConnection.connectingFrom=-1;
//class variables
 function module(x,y,type,input,output)
 {
 	this.x=x;
	this.y=y;
	this.type=type;
	this.input=input;
	this.output=output;
	this.dragOK = false;
	this.connecting=false;
	this.rotate=0;
	this.checkConnection=checkConnection;
	this.checkConnected=checkConnected;
	this.checkMoving=checkMoving;
	this.outputs=new Array();	
	this.outputsTrue=new Array();
	this.outputsFalse=new Array();
		
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
 	if (mouseX < this.x + 5 + offsetLeft &&
		mouseX > this.x - 5 + offsetLeft &&
		mouseY > this.y - 58 + offsetTop &&
		mouseY < this.y - 48 + offsetTop)
		return true;
	else
		return false;
	case "sink":
 	if (mouseX < this.x + 5 + offsetLeft &&
		mouseX > this.x - 5 + offsetLeft &&
		mouseY > this.y - 38 + offsetTop &&
		mouseY < this.y - 28 + offsetTop)
		return true;
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
		if (mouseX < this.x + 5 + offsetLeft &&
		mouseX > this.x - 5 + offsetLeft &&
		mouseY < this.y + 58 + offsetTop &&
		mouseY > this.y + 48 + offsetTop)
		{
				this.connecting = true;
				return 1;
		}
		else
			return -1;
			
	case "conditional":
		if (mouseX < this.x + 25 + offsetLeft &&
		mouseX > this.x + 15 + offsetLeft &&
		mouseY < this.y + 58 + offsetTop &&
		mouseY > this.y + 48 + offsetTop)
		{
				this.connecting = true;
				this.connectingFalse = true;
				return 2;
		}
		else if (mouseX < this.x - 15 + offsetLeft &&
		mouseX > this.x - 25 + offsetLeft &&
		mouseY < this.y + 58 + offsetTop &&
		mouseY > this.y + 48 + offsetTop)
		{
				this.connecting = true;
				this.connectingTrue = true;
				return 1;
		}
		
		else
			return -1;
	case "source":
	case "study":
		if (mouseX < this.x + 7 + offsetLeft &&
			mouseX > this.x - 7 + offsetLeft &&
			mouseY < this.y + 45 + offsetTop &&
			mouseY > this.y + 30 + offsetTop)
			{
					this.connecting = true;
					return 1;
			}
			else
				return -1;
	
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
 	for (i=0;i<myModules.length;i++)
	{
		switch(myModules[i].type)
		{
		case "study":
		case "source":
		case "normal":
			for (j=0;j<myModules[i].outputs.length;j++)
			{
				if (myModules[i].outputs[j]==index)
					myModules[i].outputs.splice(j, 1)
			}
			break;
			
		case "conditional":
			for (j=0;j<myModules[i].outputsTrue.length;j++)
			{
				if (myModules[i].outputsTrue[j]==index)
					myModules[i].outputsTrue.splice(j, 1)
			}
			for (j=0;j<myModules[i].outputsFalse.length;j++)
			{
				if (myModules[i].outputsFalse[j]==index)
					myModules[i].outputsFalse.splice(j, 1)
			}
			break;
		
		}
	}
 	myModules.splice(index, 1)
 }
 
 
function moveModule(e){
	for (i = 0; i < myModules.length; i++)
	{
		if (myModules[i].dragOK == true) {
			myModules[i].x = e.pageX - canvas.offsetLeft;
			myModules[i].y = e.pageY - canvas.offsetTop;
		}
	}
}
 
function moveLine(e)
{
	makingConnection.x = e.pageX - canvas.offsetLeft;
	makingConnection.y = e.pageY - canvas.offsetTop;

}

//sarashour@gmail.com
//============================================
//        Mouse Manipulations
//============================================
function moduleMouseDown(e){
	var i = 0
	//check if moving module
	for (i = 0; i < myModules.length; i++) {
		if (myModules[i].checkMoving(e.pageX,e.pageY,canvas.offsetLeft,canvas.offsetTop)) {
			myModules[i].x = e.pageX - canvas.offsetLeft;
			myModules[i].y = e.pageY - canvas.offsetTop;
			myModules[i].dragOK = true;
			canvas.onmousemove = moveModule;
			break;
		}
	}
	//check if connecting
	for (i = 0; i < myModules.length; i++) {
		var testConnect = myModules[i].checkConnection (e.pageX,e.pageY,canvas.offsetLeft,canvas.offsetTop);
		if (testConnect >0) {
			makingConnection.connecting = true;
			makingConnection.x = e.pageX - canvas.offsetLeft;
			makingConnection.y = e.pageY - canvas.offsetTop;
			canvas.onmousemove = moveLine;
		}
	}
}

function moduleMouseUp(e){
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
								if (myModules[k].outputsTrue[j] = i) 
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
									if (myModules[k].outputsFalse[j] = i) 
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
	
	for (i = 0; i < myModules.length; i++) {
		myModules[i].dragOK = false;
		myModules[i].connecting=false;
		myModules[i].connectingTrue=false;
		myModules[i].connectingFalse=false;
	}
	
	makingConnection.connecting=false;
	canvas.onmousemove = null;
} 
 
 //initialization
function init()
{
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
		/*createModule(75,50,"normal",1,1);
		createModule(200,200,"normal",1,1);
		createModule(350,350,"normal",1,1);
		deleteModule(2);
		createModule(200,200,"conditional",1,1)
		createModule(150,150,"source",0,1)
		createModule(300,300,"sink",1,0)
		createModule(400,400,"study",0,1)*/
	 return setInterval(draw, 10);
}

init()
canvas.onmousedown = moduleMouseDown;
canvas.onmouseup = moduleMouseUp;

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
	
	//Draw the Modules
	var i = 0;
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
	
	//Draw the connections
	for (i=0; i < myModules.length; i++)
	{
		switch(myModules[i].type)
		{
		case "normal":
			for (j=0;j<myModules[i].outputs.length;j++)
			{
				if (myModules[i].outputs[j] != -1) 
					drawConnection(myModules[i].x, myModules[i].y + 53, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius)
			}
			break;
			
		case "conditional":
			for (j=0;j<myModules[i].outputsTrue.length;j++)
				if (myModules[i].outputsTrue[j] != -1) 
					drawConnection(myModules[i].x - 20, myModules[i].y + 53, myModules[myModules[i].outputsTrue[j]].x, myModules[myModules[i].outputsTrue[j]].y - myModules[myModules[i].outputsTrue[j]].radius)
			for (j=0;j<myModules[i].outputsFalse.length;j++)		
				if (myModules[i].outputsFalse[j] != -1) 
					drawConnection(myModules[i].x + 20, myModules[i].y + 53, myModules[myModules[i].outputsFalse[j]].x, myModules[myModules[i].outputsFalse[j]].y - myModules[myModules[i].outputsFalse[j]].radius)				
			break;
			
		case "source":
		case "study":
			for (j=0;j<myModules[i].outputs.length;j++)
			{
				if (myModules[i].outputs[j] != -1) 
					drawConnection(myModules[i].x, myModules[i].y + 36, myModules[myModules[i].outputs[j]].x, myModules[myModules[i].outputs[j]].y - myModules[myModules[i].outputs[j]].radius)
			}
			break;
			
			
		}
	}
	//Drawing a Line
	if (makingConnection.connecting==true)
	{
		var connectingFrom;
		for (i = 0; i < myModules.length; i++) {
			switch(myModules[i].type)
			{
			case "normal":
				if (myModules[i].connecting == true) {
					makingConnection.connectingFrom = i;
					drawConnection(myModules[i].x, myModules[i].y + 53, makingConnection.x, makingConnection.y)
				}
				break;	
			case "conditional":
				if (myModules[i].connectingTrue == true) {
					drawConnection(myModules[i].x - 20, myModules[i].y + 53, makingConnection.x, makingConnection.y)
					break;
				}
				else 
					if (myModules[i].connectingFalse == true) {
						drawConnection(myModules[i].x + 20, myModules[i].y + 53, makingConnection.x, makingConnection.y)
						break;
					}
				else
					break;
			
			case "source":
			case "study":
				if (myModules[i].connecting == true) {
					makingConnection.connectingFrom = i;
					drawConnection(myModules[i].x, myModules[i].y + 36, makingConnection.x, makingConnection.y)
				}
				break;	
						
			}
		}
	}
}

function drawNormal(drawModule){
	ctx.beginPath();
	ctx.fillStyle = "LightBlue";
	ctx.lineWidth = "3";
	ctx.beginPath();
	ctx.arc(drawModule.x, drawModule.y, 45, 0, 2 * 3.141592653589792348624, 0);
	ctx.stroke();
	ctx.fill();
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

function drawConditional (drawModule)
{
		ctx.beginPath();
		ctx.fillStyle = "LightBlue";
		ctx.lineWidth = "2";
		ctx.fillRect(drawModule.x - 45, drawModule.y - 45, 90, 90);
		ctx.strokeRect(drawModule.x - 45, drawModule.y - 45, 90, 90);
		
		ctx.lineWidth = "3";
		ctx.fillStyle = "Gray";
		
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

function drawSource (drawModule)
{
	ctx.beginPath();
	ctx.fillStyle = "LightGray";
	ctx.lineWidth = "3";
	ctx.beginPath();
	ctx.arc(drawModule.x, drawModule.y, 25, 0, 2 * 3.141592653589792348624, 0);
	ctx.stroke();
	ctx.fill();
	ctx.lineWidth = "1";
	ctx.fillStyle = "Gray";
	ctx.beginPath();
	ctx.moveTo(drawModule.x-8,drawModule.y+30);
	ctx.lineTo(drawModule.x+8,drawModule.y+30);
	ctx.lineTo(drawModule.x,drawModule.y+45);
	ctx.closePath();
	ctx.stroke();
	ctx.lineWidth = "3";
}

function drawSink (drawModule)
{
	ctx.beginPath();
	ctx.fillStyle = "LightGray";
	ctx.lineWidth = "3";
	ctx.beginPath();
	
	ctx.moveTo(drawModule.x-25,drawModule.y-25);
	ctx.lineTo(drawModule.x+25,drawModule.y-25);
	ctx.lineTo(drawModule.x,drawModule.y+25);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.lineWidth = "1";
	ctx.fillStyle = "Gray";
	ctx.beginPath();
	ctx.arc(drawModule.x,drawModule.y-35,5,0,2*3.14159265,0);
	ctx.stroke();
	
	ctx.lineWidth = "3";
}

function drawStudy (drawModule)
{
	ctx.beginPath();
	ctx.fillStyle = "LightGray";
	ctx.lineWidth = "3";
	
	ctx.strokeRect(drawModule.x-25,drawModule.y-25,50,50);
	ctx.fillRect(drawModule.x-25,drawModule.y-25,50,50);
	
	ctx.lineWidth = "1";
	ctx.fillStyle = "Gray";
	ctx.beginPath();
	ctx.moveTo(drawModule.x-8,drawModule.y+30);
	ctx.lineTo(drawModule.x+8,drawModule.y+30);
	ctx.lineTo(drawModule.x,drawModule.y+45);
	ctx.closePath();
	ctx.stroke();
	ctx.lineWidth = "3";
}

function myMove(e)
{
	 if (dragok){
	  x = e.pageX - canvas.offsetLeft;
	  y = e.pageY - canvas.offsetTop;
 	}
}

function drawConnection(x1,y1,x2,y2) {
    var delta_x = x2 - x1;
    var delta_y = y2 - y1;
    var fromRotate=0;
	var toRotate=0;
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
     	if(from.rotate==0 && to.rotate==1) { // Down, 45, Left/Right 
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
function drawULine(x1, y1, x2, y2, direction){
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
		ctx.strokeStyle="#7585C1";
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
		
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