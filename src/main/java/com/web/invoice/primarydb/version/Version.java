package com.web.invoice.primarydb.version;

import java.net.URL;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

public class Version {

    public String getVersion() {
        try{
            String classPath =  this.getClass().getResource( this.getClass().getSimpleName() + ".class").toString();
            String libPath = classPath.substring(0, classPath.indexOf("!"));
            String filePath = libPath + "!/META-INF/MANIFEST.MF";
            Manifest manifest = new Manifest(new URL(filePath).openStream());
            Attributes attr = manifest.getMainAttributes();
            return attr.getValue("Implementation-Version") + " от " +  attr.getValue("Implementation-Timestamp");
        } catch (Exception ex){
//            ex.printStackTrace();
            return "не найдено";
        }
    }

}
