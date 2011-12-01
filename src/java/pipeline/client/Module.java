/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline.client;

import java.util.*;
import javax.xml.bind.annotation.*;
/**
 *
 * @author optix2000
 */
public class Module {
    //BASIC VARIABLES
    protected int x;
    protected int y;
    protected String type;
    protected int rotate;
    //CONNECTINGMOVINGCOPYING
    protected boolean dragOK;
    protected boolean connecting;
    protected int copiedIndex;
    
    //OutputInputs
    protected List<Output> outputs;
    protected List<Input> inputs;
    protected List<Output> outputsTrue;
    protected List<Output> outputsFalse;
    
    //Selection and group move
    protected boolean selected;
    protected int groupMoveOffsetX;
    protected int groupMoveOffsetY;
    
    //Information Variables
    protected String idNumber;
    @XmlAttribute(name = "Name")
    protected String Name;
    @XmlAttribute(name = "Authors")
    protected List<Author> Authors;
    protected List<Citation> Citations;
    protected String descriptions;
    protected String packaged;
    @XmlAttribute(name = "URI")
    protected String URI;
    protected List<Tag> tags;
    protected String version;
    protected String license;
    protected String location;
    protected String metadata;
    protected String sourceCode;
    protected String advancedOptions;
    protected List<Author> executableAuthors;
    protected String executableVersion;
    protected String executableProvinence;
    @XmlAttribute(name = "IDAModule")
    protected boolean IDAModule;
    @XmlAttribute(name = "XNATModule")
    protected boolean XNATModule;
    @XmlAttribute(name = "MPIEnabled")
    protected boolean MPIEnabled;
    protected boolean preservedInputFileName;
    protected boolean smartModule;
    
    protected int animationOrder;
    protected int conIndex;
    
    
    //
    
    
    
    public Module(pipeline.jaxb.Module mod)
    {

        //Basic Init
        this.type = "normal";
        this.x = (int) mod.getPosX().longValue();
        this.y = (int) mod.getPosY().longValue();
        //Rotation can sometimes be null. Default is unrotated.
        if (mod.getRotation() != null)
            this.rotate = (int) mod.getRotation().longValue();
        else
            this.rotate = 0;

        
        //Authors init
        this.Authors = new ArrayList<Author>();
        for (pipeline.jaxb.Authors author : mod.getAuthors())
        {
            this.Authors.add(new Author(author));
        }

        this.executableAuthors = new ArrayList<Author>();
        for (pipeline.jaxb.Authors author : mod.getExecutableAuthors())
        {
            this.Authors.add(new Author(author));
        }
        
        //Inputs
        this.inputs = new ArrayList<Input>();
        for (pipeline.jaxb.Parameter input : mod.getInput())
        {
            this.inputs.add(new Input(input));
        }
        
        //Outputs
        this.outputs = new ArrayList<Output>();
        for (pipeline.jaxb.Parameter output : mod.getOutput())
        {
            this.outputs.add(new Output(output));
        }
        
        //Everything else
        this.version = mod.getVersion();
        this.URI = mod.getUri();
        this.advancedOptions = mod.getAdvancedOptions();
        this.descriptions = mod.getDescription();
        this.executableVersion = mod.getExecutableVersion();
        this.license = mod.getLicense();
        this.location = mod.getLocation();
        this.Name = mod.getName();
        this.sourceCode = mod.getSourceCode();
        this.idNumber = mod.getId();
        
    }
    
    public Module(pipeline.jaxb.DataModule mod)
    {
        //Basic init
        if (mod.getOutput() != null)
        {
            this.type = "source";
            this.outputs = new ArrayList<Output>();
            this.outputs.add(new Output(mod.getOutput()));
        }
                    
        else if (mod.getInput() != null)
        {
            this.type = "sink";
            this.inputs = new ArrayList<Input>();
            this.inputs.add(new Input(mod.getInput()));
        }
        
        this.x = (int) mod.getPosX().longValue();
        this.y = (int) mod.getPosY().longValue();
        //Rotation can sometimes be null. Default is unrotated.
        if (mod.getRotation() != null)
            this.rotate = (int) mod.getRotation().longValue();
        else
            this.rotate = 0;

        
        //Authors init
        this.Authors = new ArrayList<Author>();
        for (pipeline.jaxb.Authors author : mod.getAuthors())
        {
            this.Authors.add(new Author(author));
        }
        
        //Everything else
        
        //TODO COMMENTED OUT CODE DUN EXIST IN DATAMODULE
        
        this.version = mod.getVersion();
        this.URI = mod.getUri();
        //this.advancedOptions = mod.getAdvancedOptions();
        this.descriptions = mod.getDescription();
        //this.executableVersion = mod.getExecutableVersion();
        //this.license = mod.getLicense();
        //this.location = mod.getLocation();
        this.Name = mod.getName();
        //this.sourceCode = mod.getSourceCode();
        this.idNumber = mod.getId();
        
        
    }
    
