/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline.client;

/**
 *
 * @author optix2000
 */
public class Output {
    
    protected String type;
    protected String name;
    protected String outputID;
    
    //No longer needed
    //protected int offsetX;
    //protected int offsetY;
    //protected List<String>outputsConnectedTo;
    
    
    public Output(pipeline.jaxb.Parameter param)
    {
        this.type = param.getFormat().getType();
        this.outputID = param.getId();
        this.name = param.getName();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOutputID() {
        return outputID;
    }

    public void setOutputID(String outputID) {
        this.outputID = outputID;
    }
    
}
