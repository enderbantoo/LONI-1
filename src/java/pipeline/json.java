/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline;
/**
 *
 * @author optix2000
 */
//import org.json;
import org.codehaus.jackson.map.ObjectMapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.codehaus.jackson.map.AnnotationIntrospector;

import org.codehaus.jackson.xc.JaxbAnnotationIntrospector;
import pipeline.client.Package;

public class json {
    
    public static String encodeJSON(Package pipe) throws IOException
    {
        ObjectMapper mapper = new ObjectMapper();
        ByteArrayOutputStream ostream = new ByteArrayOutputStream();
        mapper.configure(org.codehaus.jackson.map.SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS, false);
        //Use JAXB introspector for JSON.
        AnnotationIntrospector intro = new JaxbAnnotationIntrospector();
        mapper = mapper.setAnnotationIntrospector(intro);
        mapper.writeValue(ostream, pipe);
        
        return ostream.toString();
    }
    
    public static Package decodeJSON(String jsonString) throws IOException
    {
        
        ObjectMapper mapper = new ObjectMapper();
        //Use JAXB introspector for JSON.
        AnnotationIntrospector intro = new JaxbAnnotationIntrospector();
        mapper = mapper.setAnnotationIntrospector(intro);
        return mapper.readValue(jsonString, Package.class);
    }
}
