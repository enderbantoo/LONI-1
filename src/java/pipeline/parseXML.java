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

import pipeline.jaxb.Pipeline;


public class parseXML extends HttpServlet {
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException
    {
        Pipeline root;
        
        try
        {
            root = xml.readXML(request.getInputStream());
        }
        catch(javax.xml.bind.JAXBException e)
        {
            response.sendError(400, e.toString());
            return;
        }
        
        
        //TODO
        
        
        java.io.PrintWriter out = response.getWriter();
        out.print(json.encodeJSON(root));
    }
}
