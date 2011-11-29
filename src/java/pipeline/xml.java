/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline;

/**
 *
 * @author optix2000
 */
import pipeline.jaxb.Pipeline;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.Marshaller;
import javax.xml.bind.JAXBException;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class xml {
    
    public static Pipeline readXML(InputStream infile)
            throws IOException, JAXBException
    {
        JAXBContext context = JAXBContext.newInstance("pipeline.jaxb");
        Unmarshaller um = context.createUnmarshaller();
        return (Pipeline) um.unmarshal(infile);
    }
    
    public static OutputStream writeXML(Pipeline infile)
            throws IOException, JAXBException
    {
        OutputStream ostream = new ByteArrayOutputStream();
        
        JAXBContext context = JAXBContext.newInstance("pipeline.jaxb");
        Marshaller marshal = context.createMarshaller();
        marshal.marshal(infile, ostream);
        
        return ostream;
    }
    
}