    public Module(pipeline.jaxb.ConditionalModule mod)
    {
        //Basic init
        this.type = "conditional";
        this.x = (int) mod.getPosX().longValue();
        this.y = (int) mod.getPosY().longValue();
        //Rotation can sometimes be null. Default is unrotated.
        if (mod.getRotation() != null)
            this.rotate = (int) mod.getRotation().longValue();
        else
            this.rotate = 0;
        
        //Authors init
        this.Authors = new ArrayList<Author>();
        for (pipeline.jaxb.Authors author : mod.getAuthors())
        {
            this.Authors.add(new Author(author));
        }

        this.executableAuthors = new ArrayList<Author>();
        for (pipeline.jaxb.Authors author : mod.getExecutableAuthors())
        {
            this.Authors.add(new Author(author));
        }
        
        //Inputs
        this.inputs = new ArrayList<Input>();
        for (pipeline.jaxb.Parameter input : mod.getInput())
        {
            this.inputs.add(new Input(input));
        }
        
        //Everything else
        this.version = mod.getVersion();
        this.URI = mod.getUri();
        this.advancedOptions = mod.getAdvancedOptions();
        this.descriptions = mod.getDescription();
        this.executableVersion = mod.getExecutableVersion();
        //TODO COMMENTED OUT STUFF DOESN'T WORK
        //this.license = mod.getLicense();
        this.location = mod.getLocation();
        this.Name = mod.getName();
        //TODO SOURCE CODE IS A LIST FOR CONDITIONALS. LOLWUT?
        //this.sourceCode = mod.getSourceCode();
        this.idNumber = mod.getId();
        
        
        //Outputs
        this.outputsFalse = new ArrayList<Output>();
        this.outputsTrue = new ArrayList<Output>();
        for (pipeline.jaxb.Parameter param : mod.getOutput())
        {
            if (param.getId().matches(".*FALSE"))
            {
                this.outputsFalse.add(new Output(param));
            }
            else if (param.getId().matches(".*TRUE"))
            {
                this.outputsTrue.add(new Output(param));
            }
        }
        
    }
    
    public Module(pipeline.jaxb.StudyModule mod)
    {
        //Basic init
        this.type = "study";
        this.x = (int) mod.getPosX().longValue();
        this.y = (int) mod.getPosY().longValue();
        //Rotation can sometimes be null. Default is unrotated.
        if (mod.getRotation() != null)
            this.rotate = (int) mod.getRotation().longValue();
        else
            this.rotate = 0;

        
        //Authors init
        this.Authors = new ArrayList<Author>();
        for (pipeline.jaxb.Authors author : mod.getAuthors())
        {
            this.Authors.add(new Author(author));
        }
        
        
        //TODO STUDY MODULES DON'T HAVE INPUTS?
        //Inputs
        /*
        this.inputs = new ArrayList<Input>();
        for (pipeline.jaxb.Parameter input : mod.getInput())
        {
            this.inputs.add(new Input(input));
        }
        */
        
        //Output (Only 1 for Study?)
        this.outputs = new ArrayList<Output>();
        this.outputs.add(new Output(mod.getOutput()));
        
        //Everything else
        this.version = mod.getVersion();
        this.URI = mod.getUri();
        
        //TODO COMMENTED OUT CODE DOESN'T EXIST
        //this.advancedOptions = mod.getAdvancedOptions();
        this.descriptions = mod.getDescription();
        //this.executableVersion = mod.getExecutableVersion();
        //this.license = mod.getLicense();
        //this.location = mod.getLocation();
        this.Name = mod.getName();
        //this.sourceCode = mod.getSourceCode();
        this.idNumber = mod.getId();
        
    }

