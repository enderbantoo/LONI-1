<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/global.css" rel="stylesheet" type="text/css" />
<link href="css/contextmenu.css" rel="stylesheet" type="text/css" />
<link type="text/css" href="css/Aristo/Aristo.css" rel="stylesheet" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.16.custom.min.js"></script>
<script type="text/javascript" src="js/jquery.contextmenu.js"></script>
<script type="text/javascript" src="js/contextmenu.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/jquery.spinner.min.js"></script>
<script type="text/javascript" src="js/jquery.form.js"></script>

<title>LONI 1</title>
</head>
<body>
<div id="global-container">
    <div id="header">
    	<span id="title">LONI <i>pipeline</i></span>
        <div style="clear: both;"></div>
    </div>    
	<p>&nbsp;</p>
    <div style="width: 700px; margin: auto">
      <span class="page-title">Canvas</span><br />
      <div>
      	<div style="float: left;">
          <img src="img/save.png" alt="Save" width="16" height="16" align="absmiddle" /> <span id="save" class="link">Save</span> | <img src="img/load.png" alt="Load a file" width="16" height="16" align="absmiddle" />
          <span id="load-xml" class="link">Load an XML file</span>
        </div>
        <div id="notification"><div id="spinner" style="float: left;"></div>&nbsp;<div id="message"></div></div>
      </div>
      <div style="clear: both;"></div>
      <div id="responseAjax"></div>
      <div id="saveFormDiv" class='yellowWrapper'>
      <form id="SaveXmlForm" method="post">
      	<label>File name: </label><input type="text" id="xml_file" />
      .xml 
       <input type="submit" value="Save" />
       </form>
      </div>
       <div id="loadFormDiv" class="yellowWrapper">
       	<form id="LoadXmlForm" method="post">
       		You can load a file from the server or on your computer:
            <p></p>
            <strong>Server:</strong> <br />
            <%@ include file="load_xml.jsp" %>
         <p></p>
            Your computer: <input name="xml_file_load" type="file" size="30" /> 
            <input type="submit" value="Load file" />
          </form>
       </div> 
       <div style="clear: both; height: 30px;"></div>   
       <section>
       	<canvas id="tabsCanvas" width="700" height="25">
         This text is displayed if your browser does not support HTML5 Canvas.
        </canvas>
		<div id = "omw_scrollpane">
		<canvas id="canvas" width="700" height="600">
         This text is displayed if your browser does not support HTML5 Canvas.
        </canvas>
		</div>
		<div>
			<FORM NAME="animForm">
			<INPUT TYPE=button VALUE=Start NAME="animButton" onClick=buttonCheck()>
			<INPUT TYPE=button VALUE=Stop NAME="resetButton" onClick=buttonCheck_2()>
			</FORM>
		</div>
      <p>&nbsp;</p>
	  <script type="text/javascript" src="js/connection.js"></script>
      </section>
  </div>
  
    
    
</div>
<div id="footer">
Copyright &copy; 2011 UCLA | All rights reserved
</div>
<%@ include file="dialogs.jsp" %>
</body>
</html>