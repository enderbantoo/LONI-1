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
import pipeline.jaxb.Pipeline;


public class parseJSON extends HttpServlet{
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException
    {

        Pipeline root = json.decodeJSON(request.getInputStream().toString());

        
        
        //TODO
        
        
        
        OutputStream output;
        try
        {
            output = xml.writeXML(root);
        }
        catch(JAXBException e)
        {
            response.sendError(400, e.toString());
            return;
        }
        java.io.PrintWriter out = response.getWriter();
        out.print(output);
    }
}
