package com.web.invoice.primarydb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BCryptEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new Encoder();
    }

}
