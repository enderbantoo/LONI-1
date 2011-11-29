/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline;


import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import javax.xml.bind.JAXBException;
import pipeline.xml;
import pipeline.json;
import pipeline.jaxb.Pipeline;
/**
 *
 * @author optix2000
 */
public class parseJSON extends HttpServlet{
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {

        Pipeline root = json.decodeJSON(request.getInputStream().toString());

        
        
        //TODO
        
        
        java.io.PrintWriter out = response.getWriter();
        OutputStream output;
        try
        {
            output = xml.writeXML(root);
        }
        catch(javax.xml.bind.JAXBException e)
        {
            response.sendError(400, e.toString());
            return;
        }
        out.print(output);
    }
}
