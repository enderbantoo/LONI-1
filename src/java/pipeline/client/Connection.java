/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline.client;

/**
 *
 * @author optix2000
 */
public class Connection {
    
    protected int fromIndex;
    protected int toIndex;
    protected int inputIndex;
    protected int outputIndex;
    
    protected boolean isTrue;
    protected boolean isFalse;

    public Connection() {
    }
    
    public Connection(int fIndex, int tIndex, int iIndex, int oIndex)
    {
        this(fIndex, tIndex, iIndex, oIndex, false, false);
    }
    
    public Connection(int fIndex, int tIndex, int iIndex, int oIndex,
            boolean iTrue, boolean iFalse)
    {
        this.fromIndex = fIndex;
        this.toIndex = tIndex;
        this.inputIndex = iIndex;
        this.outputIndex = oIndex;
        
        this.isTrue = iTrue;
        this.isFalse = iFalse;
    }

    public int getFromIndex() {
        return fromIndex;
    }

    public void setFromIndex(int fromIndex) {
        this.fromIndex = fromIndex;
    }

    public int getInputIndex() {
        return inputIndex;
    }

    public void setInputIndex(int inputIndex) {
        this.inputIndex = inputIndex;
    }

    public boolean isIsFalse() {
        return isFalse;
    }

    public void setIsFalse(boolean isFalse) {
        this.isFalse = isFalse;
    }

    public boolean isIsTrue() {
        return isTrue;
    }

    public void setIsTrue(boolean isTrue) {
        this.isTrue = isTrue;
    }

    public int getOutputIndex() {
        return outputIndex;
    }

    public void setOutputIndex(int outputIndex) {
        this.outputIndex = outputIndex;
    }

    public int getToIndex() {
        return toIndex;
    }

    public void setToIndex(int toIndex) {
        this.toIndex = toIndex;
    }
    
}
