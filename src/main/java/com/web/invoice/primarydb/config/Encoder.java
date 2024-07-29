package com.web.invoice.primarydb.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import sun.misc.BASE64Encoder;

import java.security.MessageDigest;

public class Encoder implements PasswordEncoder {
    private static MessageDigest digester ;
    private static BASE64Encoder b64encoder = new BASE64Encoder();
    static {
        try {
            digester = MessageDigest.getInstance("MD5");
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public String encode(CharSequence rawPassword) {
        return getMD5(rawPassword.toString());
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return getMD5(rawPassword.toString()).equals(encodedPassword);
    }

    public static String getMD5(String password) {
        try {
            return b64encoder.encode(digester.digest(password.getBytes("UTF-8")));
        } catch (Exception e) {
            return null;
        }
    }
}
