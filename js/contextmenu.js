// dialog	
var openModuleDialog = function(){
	$("#module-dialog").dialog("open");
};

var openDataSourceDialog = function() {
	$('#data-source-dialog').dialog('open');
}

var openDataSinkDialog = function() {
	$('data-sink-dialog').dialog('open');
}

var openStudyDialog = function() {
	$('study-dialog').dialog('open');
}

var openConditionalDialog = function() {
	$('conditional-dialog').dialog('open');
}

// context menus
var option = { width: 150, items: [
				{ text: "New", icon: "", alias: "new", action: menuAction, type: "group", width: 170, items: [
					{ text: "Modules...", icon: "", alias: "ctm_modules", action: openModuleDialog },
					{ type: "splitLine" },
					{ text: "Data source", icon: "", alias: "ctm_data_source", action: openDataSourceDialog },
					{ text: "Data sink", icon: "", alias: "ctm_data_sink", action: openDataSinkDialog },
					{ text: "Study...", icon: "", alias: "ctm_study", action: openStudyDialog },
					{ text: "Conditional...", icon: "", alias: "ctm_conditional", action: openConditionalDialog }
				]},
				{ type: "splitLine" },
				{ text: "Delete", icon: "", alias: "ctm_cut", action: cutModule },
				{ text: "Copy", icon: "", alias: "ctm_copy", action: ctm_copy },
				{ text: "Paste", icon: "", alias: "ctm_paste", action: ctm_paste }, 
				{ text: "Select all", icon: "", alias: "ctm_select_all", action: ctm_select_all },
				{ text: "Rotate", icon: "", alias: "ctm_rotate", action: ctm_rotate }
				
			]
};

function ctm_copy() {
	copyModules.splice(0,copyModules.length);
	
	
	for (i=0;i<myModules.length;i++)
	{
		if (myModules[i].selected == true) {
			
			myModules[i].groupMoveOffsetX = testMouse.X - myModules[i].x;
			myModules[i].groupMoveOffsetY = testMouse.Y - myModules[i].y;
			
			var last = copyModules.length;
			copyModules[last]=new module;
			copyModules[last].copy(myModules[i]);	
			
			copyModules[last].outputs.splice(0,copyModules[last].outputs.length);
			copyModules[last].outputsTrue.splice(0,copyModules[last].outputsTrue.length);
			copyModules[last].outputsFalse.splice(0,copyModules[last].outputsFalse.length);
			copyModules[last].copiedIndex = i;
			
			//copy connections
			/*switch(myModules[i].type)
			{
			case "normal":
			case "source":
			case "study":
				for (k=0;k<myModules[i].outputs.length;k++)
				{
					if (myModules[myModules[i].outputs[k]].selected == true)
					{
						copyModules[last].outputs[copyModules[last].outputs.length] = myModules[i].outputs[k];
					}
				}
				break;
				
			case "conditional":
				for (k=0;k<myModules[i].outputsTrue.length;k++)
				{
					if (myModules[myModules[i].outputsTrue[k]].selected == true)
					{
						copyModules[last].outputsTrue[copyModules[last].outputsTrue.length] = myModules[i].outputsTrue[k];
					}
				}				
				
				for (k=0;k<myModules[i].outputsFalse.length;k++)
				{
					if (myModules[myModules[i].outputsFalse[k]].selected == true)
					{
						copyModules[last].outputsFalse[copyModules[last].outputsFalse.length] = myModules[i].outputsFalse[k];
					}
				}
				break;
			}*/
		}
	}
	
	//fix outputs
	/*for (i=0;i<copyModules.length;i++)
	{
		for (k=0;k<copyModules[i].outputs.length;k++)
		{
			for (j=0;j<copyModules.length;j++)
			{
				if (copyModules[i].outputs[k] == copyModules[j].copiedIndex)
					copyModules[i].outputs[k]=j;
			}
		}
		
		for (k=0;k<copyModules[i].outputsTrue.length;k++)
		{
			for (j=0;j<copyModules.length;j++)
			{
				if (copyModules[i].outputsTrue[k] == copyModules[j].copiedIndex)
					copyModules[i].outputsTrue[k]=j;
			}
		}
		
		for (k=0;k<copyModules[i].outputsFalse.length;k++)
		{
			for (j=0;j<copyModules.length;j++)
			{
				if (copyModules[i].outputsFalse[k] == copyModules[j].copiedIndex)
					copyModules[i].outputsFalse[k]=j;
			}
		}
	}*/
	
	
		
}

function ctm_select_all()
{
	for (i=0;i<myModules.length;i++)
	{
		myModules[i].selected = true;
	}
}

function ctm_paste() {
	for (i = 0; i < myModules.length; i++) {
		myModules[i].selected = false;
	}
	
	var previousLength = myModules.length;
	
	for(i=0;i<copyModules.length;i++)
	{
		var last = myModules.length;
		myModules[last] = new module;
		myModules[last].copy(copyModules[i]);
		myModules[last].x=testMouse.X-copyModules[i].groupMoveOffsetX;
		myModules[last].y=testMouse.Y-copyModules[i].groupMoveOffsetY;
		
		/*for(k=0;k<copyModules[i].outputs.length;k++)
		{
			myModules[last].outputs[k]+= previousLength;
		}
		
		for(k=0;k<copyModules[i].outputsTrue.length;k++)
		{
			myModules[last].outputsTrue[k]+=previousLength;
		}
		
		for(k=0;k<copyModules[i].outputsFalse.length;k++)
		{
			myModules[last].outputsFalse[k]+=previousLength;
		}*/
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
	
}

function menuAction() {
	alert(this.data.alias);
}


function ctm_modules() {
	createModule(testMouse.X,testMouse.Y,"normal",1,1);
}

function ctm_data_source() {
		createModule(testMouse.X,testMouse.Y,"source",0,1);
}

function ctm_study() {
		createModule(testMouse.X,testMouse.Y,"study",0,1);
}

function ctm_data_sink() {
		createModule(testMouse.X,testMouse.Y,"sink",1,0);
	
}

function ctm_conditional() {
		createModule(testMouse.X,testMouse.Y,"conditional",1,1);
}		

function cutModule() {
	for (c=0;c<myModules.length;c++)
	{
		if (myModules[c].selected == true) {
			deleteModule(c);
			c--;
		}
	}
	if (lineSelection.selected == true) {
		
		lineSelection.fromOutput.inputConnectedTo = null;
		lineSelection.toInput.outputConnectedTo = null;
		
		lineSelection.selected = false;
		lineSelection.fromOutput = null;
		lineSelection.toInput = null;
	}
}

function ctm_rotate() {
	for (c = 0; c < myModules.length;c++)
	{
		if (myModules[c].selected == true) {
			myModules[c].rotateModule();
		}
	}
}
