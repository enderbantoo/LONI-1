/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package pipeline.client;

/**
 *
 * @author optix2000
 */
        
public class Input {
    protected String type;
    protected String name;
    protected String inputID;
    
    //No longer needed
    //protected int offsetX;
    //protected int offsetY;
    //protected List<String>outputsConnectedTo;

    public Input() {
    }
    
    
    public Input(pipeline.jaxb.Parameter param)
    {
        this.type = param.getFormat().getType();
        this.inputID = param.getId();
        this.name = param.getName();
    }

    public String getInputID() {
        return inputID;
    }

    public void setInputID(String inputID) {
        this.inputID = inputID;
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
    
    

}
