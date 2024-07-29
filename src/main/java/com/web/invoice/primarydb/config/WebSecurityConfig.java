package com.web.invoice.primarydb.config;

import com.web.invoice.primarydb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MyBasicAuthenticationEntryPoint authenticationEntryPoint;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }

    @Value("${mode}")
    private String mode;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String path = mode.equals("develop") ?  "/api/develop/**" : "/api/**";
        http.requestMatchers()
                    .antMatchers("/api-option/**","/api-loyal/**","/api/**")
                    .and()
                .csrf().disable()
                .httpBasic()
                .authenticationEntryPoint(authenticationEntryPoint)
                .and()
                .authorizeRequests()
                .anyRequest().authenticated();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }
}
