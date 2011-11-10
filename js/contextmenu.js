// dialog	
var openDialog = function(){
	$("#module").dialog("open");
};

// context menus
var option = { width: 150, items: [
				{ text: "New", icon: "", alias: "new", action: menuAction, type: "group", width: 170, items: [
					{ text: "Modules...", icon: "", alias: "ctm_modules", action: openDialog },
					{ type: "splitLine" },
					{ text: "Data source", icon: "", alias: "ctm_data_source", action: ctm_data_source },
					{ text: "Data sink", icon: "", alias: "ctm_data_sink", action: ctm_data_sink },
					{ text: "Study...", icon: "", alias: "ctm_study", action: ctm_study },
					{ text: "Conditional...", icon: "", alias: "ctm_conditional", action: ctm_conditional }
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
			
			myModules[i].groupMoveOffsetX = testMouseX - myModules[i].x;
			myModules[i].groupMoveOffsetY = testMouseY - myModules[i].y;
			
			var last = copyModules.length;
			copyModules[last]=new module;
			copyModules[last].copy(myModules[i]);	
			
			copyModules[last].outputs.splice(0,copyModules[last].outputs.length);
			copyModules[last].outputsTrue.splice(0,copyModules[last].outputsTrue.length);
			copyModules[last].outputsFalse.splice(0,copyModules[last].outputsFalse.length);
			copyModules[last].copiedIndex = i;
			
			//copy connections
			switch(myModules[i].type)
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
			}
		}
	}
	
	//fix outputs
	for (i=0;i<copyModules.length;i++)
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
	}
	
	
		
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
		myModules[last].x=testMouseX-copyModules[i].groupMoveOffsetX;
		myModules[last].y=testMouseY-copyModules[i].groupMoveOffsetY;
		
		for(k=0;k<copyModules[i].outputs.length;k++)
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
		}
	}
	
	for (i=previousLength;i<myModules.length;i++)
	{
		myModules[i].selected = true;
	}
	
}

function menuAction() {
	alert(this.data.alias);
}


function ctm_modules() {
	createModule(testMouseX,testMouseY,"normal",1,1);
}

function ctm_data_source() {
		createModule(testMouseX,testMouseY,"source",0,1);
}

function ctm_study() {
		createModule(testMouseX,testMouseY,"study",0,1);
}

function ctm_data_sink() {
		createModule(testMouseX,testMouseY,"sink",1,0);
	
}

function ctm_conditional() {
		createModule(testMouseX,testMouseY,"conditional",1,1);
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
		switch(lineSelection.fromType)
		{
			case "normal":
				myModules[lineSelection.fromModule].outputs.splice(lineSelection.toIndex,1);
				break;
			case "True":
				myModules[lineSelection.fromModule].outputsTrue.splice(lineSelection.toIndex,1);
				break;
			case "False":
				myModules[lineSelection.fromModule].outputsFalse.splice(lineSelection.toIndex,1);
				break;
		}
		
		lineSelection.selected = false;
		lineSelection.fromModule=-1;
		lineSelection.toIndex=-1;
		lineSelection.fromType="none";
	}
}

function ctm_rotate() {
	for (c = 0; c < myModules.length;c++)
	{
		if (myModules[c].selected == true) {
			if (myModules[c].rotate == 0)
				myModules[c].rotate = 1;
			else
				myModules[c].rotate = 0;
		}
	}
}