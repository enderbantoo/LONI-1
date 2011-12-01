/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline.client;

/**
 *
 * @author optix2000
 */

import java.util.*;

public class Package {
    
    protected List<Module> myModules;
    protected List<Connection> myConnections;

    public Package() {
    }
    
    
    public Package(pipeline.jaxb.Pipeline pipe)
    {
        this.myModules = new ArrayList<Module>();
        //Add Modules
        //Note, there is an initial module group at root
        //Thus we get the 0'th module group.
        List<pipeline.jaxb.Module> modules = pipe.getModuleGroup().get(0).getModule();
        for (pipeline.jaxb.Module mod: modules)
        {
            this.myModules.add(new Module(mod));
        }
        //Add Conditionals
        List<pipeline.jaxb.ConditionalModule> conMod = pipe.getModuleGroup().get(0).getConditionalModule();
        for (pipeline.jaxb.ConditionalModule mod: conMod)
        {
            this.myModules.add(new Module(mod));
        }
        //Add Data Modules
        List<pipeline.jaxb.DataModule> dataMod = pipe.getModuleGroup().get(0).getDataModule();
        for (pipeline.jaxb.DataModule mod: dataMod)
        {
            this.myModules.add(new Module(mod));
        }
        //Get Study Modules
        List<pipeline.jaxb.StudyModule> studyMod = pipe.getModuleGroup().get(0).getStudyModule();
        for (pipeline.jaxb.StudyModule mod: studyMod)
        {
            this.myModules.add(new Module(mod));
        }
        
        this.myConnections = new ArrayList<Connection>();
        generateConnections(this.myConnections, this.myModules, pipe);
        
    }
    
    //Grab connections by array index
    private void generateConnections(List<Connection> cons, List<Module> mods, pipeline.jaxb.Pipeline pipe)
    {
        //Get list of connections from file
        
        
        //TODO GEN CONNECTIONS IS BROKEN. MAKE SMALL DUMMY FILE
        //WARNING NAIVE IMPLIMENTATION
        for (pipeline.jaxb.Connection connection : pipe.getConnections().getConnection())
        {
            
            
            int fromIndex = -1;
            int toIndex = -1;
            int inputIndex = -1;
            int outputIndex = -1;
            
            boolean isTrue = false;
            boolean isFalse = false;
            
            String inputID = connection.getSink();
            for (int modIndex=0; modIndex<mods.size(); modIndex++)
            {
                if (inputIndex != -1 || toIndex != -1)
                    break;
                
                Module currMod = mods.get(modIndex);
                
                if (currMod.inputs == null)
                    continue;
                for (int conIndex=0; conIndex<currMod.inputs.size(); conIndex++)
                {

                    if (inputID.equals(currMod.inputs.get(conIndex).inputID))
                    {
                        toIndex = modIndex;
                        inputIndex = conIndex;
                        
                        break;
                    }
                }
            }
            
            String outputID = connection.getSource();
            for (int modIndex=0; modIndex<mods.size(); modIndex++)
            {
                if (outputIndex != -1 || fromIndex != -1)
                    break;
                
                Module currMod = mods.get(modIndex);
                
                if (currMod.type.equals("conditional"))
                {
                        if (outputID.matches(".*TRUE"))
                        {
                            for (int conIndex=0; conIndex<currMod.outputsTrue.size();
                                    conIndex++)
                            {
                                if (outputID.equals(currMod.outputsTrue.get(conIndex).outputID))
                                {
                                    fromIndex = modIndex;
                                    outputIndex = conIndex;
                                    isTrue = true;
                                    
                                    break;
                                }
                            }
                        }
                        else if (outputID.matches(".*FALSE"))
                        {
                            for (int conIndex=0; conIndex<currMod.outputsFalse.size();
                                    conIndex++)
                            {
                                if (outputID.equals(currMod.outputsFalse.get(conIndex).outputID))
                                {
                                    fromIndex = modIndex;
                                    outputIndex = conIndex;
                                    isFalse = true;
                                    
                                    break;
                                }
                            }
                            
                        }
                    
                }
                
                if (currMod.outputs == null)
                    continue;
                for (int conIndex=0; conIndex<currMod.outputs.size(); conIndex++)
                {

                    if (outputID.equals(currMod.outputs.get(conIndex).outputID))
                    {
                        fromIndex = modIndex;
                        outputIndex = conIndex;
                        
                        break;
                    }
                }
            }
            if (fromIndex != -1 && toIndex != -1 && inputIndex != -1 && outputIndex != -1)
                this.myConnections.add(new Connection(fromIndex, toIndex, inputIndex,
                        outputIndex, isTrue, isFalse));
        }
    }
    

    public List<Connection> getMyConnections() {
        return myConnections;
    }

    public void setMyConnections(List<Connection> myConnections) {
        this.myConnections = myConnections;
    }

    public List<Module> getMyModules() {
        return myModules;
    }

    public void setMyModules(List<Module> myModules) {
        this.myModules = myModules;
    }
    

}
