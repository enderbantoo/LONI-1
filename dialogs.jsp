<%@page contentType="text/html" import="java.util.*" %>
<% Date date = new java.util.Date(); %>

<div id="canvas-context-menu">
  <a href="javascript:void(0)" function="openModuleDialog()">Modules</a>
  <a href="javascript:void(0)" function="openDataSourceDialog()">Data source</a>
  <a href="javascript:void(0)" function="openDataSinkDialog()">Data sink</a>
  <a href="javascript:void(0)" function="openStudyDialog()">Study</a>
  <a href="javascript:void(0)" function="openConditionalDialog()">Conditional</a>
  <hr />
  <a href="javascript:void(0)" function="ctm_paste()">Paste</a>
  <a href="javascript:void(0)" function="ctm_select_all()">Select All</a>
</div>

<div id="module-context-menu">
  <a href="javascript:void(0)" function="editDialog()">Edit parameters</a>
  <a href="javascript:void(0)" function="ctm_copy()">Copy</a>
  <a href="javascript:void(0)" function="ctm_rotate()">Rotate</a>
</div>

<form id="masterFormContainer" method="post">
<div id="module-dialog" title="Module Definition" class="tabs dialog" function="ctm_modules()">
	<ul>
		<li><a href="#info-tab">Info</a></li>
		<li><a href="#parameters-tab">Parameters</a></li>
		<li><a href="#execution-tab">Execution</a></li>
        <li><a href="#metadata-tab">Metadata</a></li>
	</ul>
    <div id="info-tab" class="tabs">
    	<ul>
        	<li><a href="#module-tab">Module</a></li>
            <li><a href="#provenance-tab">Provenance</a></li>
        </ul>
        <div id="module-tab" class="tabs">
              <label>Module creation date:</label> 
              <span><%= date %></span><br />
              <label> Name:</label><input type="text" id="name" /> <br />
			  <label> Package:</label><input type="text" id="package" />  <br />
              <label>Package version:</label><input type="text" id="version" /><br />
              <label>Executable version:</label><input type="text" id="executableVersion" />  <br />
              <label>Tags:</label><input type="text" id="tag" /><br />
              <label>Description:</label><textarea type="text" id="description"></textarea><p>&nbsp;</p>
            <ul>
              <li><a href="#website-tab">Website</a></li>
                <li><a href="#citation-tab">Citation</a></li>
                <li><a href="#license-tab">License</a></li>
          </ul>
            <div id="website-tab">
            	<input type="text" id="uri" />
            </div>
            
            <div id="citation-tab">
            	<input id="citation" />
            </div>
            
            <div id="license-tab">
            	<textarea type="text" id="license"></textarea>
            </div>   
      </div>
        
        <div id="provenance-tab">
        	This section is currenly unavailable.
        </div>
    </div>
    
    <div id="parameters-tab">
   	  <div style="width: 140px;" class="para-title">Parameter Name</div>
      <div style=" width: 120px;" class="para-title">Type</div>
      <div style="width: 80px;" class="para-title">State</div>
      <div style="width: 60px;" class="para-title">Required</div>
      <div style="width: 40px;" class="para-title">Input</div>
        <div style="clear: both;"></div>
      <div id="module-paraWrapper">
            
      </div>
       <input name="removeParaButton" type="button" id="removeParaButton" value="Remove" />
       <input name="addParaButton" type="button" id="addParaButton" value="Add" />
    </div>
    
    <div id="execution-tab" class="tabs">
    	<ul>
       	  <li><a href="#execution-environment-tab">Execution Environment</a></li>
            <li><a href="#looping-tab">Looping</a></li>
        </ul>
        <div id="execution-environment-tab">
          <label for="location">Program location</label>
          <input name="location" type="file" id="location" size="20" />
        </div>
        <div id="looping-tab">
        	<p>
        	  <textarea type="text"></textarea>
       	    </p>
        	<p>
            <span style="display: block">Condition parameters</span></p>
        	<p>
        	  <textarea type="text"></textarea>
      	  </p>
          <div style="clear: both"></div>
        </div>
    </div>
    
  <div id="metadata-tab">
    	Sample meta data 
    	  <input type="file" name="location" id="location" />
   	   <hr />
      
       <label for="select"> Metadata Action </label>
       <select name="select" id="select">
         <option value="Append">Append</option>
         <option value="Modify">Modify</option>
         <option value="Remove">Remove</option>
       </select><br />
       <label>Location:</label> <input name="location" type="text" /><br />
      <label>Name: </label><select name="nameOption" id="nameOption">
      <option>Specified</option>
      <option>From input parameter</option>
      <option>From metadata</option>
      <option>Extract out/err stream</option>
      </select> 
	   <input name="nameValue" id="nameValue" /><br />
	   <label>Value: </label>
	   <select name="valueOption" id="valueOption">
          <option>Specified</option>
	     <option>From input parameter</option>
	     <option>From metadata</option>
	     <option>Extract out/err stream</option>
	   </select> 
     <input name="valueValue" id="valueValue" />
  </div>  