    public List<Author> getAuthors() {
        return Authors;
    }

    public void setAuthors(List<Author> Authors) {
        this.Authors = Authors;
    }

    public boolean isIDAModule() {
        return IDAModule;
    }

    public void setIDAModule(boolean IDAModule) {
        this.IDAModule = IDAModule;
    }

    public boolean isMPIEnabled() {
        return MPIEnabled;
    }

    public void setMPIEnabled(boolean MPIEnabled) {
        this.MPIEnabled = MPIEnabled;
    }

    public String getName() {
        return Name;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public String getURI() {
        return URI;
    }

    public void setURI(String URI) {
        this.URI = URI;
    }

    public boolean isXNATModule() {
        return XNATModule;
    }

    public void setXNATModule(boolean XNATModule) {
        this.XNATModule = XNATModule;
    }

    public String getAdvancedOptions() {
        return advancedOptions;
    }

    public void setAdvancedOptions(String advancedOptions) {
        this.advancedOptions = advancedOptions;
    }

    public int getAnimationOrder() {
        return animationOrder;
    }

    public void setAnimationOrder(int animationOrder) {
        this.animationOrder = animationOrder;
    }

    public int getConIndex() {
        return conIndex;
    }

    public void setConIndex(int conIndex) {
        this.conIndex = conIndex;
    }

    public boolean isConnecting() {
        return connecting;
    }

    public void setConnecting(boolean connecting) {
        this.connecting = connecting;
    }

    public int getCopiedIndex() {
        return copiedIndex;
    }

    public void setCopiedIndex(int copiedIndex) {
        this.copiedIndex = copiedIndex;
    }

    public String getDescriptions() {
        return descriptions;
    }

    public void setDescriptions(String descriptions) {
        this.descriptions = descriptions;
    }

    public boolean isDragOK() {
        return dragOK;
    }

    public void setDragOK(boolean dragOK) {
        this.dragOK = dragOK;
    }

    public List<Author> getExecutableAuthors() {
        return executableAuthors;
    }

    public void setExecutableAuthors(List<Author> executableAuthors) {
        this.executableAuthors = executableAuthors;
    }

    public String getExecutableProvinence() {
        return executableProvinence;
    }

    public void setExecutableProvinence(String executableProvinence) {
        this.executableProvinence = executableProvinence;
    }

    public String getExecutableVersion() {
        return executableVersion;
    }

    public void setExecutableVersion(String executableVersion) {
        this.executableVersion = executableVersion;
    }

    public int getGroupMoveOffsetX() {
        return groupMoveOffsetX;
    }

    public void setGroupMoveOffsetX(int groupMoveOffsetX) {
        this.groupMoveOffsetX = groupMoveOffsetX;
    }

    public int getGroupMoveOffsetY() {
        return groupMoveOffsetY;
    }

    public void setGroupMoveOffsetY(int groupMoveOffsetY) {
        this.groupMoveOffsetY = groupMoveOffsetY;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public List<Input> getInputs() {
        return inputs;
    }

    public void setInputs(List<Input> inputs) {
        this.inputs = inputs;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public List<Output> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<Output> outputs) {
        this.outputs = outputs;
    }

    public List<Output> getOutputsFalse() {
        return outputsFalse;
    }

    public void setOutputsFalse(List<Output> outputsFalse) {
        this.outputsFalse = outputsFalse;
    }

    public List<Output> getOutputsTrue() {
        return outputsTrue;
    }

    public void setOutputsTrue(List<Output> outputsTrue) {
        this.outputsTrue = outputsTrue;
    }

    public String getPackaged() {
        return packaged;
    }

    public void setPackaged(String packaged) {
        this.packaged = packaged;
    }

    public boolean isPreservedInputFileName() {
        return preservedInputFileName;
    }

    public void setPreservedInputFileName(boolean preservedInputFileName) {
        this.preservedInputFileName = preservedInputFileName;
    }

    public int getRotate() {
        return rotate;
    }

    public void setRotate(int rotate) {
        this.rotate = rotate;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public boolean isSmartModule() {
        return smartModule;
    }

    public void setSmartModule(boolean smartModule) {
        this.smartModule = smartModule;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
    
    
    
    
    
    
}
