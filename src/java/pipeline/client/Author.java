/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pipeline.client;

/**
 *
 * @author optix2000
 */
public class Author {
    protected String fullName;
    protected String email;
    protected String website;
    
    public Author(pipeline.jaxb.Authors author)
    {
        this.fullName = author.getFullName();
        this.email = author.getEmail();
        this.website = author.getWebsite();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
    
}