</div>

<div id="data-source-dialog" title="Data Source" class="tabs dialog" function="ctm_data_source()">
	<ul>
   	  <li><a href="#info-tab">Info</a></li>
        <li><a href="#inputs-tab">Inputs</a></li>
    </ul>
    <div id="info-tab">
      <label>Module creation date:</label> <span><%= date %></span><br />
      <label> Name:</label><input type="text" id="name" /> <br />
      <label> Package:</label><input type="text" id="package" />  <br />
      <label>Package version:</label><input type="text" id="version" /><br />
      <label>Executable version:</label><input type="text" id="executableVersion" />  <br />
      <label>Tags:</label><input type="text" id="tag" /><br />
      <label>Description:</label><textarea type="text" id="description"></textarea><br />
      <label>Website: </label><input id="uri" />
      <fieldset>
      	<legend>Citations</legend>
      	<textarea type="text" id="citation"></textarea>
      </fieldset>
    </div>
    <div id="inputs-tab">
      <label for="serverAddress">Server Address:</label>
      <select name="serverAddress" id="serverAddress">
        <option value="localhost">localhost</option>
        <option value="cranium.loni.ucla.edu">cranium.loni.ucla.edu</option>
        <option value="pws.loni.ucla.edu">pws.loni.ucla.edu</option>
      </select>
      <br />
      <label for="textarea"></label>
      <textarea name="textarea" id="textarea"></textarea>
    </div>
</div>

<div id="data-sink-dialog" title="Data Sink" class="tabs dialog" function="ctm_data_sink()">
	<ul>
   	  <li><a href="#info-tab">Info</a></li>
        <li><a href="#outputs-tab">Inputs</a></li>
    </ul>
    <div id="info-tab">
      <label>Module creation date:</label> <span><%= date %></span><br />
      <label> Name:</label><input type="text" id="name" /> <br />
      <label> Package:</label><input type="text" id="package" />  <br />
      <label>Package version:</label><input type="text" id="version" /><br />
      <label>Executable version:</label><input type="text" id="executableVersion" />  <br />
      <label>Tags:</label><input type="text" id="tag" /><br />
      <label>Description:</label><textarea type="text" id="description"></textarea><br />
      <label>Website: </label><input type="text" id="uri" />
      <fieldset>
      	<legend>Citations</legend>
      	<textarea type="text" id="citation"></textarea>
      </fieldset>
    </div>
    <div id="outputs-tab">
      <label for="serverAddress">Server Address:</label>
      <select name="serverAddress" id="serverAddress">
        <option value="localhost">localhost</option>
        <option value="cranium.loni.ucla.edu">cranium.loni.ucla.edu</option>
        <option value="pws.loni.ucla.edu">pws.loni.ucla.edu</option>
      </select>
      <br />
      <label for="textarea"></label>
      <textarea name="textarea" id="textarea"></textarea>
    </div>
