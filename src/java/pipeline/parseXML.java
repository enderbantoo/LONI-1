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

import org.apache.tomcat.util.http.fileupload.*;
import java.util.*;

import pipeline.jaxb.Pipeline;
import pipeline.client.Package;

public class parseXML extends HttpServlet {
    
    public void doPost(HttpServletRequest req, HttpServletResponse res)
        throws IOException, ServletException
    {
        
        DiskFileUpload fu = new DiskFileUpload();
        // maximum size before a FileUploadException will be thrown
        fu.setSizeMax(1000000);
        // maximum size that will be stored in memory
        fu.setSizeThreshold(4096);
        // the location for saving data that is larger than getSizeThreshold()
        fu.setRepositoryPath("/tmp");
        
        List fileItems = new ArrayList();
        try
        {
        fileItems = fu.parseRequest(req);
        }
        catch(FileUploadException e)
        {
            res.sendError(400, e.getMessage());
            return;
        }
        //Get file
        Iterator i = fileItems.iterator();
        FileItem xmlFile = (FileItem)i.next();

        InputStream xmlStream = xmlFile.getInputStream();

        Pipeline root;
        
        try
        {
            root = xml.readXML(xmlStream);
        }
        catch(javax.xml.bind.JAXBException e)
        {
            res.sendError(400, e.getMessage());
            return;
        }
        
        //Convert to a client-side object
        Package pack = new Package(root);
        
        //Send as JSON.
        java.io.PrintWriter out = res.getWriter();
        out.print(json.encodeJSON(pack));
    }
}
