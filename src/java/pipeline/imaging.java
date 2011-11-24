/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
/**
 *
 * @author optix2000
 */
public class imaging {
    
    //Decode Base64 encoded JPEG to image.
    public BufferedImage decodeImage(String jpgBase64) throws IOException
    {
        ByteArrayInputStream istream = new ByteArrayInputStream(DatatypeConverter.parseBase64Binary(jpgBase64));
        return ImageIO.read(istream);
    }
    //Encode any (supported) image in Base64 JPEG
    public String encodeJPG(ByteArrayInputStream bImage) throws IOException
    {
        BufferedImage image = ImageIO.read(bImage);
        ByteArrayOutputStream ostream = new ByteArrayOutputStream();
        ImageIO.write(image, "jpg", ostream);
        return DatatypeConverter.printBase64Binary(ostream.toByteArray());
    }
    
    //Output image in Base64 PNG.
    public String encodePNG(ByteArrayInputStream bImage) throws IOException
    {
        BufferedImage image = ImageIO.read(bImage);
        ByteArrayOutputStream ostream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", ostream);
        return DatatypeConverter.printBase64Binary(ostream.toByteArray());
        
    }
}
