/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline;


/**
 *
 * @author optix2000
 */


import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

import javax.xml.bind.JAXBException;
import pipeline.client.Package;


public class parseJSON extends HttpServlet{
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException
    {

        Package root = json.decodeJSON(request.getInputStream().toString());

        
        
        //TODO
        response.sendError(404, "SERVER NOT COMPLETE");
        
        
        OutputStream output;
        //try
        {
            //output = xml.writeXML(root);
        }
        //catch(JAXBException e)
        {
            //response.sendError(400, e.toString());
            //return;
        }
        java.io.PrintWriter out = response.getWriter();
        //out.print(output);
    }
}
