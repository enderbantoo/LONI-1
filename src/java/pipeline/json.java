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

import pipeline.jaxb.Pipeline;

public class json {
    
    public static String encodeJSON(Pipeline pipe) throws IOException
    {
        ObjectMapper mapper = new ObjectMapper();
        ByteArrayOutputStream ostream = new ByteArrayOutputStream();
        mapper.writeValue(ostream, pipe);
        return ostream.toString();
    }
    
    public static Pipeline decodeJSON(String jsonString) throws IOException
    {
        
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonString, Pipeline.class);
    }
}