</div>

<div id="study-dialog" title="Study" class="tabs dialog" function="ctm_study()">
	<ul>
    	<li><a href="#info-tab">Info</a></li>
        <li><a href="#inputs-tab">Inputs</a></li>
        <li><a href="#grouping-tab">Grouping</a></li>
        <li><a href="#matrix-tab">Matrix</a></li>
    </ul>
  
    <div id="info-tab">
      <label>Module creation date:</label> <span><%= date %></span><br />
      <label> Name:</label><input type="text" id="name" /> <br />
      <label> Package:</label><input type="text" id="package" />  <br />
      <label>Package version:</label><input type="text" id="version" /><br />
      <label>Executable version:</label><input type="text" id="executableVersion" />  <br />
      <label>Tags:</label><input type="text" id="tag" /><br />
      <label>Description:</label><textarea type="text" id="description"></textarea><br />
      <label>Website: </label><input id="uri" />
      <fieldset>
      	<legend>Citations</legend>
      	<textarea type="text" id="citation"></textarea>
      </fieldset>
    </div>
    <div id="inputs-tab">
      <label for="serverAddress">Server Address:</label>
      <select name="serverAddress" id="serverAddress">
        <option value="localhost">localhost</option>
        <option value="cranium.loni.ucla.edu">cranium.loni.ucla.edu</option>
        <option value="pws.loni.ucla.edu">pws.loni.ucla.edu</option>
      </select>
      <br />
      <label for="textarea"></label>
      <textarea name="textarea" id="textarea"></textarea>
    </div>
    <div id="grouping-tab">
    	<textarea></textarea>
    </div>
  <div id="matrix-tab">
    	<label>Columns: </label><input type="text" id="matrixColumns" /> 
    	<input name="Generate Matrix" type="button" id="Generate Matrix" value="Generate Matrix" class="button" />
    </div>
</div>

<div id="conditional-dialog" title="Conditional" class="tabs dialog" function="ctm_conditional()">
	<ul>
    	<li><a href="#info-tab">Info</a></li>
        <li><a href="#parameters-tab">Parameters</a></li>
        <li><a href="#conditions-tab">Conditions</a></li>
    </ul>
	
     <div id="info-tab">
      <label>Module creation date:</label> <span><%= date %></span><br />
      <label> Name:</label><input type="text" id="name" /> <br />
      <label> Package:</label><input type="text" id="package" />  <br />
      <label>Package version:</label><input type="text" id="version" /><br />
      <label>Executable version:</label><input type="text" id="executableVersion" />  <br />
      <label>Tags:</label><input type="text" id="tag" /><br />
      <label>Description:</label><textarea type="text" id="description"></textarea><br />
      <label>Website: </label><input id="uri" />
      <fieldset>
      	<legend>Citations</legend>
      	<textarea type="text" id="citation"></textarea>
      </fieldset>
    </div>
    <div id="parameters-tab">
    	<div style="width: 140px;" class="para-title">Parameter Name</div>
      <div style=" width: 120px;" class="para-title">Type</div>
      <div style="width: 80px;" class="para-title">State</div>
      <div style="width: 60px;" class="para-title">Required</div>
      <div style="width: 40px;" class="para-title">Input</div>
        <div style="clear: both;"></div>
      <div id="conditional-paraWrapper">
                
      </div>
       <input name="conditional-removeParaButton" type="button" id="conditional-removeParaButton" value="Remove" />
       <input name="conditional-addParaButton" type="button" id="conditional-addParaButton" value="Add" />
    </div>
    <div id="conditions-tab">
    	<fieldset>
        <legend>Condition Parameters</legend>       
        <textarea></textarea> 
        </fieldset>
    </div>
</div>
</form>